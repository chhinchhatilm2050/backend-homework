import { Router } from 'express';
import { createUser, getAllUser, getUserById, updateUser, deleteUser } from '../controllers/userControllers.js';
import { registerValidation, updateUserValidation, userIdValidation } from '../validators/userValidators.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { checkOwnership } from '../middlewares/authorize.js';
import UserModel from '../model/User.js';

const userRouter = Router();
userRouter.post('', registerValidation, createUser);
userRouter.use(authenticate);
userRouter.get('',authorize('admin'), getAllUser);
userRouter.get('/:id', userIdValidation, getUserById);
userRouter.put('/:id', updateUserValidation, checkOwnership(UserModel, '_id'), updateUser);
userRouter.delete('/:id', authorize('admin'), deleteUser);

export default userRouter; 