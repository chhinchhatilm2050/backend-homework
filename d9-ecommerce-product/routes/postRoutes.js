import { Router } from 'express';
import PostModel from '../model/Post.js';
import { createPostValidation, updatePostValidation, getPostValidation, postIdValidation } from '../validators/postValidators.js';
import { createPost, getPostWithAllQuery, updatePost, deletePost, getSinglePost, likePost} from '../controllers/postController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkOwnership } from '../middlewares/authorize.js';

const postRouter = Router();
postRouter.use(authenticate);
postRouter.post('', createPostValidation, createPost);
postRouter.get('/:id', postIdValidation, getSinglePost);
postRouter.get('', getPostValidation, getPostWithAllQuery);
postRouter.put('/:id', postIdValidation, updatePostValidation, checkOwnership(PostModel), updatePost);
postRouter.delete('/:id/post/:authorId', postIdValidation, checkOwnership(PostModel), deletePost);
postRouter.post('/:id/like', postIdValidation, likePost);

export default postRouter;