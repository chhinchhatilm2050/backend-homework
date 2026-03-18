import asyncHandler from 'express-async-handler';
import { CategoryModel } from '../models/category.js';
import { AppError } from '../utils/appError.js';
const createCategory = asyncHandler( async(req, res, next) => {
    const {name, description, icon, imageUrl, isActive } = req.body;
    if(!name) {
        return next(new AppError('Category name is required', 400));
    }
    const existingName = await CategoryModel.findOne({name});
    if(existingName) {
        return next(new AppError("Category name already exitsts", 409));
    }
    const category = new CategoryModel({
        name,
        description,
        icon,
        imageUrl,
        isActive
    });
    await category.save();
    res.status(201).json({
        status: 'success',
        data: {category}
    });
});

const getAllCategory = asyncHandler( async(req, res, next) => {
    const categories = await CategoryModel.find({isActive: true});
    if(categories.length === 0) {
        return next(new AppError('Category not found', 404));
    }
    res.status(200).json({
        status: 'success',
        result: categories.length,
        data: {categories}
    })
});

const getCategoryById = asyncHandler( async(req, res, next) => {
    const category = await CategoryModel.find({_id: req.params.id});
    if(!category) {
        return next(new AppError('Category not found', 400));
    }
    res.status(200).json({
        status: 'success',
        data: {category}
    });
})

export {createCategory, getAllCategory, getCategoryById};