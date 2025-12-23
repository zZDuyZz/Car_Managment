// Standard response format utilities

export const successResponse = (data, message = 'Success', pagination = null) => {
  const response = {
    success: true,
    data,
    message
  };
  
  if (pagination) {
    response.pagination = pagination;
  }
  
  return response;
};

export const errorResponse = (message, error = null) => {
  return {
    success: false,
    data: null,
    message,
    error: process.env.NODE_ENV === 'development' ? error : undefined
  };
};

export const paginationInfo = (page, limit, total) => {
  return {
    page: parseInt(page),
    limit: parseInt(limit),
    total: parseInt(total),
    totalPages: Math.ceil(total / limit)
  };
};