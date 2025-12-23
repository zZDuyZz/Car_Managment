export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  console.log(`📥 ${req.method} ${req.originalUrl} - ${req.ip}`);
  
  // Log request body for POST/PUT (excluding sensitive data)
  if ((req.method === 'POST' || req.method === 'PUT') && req.body) {
    const logBody = { ...req.body };
    // Hide sensitive fields
    if (logBody.password) logBody.password = '***';
    if (logBody.MatKhau) logBody.MatKhau = '***';
    console.log(`📝 Body:`, logBody);
  }

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - start;
    console.log(`📤 ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    
    // Log error responses
    if (!data.success && data.error) {
      console.log(`⚠️  Error: ${data.message}`);
    }
    
    return originalJson.call(this, data);
  };

  next();
};