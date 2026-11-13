import { ZodError } from 'zod';

export function errorHandler(err, req, res, next) {
  console.error('[API Error]:', err);

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const issues = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message
    }));
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: issues
    });
  }

  // Handle Mongoose Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    const duplicateFields = Object.keys(err.keyPattern || {}).join(', ');
    return res.status(409).json({
      success: false,
      error: `A record with this ${duplicateFields || 'value'} already exists.`
    });
  }

  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: messages.join('; ')
    });
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: `Invalid identifier format: ${err.value}`
    });
  }

  // Default server error
  const isProd = process.env.NODE_ENV === 'production';
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: isProd && statusCode === 500 ? 'An unexpected internal server error occurred.' : err.message || 'Server error',
    ...(isProd ? {} : { stack: err.stack })
  });
}
