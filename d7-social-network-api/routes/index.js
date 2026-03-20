import { Router } from "express";
import { userRouter } from "./userRoutes.js";
import { followRouter } from "./followRoutes.js";
const router = Router();
router.use('/users', userRouter);
router.use('/users', followRouter);

export { router };