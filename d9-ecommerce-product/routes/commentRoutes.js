import { Router } from 'express';
import { getSingleComment, createComment, toggleLikeComment, updateComment, deleteComment } from '../controllers/commentControllers.js';
import { commentIdValidation, createCommentValidation, updateCommentValidation } from '../validators/commentValidators.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkOwnership } from '../middlewares/authorize.js';
import CommentModel from '../model/Comment.js';

const commentRouter = Router();
commentRouter.use(authenticate);
commentRouter.post('/:post', createCommentValidation, createComment);
commentRouter.get('/:id', commentIdValidation, getSingleComment);
commentRouter.put('/:id', updateCommentValidation, checkOwnership(CommentModel), updateComment);
commentRouter.delete('/:id/comment/:userId', commentIdValidation, checkOwnership(CommentModel), deleteComment);
commentRouter.post('/:id/like/:userId', commentIdValidation, toggleLikeComment);

export default commentRouter;