import { ZodError } from 'zod';

export function errorHandler(err, req, res, next) {
  // Handle Zod Validation Errors safely (prevent Node 24 util.inspect crash on ZodError)
  if (err instanceof ZodError || err?.name === 'ZodError' || Array.isArray(err?.issues)) {
    const issues = (err.issues || []).map((issue) => ({
      field: Array.isArray(issue.path) ? issue.path.join('.') : String(issue.path || ''),
      message: issue.message
    }));
    console.error('[API Validation Error]:', issues.map(i => `${i.field}: ${i.message}`).join(', '));
    return res.status(400).json({
      success: false,
      error: issues[0]?.message || 'Validation failed',
      details: issues
    });
  }

  // Safe error logging for standard and database errors
  console.error('[API Error]:', err?.stack || err?.message || err);

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
