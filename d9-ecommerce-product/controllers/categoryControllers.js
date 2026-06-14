import CategoryModel from '../model/Category.js';
import AppError from '../utils/appError.js';
import asyncHandler from 'express-async-handler';

export const createCategory = asyncHandler(async(req, res, _next) => {
  const author = req.user._id;
  const {name, description, color} = req.body;
  const category = new CategoryModel({
    name,
    description,
    color,
    author
  });
  await category.save();

  res.status(201).json({
    status: 'success',
    data: { category }
  });
});

export const getAllCategory = asyncHandler (async(req, res, next) => {
  const categories = await CategoryModel.find();
  if(!categories) {
    return next(new AppError('No category', 404));
  }
  res.status(200).json({
    status: 'success',
    result: categories.length,
    data: { categories}
  });
});

export const getCategoryById = asyncHandler (async(req, res, next) => {
  const category = await CategoryModel.findOne({_id: req.params.id, isDeleted: false});
  if(!category) {
    return next(new AppError('Category not found', 404));
  }
  res.status(200).json({   
    status: 'success',
    data: {category}
  });
});

export const updateCategory = asyncHandler (async (req, res, _next) => {
  const { name, description, color } = req.body;
  const category = req.resource;
  
  const updateCategory = await CategoryModel.findByIdAndUpdate(
    category._id,
    { $set: {name, description, color}},
    { new: true, runValidators: true}
  );

  res.status(200).json({
    status: 'success',
    data: { updateCategory }
  });
});

export const deleteCategory = asyncHandler (async (req, res, _next) => {
  const category = req.resource;
  category.softDelete();
  
  res.status(200).json({
    status: 'success',
    message: 'Category was deleted successfully'
  });
});