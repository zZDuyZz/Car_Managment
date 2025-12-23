export const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error(`❌ Error: ${err.message}`);
  console.error(`📍 Stack: ${err.stack}`);
  console.error(`🔗 URL: ${req.method} ${req.originalUrl}`);
  console.error(`👤 User: ${req.user?.username || 'Anonymous'}`);

  // Default error response
  let statusCode = 500;
  let message = 'Lỗi hệ thống, vui lòng thử lại sau';
  let error = undefined;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Dữ liệu không hợp lệ';
    error = err.message;
  } else if (err.name === 'UnauthorizedError' || err.message.includes('jwt')) {
    statusCode = 401;
    message = 'Không có quyền truy cập';
    error = 'Token không hợp lệ hoặc đã hết hạn';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Không đủ quyền hạn';
    error = err.message;
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Không tìm thấy dữ liệu';
    error = err.message;
  } else if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 400;
    message = 'Dữ liệu đã tồn tại';
    error = 'Trùng lặp dữ liệu trong hệ thống';
  } else if (err.code && err.code.startsWith('ER_')) {
    // MySQL errors
    statusCode = 500;
    message = 'Lỗi cơ sở dữ liệu';
    error = process.env.NODE_ENV === 'development' ? err.message : undefined;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    data: null,
    message,
    error: process.env.NODE_ENV === 'development' ? error : undefined
  });
};

// Custom error classes
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Not Found') {
    super(message);
    this.name = 'NotFoundError';
  }
}