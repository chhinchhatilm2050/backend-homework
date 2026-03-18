import asyncHandler from 'express-async-handler';
import { ReviewModel } from '../models/review.js';
import { ProductModel } from '../models/product.js';
import { AppError } from '../utils/appError.js';
import mongoose from 'mongoose';

const createReview = asyncHandler( async(req, res, next) => {
    const {id} = req.params;
    const { customerName, customerEmail, rating, title, comment, isVerifiedPurchase } = req.body;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return next( new AppError('Invalid id', 400));
    }
    const product = await ProductModel.findById(id);
    if(!product) {
        return next(new AppError('Product not found', 404));
    };

    if(!customerEmail || !customerName || !rating) {
        return next(new AppError('Customer name, email and rating are required', 400));
    };

    const alreadyReviewd = await ReviewModel.findOne({
        product: id,
        customerEmail
    });
    if(alreadyReviewd) {
        return next( new AppError('You already reviewed this product', 409));
    };
    const review = new ReviewModel({
        product: id,
        customerEmail,
        customerName,
        rating,
        title,
        comment,
        isVerifiedPurchase
    });
    await review.save();
    res.status(201).json({
        status: 'success',
        data: {review}
    })
});

const getReviewById = asyncHandler( async(req, res, next) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError('Invalid product ID', 400));
    }
    const product = await ProductModel.findById(id);
    if (!product) {
        return next(new AppError('Product not found', 404));
    };
    const reviews = await ReviewModel.find({product: id}).sort({ createdAt: -1 });
    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: { reviews }
    });
});
const getAllReview = asyncHandler( async(req, res, next) => {
    const reviews = await ReviewModel.find()
    .populate('product', 'name slug price') 
    .sort({ createdAt: -1 });
    if (reviews.length === 0) {
        return next(new AppError('No reviews found', 404));
    }

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: { reviews }
    });
})

export {createReview, getAllReview, getReviewById};


