import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import asyncHandler from 'express-async-handler';
import UserModel from '../model/User.js';

export const authenticate = asyncHandler(async(req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if(!token) {
    return next(new AppError('No token, please login', 401));
  };
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await UserModel.findById(payload.sub);
  console.log(req.user);
  if(!req.user) {
    return next(new AppError('User no longer exists', 401));
  }
  next();
});