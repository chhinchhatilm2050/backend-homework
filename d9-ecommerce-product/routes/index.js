import { Router } from 'express';
import userRouter from './userRoutes.js';
import categoryRouter from './categoryRoutes.js';
import commentRouter from './commentRoutes.js';
import postRouter from './postRoutes.js';
import authRouter from './authRoutes.js';

const router = Router();

router.use('/users', userRouter);
router.use('/categories', categoryRouter);
router.use('/comments', commentRouter);
router.use('/posts', postRouter);
router.use('/auth', authRouter);

export default router;
