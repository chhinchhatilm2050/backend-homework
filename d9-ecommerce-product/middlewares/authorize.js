import asyncHandler from 'express-async-handler';
import AppError from '../utils/appError.js';

export const authorize = (...role) => {
  return (req, res, next) => {
    if (!role.length) {
      return next(new AppError('No roles specified for this route', 500));
    }
    if (!req.user || !role.includes(req.user.role)) {
      return next(
        new AppError(`Role ${req.user?.role} is not authorized to access this route`, 403)
      );
    }
    next();
  };
};

export const checkOwnership = (Model, ownField='author') => {
  return asyncHandler(async(req, res, next) => {
    const resource = await Model.findById(req.params.id);
    if(!resource) {
      return next(new AppError('Resource not found', 404));
    }
    const isOwner = resource[ownField].toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if(!isAdmin && !isOwner) {
      return next(new AppError('You do not have permission to modify this resource', 403));
    }

    req.resource = resource; 
    next();
  });
};