import UserModel from '../model/User.js';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import AppError from '../utils/appError.js';

const generateToken = (userId, payloads, secret, expire) => {
  return jwt.sign(
    {sub: userId, ...payloads},
    secret,
    {issuer: 'ChhatServe', expiresIn: expire}
  );
};

const generatRefreshToken = (userId, secret, expire) => {
  return jwt.sign(
    {sub: userId},
    secret,
    {issuer: 'ChhatServer', expiresIn: expire}
  );
};

export const loign = asyncHandler(async(req, res, next) => {
  const {email, password} = req.body;
  const user = await UserModel.findOne({email}).select('+password email role');
  console.log(password);
  if(!user || !(await user.isMatch(password))) {
    return next(new AppError('User or password incorrect', 400));
  };
  
  const accessToken = generateToken(
    user._id,
    {role: user.role, email: user.email},
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRE_IN
  );

  const refreshToken = generatRefreshToken(
    user._id,
    process.env.JWT_REFRESH_SECRET,
    process.env.JWT_REFRESH_EXPIRE_IN
  );

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  const { password: _password , ...userWithoutPassword }= user.toObject();
  return res.status(200).json({
    status: 'success',
    accessToken,
    user: userWithoutPassword
  });
});

export const logout = asyncHandler(async(req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;
  if(!refreshToken) {
    return next(new AppError('No refresh token', 400));
  };

  const user = await UserModel.findOne({refreshToken}).select('refreshToken');
  if(!user) {
    return next(new AppError('No user found', 404));
  };
  user.refreshToken = null;
  await user.save();

  res.clearCookie(refreshToken);

  res.status(200).json({
    status: 'success',
    message: 'Logout successfully'
  });
});

export const refresh = asyncHandler(async(req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;

  if(!refreshToken) {
    return next(new AppError('No refresh token', 400));
  };

  const decode = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await UserModel.findById(decode.sub).select('refreshToken email role');

  if(!user || user.refreshToken !== refreshToken) {
    return next(new AppError('Invalid refresh token', 401));
  };

  const accessToken = generateToken(
    user._id,
    {
      role: user.role, email: user.email
    },
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRE_IN  
  );

  return res.status(200).json({
    status: 'success',
    accessToken
  });
});