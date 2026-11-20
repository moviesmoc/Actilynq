import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { seedDemoDataIfRequested } from './seed/demoSeed.js';

import authRoutes from './routes/authRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import actionRoutes from './routes/actionRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import demoRoutes from './routes/demoRoutes.js';
import { getDashboardSummary } from './controllers/reportController.js';
import { requireAuth } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root .env and local fallback
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

const app = express();

// Security Middleware (Configured for Google Identity Services & SPA compatibility)
app.use(
  helmet({
    contentSecurityPolicy: false, // Ensures SPA scripts load smoothly in single-service mode
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }, // Allows Google OAuth popup postMessage communication
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' } // Allows Google to verify Authorized JavaScript origin
  })
);

// CORS configuration (enables local Vite dev while supporting credentials)
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_ORIGIN
].filter(Boolean);

app.use(
  cors({
    origin: isProduction ? true : (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev for testing
      }
    },
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

// Trust first proxy on platforms like Render
app.set('trust proxy', 1);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'ActiLynq API',
    environment: process.env.NODE_ENV || 'development',
    time: new Date().toISOString()
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/demo', demoRoutes);

// Direct Dashboard API alias matching prompt spec
app.get('/api/dashboard/summary', requireAuth, getDashboardSummary);

// 404 Catch-all for API routes (must be registered before SPA fallback)
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// Production: Serve React static build and handle client-side routing
if (isProduction) {
  const clientDist = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDist));

  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Global Centralized Error Handler
app.use(errorHandler);

// Port Configuration (DO NOT hardcode on Render; use process.env.PORT)
const PORT = process.env.PORT || 5000;

let server;

export async function startServer() {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
      await seedDemoDataIfRequested();
    } else {
      console.warn('[Warning] MONGODB_URI not defined. Server running without initial DB connection.');
    }

    server = app.listen(PORT, () => {
      console.log(`[ActiLynq Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
    return server;
  } catch (error) {
    console.error('[Startup Failure]:', error);
    process.exit(1);
  }
}

// Only start immediately if this file is executed directly (not imported in tests)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer();
}

export default app;
