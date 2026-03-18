import { Router } from "express";
import { categoryRouter } from "./categoryRouters.js";
import { productRouter } from "./productRouter.js";
import { reviewRouter } from "./reviewRouters.js";
const router = Router();
router.use('/category', categoryRouter);
router.use('/products', productRouter);
router.use('/products', reviewRouter);
export {router};