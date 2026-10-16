export const successResponse = (
    res,
    statusCode,
    message,
    data = null,
    pagination = null
) => {
    const response = {
        success: true,
        message
    };

    if (data !== null) {
        response.data = data;
    }

    if (pagination !== null) {
        response.pagination = pagination;
    }

    return res.status(statusCode).json(response);
};

export const errorResponse = (
    res,
    statusCode,
    message,
    errors = null
) => {
    const response = {
        success: false,
        message
    };

    if (errors !== null) {
        response.errors = errors;
    }

    return res.status(statusCode).json(response);
};