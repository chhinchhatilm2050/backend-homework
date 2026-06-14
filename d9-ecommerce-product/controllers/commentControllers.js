import CommentModel from '../model/Comment.js';
import AppError from '../utils/appError.js';
import asyncHandler from 'express-async-handler';
import PostModel from '../model/Post.js';
import UserModel from '../model/User.js';

export const createComment = asyncHandler(async(req, res, next) => {
  const {content} = req.body;
  const {post} = req.params;
  const posts = await PostModel.findById(post);
  if(!posts) {
    return next(new AppError('Post not found', 404));
  };

  const author = req.user._id;

  const comment = new CommentModel(
    {
      content,
      author,
      post
    }
  );
  await comment.save();
  await posts.incrementViews();
  res.status(201).json({
    status: 'success',
    data: { comment }
  });
}); 

export const getSingleComment = asyncHandler(async(req, res, next) => {
  const {id} = req.params;
  const comment = await CommentModel.findById(id);
  if(!comment) {
    return next(new AppError('Comment not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { comment }
  });

});

export const updateComment = asyncHandler(async (req, res, next) => {
  const {content} = req.body;
  if(!content) {
    return next(new AppError('You have to input at least 1 field', 400));
  }
  const comment = req.resource;
  const editComment = await CommentModel.findByIdAndUpdate(
    comment._id,
    {
      $set: {content}
    },
    { new : true, runValidators: true}
  );

  res.status(200).json({
    status: 'success',
    data: { editComment }
  });
});

export const deleteComment = asyncHandler(async(req, res, _next) => {
  const comment = req.resource;
  comment.softDelete();

  res.status(200).json({
    status: 'success',
    message: 'Comment delete successfully'
  });
});

export const toggleLikeComment = asyncHandler(async(req, res, next) => {
  const {id, author} = req.params;
  const comment = await CommentModel.findById(id);
  if(!comment) {
    return next(new AppError('Comment not found', 404));
  };

  const user = await UserModel.findById(author);
  if(!user) {
    return next(new AppError('User not found', 404));
  };

  await comment.toggleLike(author);
  const isLiked = comment.likes.some(id => id.toString() === author.toString());

  res.status(200).json({
    status: 'success',
    message: isLiked ? 'Liked' : 'unLike',
    data: {like: comment.likes.length} 
  });
});

