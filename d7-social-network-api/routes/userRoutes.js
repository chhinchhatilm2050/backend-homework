import { Router } from "express";
import { createUser, getUserById, getUserPosts, updateUser } from "../controllers/userController.js";
const userRouter = Router();
userRouter.post('', createUser);
userRouter.get('/:id', getUserById);
userRouter.put('/:id', updateUser);
userRouter.get('/:id/posts', getUserPosts);

export {userRouter};