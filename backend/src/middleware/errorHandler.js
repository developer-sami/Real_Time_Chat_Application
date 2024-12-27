export class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log the error for debugging
    // console.error(err.stack);

    // #### Handle specific errors ####

    // MongoDB CastError (invalid ID format)
    if (err.name === 'CastError') {
        const message = `Resource not found with id ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // MongoDB Duplicate Key Error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0]; // Get the field that caused the error
        error = new ErrorResponse(`Duplicate field value entered: ${field}`, 400);
    }

    // Validation Error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message).join(', ');
        error = new ErrorResponse(message, 400);
    }

    // Default error response
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Internal Server Error',
    });
};