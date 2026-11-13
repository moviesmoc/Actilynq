# ActiLynq — Public Deployment & Hosting Guide

This guide describes how to deploy **ActiLynq** as a single web service on **Render** backed by **MongoDB Atlas Free Tier (M0)**.

---

## 1. Step-by-Step Deployment on Render

ActiLynq is structured as a **single web service**:
- The Express server compiles and serves the React application statically from `client/dist`.
- API endpoints are served from the same domain under `/api`.
- Client and API share the same origin, eliminating dual-domain CORS issues.

### Step A: Push Code to GitHub / Git Repository
Ensure all code and lockfiles are pushed to your Git repository:
```bash
git add .
git commit -m "Complete ActiLynq MERN MVP"
git push origin master
```

### Step B: Create MongoDB Atlas Database
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Sandbox Cluster**.
3. Under **Database Access**, create a database user (e.g., `actilynq_admin`) with a strong password.
4. Under **Network Access**, add IP Address `0.0.0.0/0` (Allow access from anywhere) so Render web services can connect.
5. Click **Connect** $\rightarrow$ **Drivers** $\rightarrow$ Copy the connection string:
   ```text
   mongodb+srv://actilynq_admin:<password>@cluster0.xxxxx.mongodb.net/actilynq?retryWrites=true&w=majority
   ```

### Step C: Create Web Service on Render
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** $\rightarrow$ **Web Service**.
3. Connect your ActiLynq Git repository.
4. Configure the service settings:
   - **Name:** `actilynq` (or your chosen name)
   - **Region:** Singapore / Frankfurt / Oregon (choose closest to target users)
   - **Branch:** `master` (or `main`)
   - **Runtime:** `Node`
   - **Build Command:**
     ```bash
     npm run build
     ```
   - **Start Command:**
     ```bash
     npm start
     ```
   - **Instance Type:** `Free`

### Step D: Configure Environment Variables in Render Dashboard
Under **Environment Variables**, add:

| Variable Name | Value / Placeholder | Description |
|---|---|---|
| `NODE_ENV` | `production` | Enables static React asset serving & secure cookies |
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | *(Generate a 32+ char random string)* | Secret key for signing session tokens |
| `SEED_DEMO_DATA` | `true` | Automatically seeds 11 demonstration travel scenarios on startup |
| `DEMO_EMAIL` | `demo@actilynq.com` | Demonstration login email |
| `DEMO_PASSWORD` | `DemoPassword123!` | Demonstration login password |

> **Note on PORT:** Do **NOT** set `PORT=5000` in Render environment variables. Render dynamically injects its own `PORT` variable into `process.env.PORT`.

5. Click **Deploy Web Service**.

---

## 2. Post-Deployment Verification (Smoke Test)

Once Render finishes deploying:
1. Open the public HTTPS URL (e.g. `https://actilynq.onrender.com`).
2. Verify that `/api/health` returns:
   ```json
   { "status": "ok", "service": "ActiLynq API", "environment": "production" }
   ```
3. Test direct deep-link navigation (e.g., refresh `https://actilynq.onrender.com/actions`) $\rightarrow$ Express SPA wildcard fallback must serve `index.html` without returning 404.
4. Log in using the demo account credentials.
5. Verify all 11 travel scenarios appear in Dashboard, Action Center, and Pipeline.

---

## 3. Free-Tier Limitations & Hosting Caveats

Document these points for faculty evaluators:
1. **Render Free Tier Spin-Down:**
   - Free Render web services spin down after 15 minutes of inactivity.
   - When a faculty member visits the link for the first time, it may take **50–60 seconds** for the service to wake up (cold start). Subsequent requests will respond instantly.
2. **MongoDB Atlas Storage Limit:**
   - Atlas M0 free clusters provide **512 MB** storage and shared RAM, which is more than sufficient for thousands of travel enquiry and activity records.
3. **Session Cookie Security:**
   - In production (`NODE_ENV=production`), cookies are issued with `Secure: true` and `SameSite: 'lax'`, meaning cookies will only be transmitted over HTTPS connections.
