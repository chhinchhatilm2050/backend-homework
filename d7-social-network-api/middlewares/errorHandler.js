import AppError from "../utils/appError.js";
const errorHandler = (err, req, res, next) => {
    const isDev = process.env.NODE_ENV === 'development';
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(err.name === 'CastError') {
        err.statusCode = 400;
        err.status = 'fail';
        err.message = `Invalid ${err.path}: ${err.value}`;
    }

    if(err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const messages = {
            follower: 'You are already following this user',
            email: 'This email is already exists',
            username: 'This username is already exists'
        };
        err.statusCode = 400;
        err.status = 'fail';
        err.message = messages[field] || `${field} already exists`;
    }
    
    console.error(`${err.status.toUpperCase()} ${err.statusCode}`);
    console.error(`Message: ${err.message}`);
    

    if(isDev) {
        console.log(`Stack: ${err.stack}`);
    }

    if(isDev) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err.message,
            stack: err.stack
        })
    }else {
        if(err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                error: err.message,
            })
        }else {
            res.status(err.statusCode).json({
                status: err.status,
                message: 'Something went wrong' 
            })
        }
    }
}

const notFound = (req, res, next) => {
    const error = new AppError(`Cannot find ${req.originalUrl}`, 404);
    next(error);
}
export {errorHandler, notFound};