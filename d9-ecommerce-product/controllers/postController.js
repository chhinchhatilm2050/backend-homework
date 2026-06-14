import PostModel from '../model/Post.js';
import asyncHandler from 'express-async-handler';
import CategoryModel from '../model/Category.js';
import UserModel from '../model/User.js';
import AppError from '../utils/appError.js';
import QueryBuilder from '../utils/queryBuilder.js';

export const createPost = asyncHandler (async(req, res, next) => {
  const {category} = req.body;
  const existingcategory = await CategoryModel.findById(category);
  if(!existingcategory) {
    return next(new AppError('Category not found!', 404));
  };

  const createPost = new PostModel({
    ...req.body,
    author: req.user._id
  });
  await createPost.save();

  existingcategory.incrementPostCount();

  res.status(201).json({
    status: 'success',
    data: {createPost}
  });
});

export const getSinglePost = asyncHandler(async(req, res, next) => {
  const post = await PostModel.findOne({_id: req.params.id, isDeleted: false})
    .populate('author', 'name')
    .populate({
      path: 'comments', 
      select: 'content likes',
      populate: {
        path: 'author',
        select: 'name'
      }
    });
  if(!post) {
    return next(new AppError('Post not found', 404));
  }
  
  post.incrementViews();
  res.status(200).json({
    status: 'success',
    data: {post}
  });
});

export const getPostWithAllQuery = asyncHandler (async(req, res, _next) => {
  const posts = await new QueryBuilder(PostModel, req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate()
    .execute();
    
  res.status(200).json({
    status: 'success',
    pagination: posts.pagination,
    data: {posts: posts.data}
  });
});

export const updatePost = asyncHandler( async(req, res, next) => {
  const {category, title, content, excerpt, tags, status, featured, featuredImage } = req.body;
  if(!category && title && !content && !excerpt && !tags && !status && !featured && !featuredImage) {
    return next(new AppError('You have to input at least 1 field to update', 400));
  }
  if(category) {
    const existingCategory = await CategoryModel.findById(category);
    if(!existingCategory) {
      return next(new AppError('Category not found', 404));
    }
  };

  const post = req.resource;
  
  const updatePost = await PostModel.findByIdAndUpdate(
    post._id,
    {$set: {...req.body, updatedBy: req.user.sub}},
    {new: true, runValidators: true}
  );

  res.status(200).json({
    status: 'success',
    data: {updatePost}
  });
});

export const deletePost = asyncHandler(async(req, res, _next) => {
  const post = req.resource;

  const categoryId = post.category;
  const existCategory = await CategoryModel.findById(categoryId);

  await post.softDelete();
  await post.save();
  
  if(existCategory) {
    existCategory.decrementPostCount();
  }
  
  res.status(200).json({
    status: 'success',
    message: 'Post delete successfully'
  });
});

export const likePost = asyncHandler(async(req, res, next) => {
  const {userId} = req.body;
  const user = await UserModel.findById(userId);
  if(!user) {
    return next(new AppError('User not found', 404));
  }
  const post = await PostModel.findById(req.params.id);
  if(!post) {
    return next(new AppError('Post not found', 404));
  };
  await post.toggleLike(userId);
  post.incrementViews();
  const isLiked = post.likes.some(id => id.toString() === userId.toString());
  res.status(201).json({
    status: 'success',
    message: isLiked ? 'Post liked' : 'Post unlike',
    data: {like: post.likes.length}
  });
});