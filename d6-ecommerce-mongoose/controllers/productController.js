import asyncHandler from 'express-async-handler';
import { ProductModel } from '../models/product.js';
import { CategoryModel } from '../models/category.js';
import { AppError } from '../utils/appError.js';
import mongoose from 'mongoose';

const createProduct = asyncHandler( async(req, res, next) => {
    const {name, description, price, comparePrice, category, sku, stock, images, tags, specifications, status,featured } = req.body;
    if(!mongoose.Types.ObjectId.isValid(category)) {
        return next(new AppError("Invalid category ID", 400));
    };
    const categoryExists = await CategoryModel.findById(category);
    if(!categoryExists) {
        return next( new AppError('Category not found', 400));
    }
    const skuExists = await ProductModel.findOne({sku: sku.toUpperCase()});
    if(skuExists) {
        return next( new AppError('SKU already exists', 409));
    }
    if(!Array.isArray(images) || images.length === 0) {
        return next( new AppError("Product must have at least 1 image", 400));
    }
    if(comparePrice && comparePrice <= price) {
        return next(new AppError('Compare price must be greater than price', 400));
    }

    const product = new ProductModel({
        name,
        description,
        price,
        comparePrice,
        category,
        sku,
        stock,
        images,
        tags,
        specifications,
        status,
        featured
    });
    await product.save();
    res.status(201).json({
        status: 'success',
        data: {product}
    })
});

const getAllProduct = asyncHandler( async(req, res, next) => {
    const {category, inStock} = req.query;
    const filter = { status: 'active' };
    if(category) {
        if(mongoose.Types.ObjectId.isValid(category)) {
            const categoryExists = await CategoryModel.findById(category);
            if(!categoryExists) {
                return next(new AppError("Cagegory not found", 404));
            };
            filter.category = category;
        } else {
            const categorySlung = await CategoryModel.findOne({slug: category});
            if(!categorySlung) {
                return next(new AppError("Cagegory not found", 404));
            };
            filter.category = categorySlung._id;
        }
    }

    if(inStock !== undefined) {
        if(inStock === 'true') {
            filter.stock = {$gt: 0},
            filter.status = 'active'
        } else {
            filter.stock = 0,
            filter.status = 'out_of_stock'
        }
    }
    
    const products = await ProductModel.find(filter)
        .populate('category', 'name slug')
        .sort({createdAt: -1});

    if (products.length === 0) {
        return next(new AppError('No products found', 404));
    };
    res.status(200).json({
        status: 'success',
        results: products.length,
        data: { products }
    })
});

export {createProduct, getAllProduct};