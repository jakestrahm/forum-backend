const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {

    let error = { ...err }

    error.message = err.message

    //logging for dev
    console.log('>>> err: ', err)


    /* mongoose errors*/
    //bad objectid
    if (err.name === 'CastError') {
        const message = `resource with id ${err.value} not found`
        error = new ErrorResponse(message, 404)
    }

    //duplicate key
    if (err.code === 11000) {
        const message = 'duplicate field value entered'
        error = new ErrorResponse(message, 400);
    }

    //validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message)
        error = new ErrorResponse(message, 404)
    }

    res.
        status(error.statusCode || 500).json({
            success: false,
            error: error.message || 'server error'
        })
};

module.exports = errorHandler;
