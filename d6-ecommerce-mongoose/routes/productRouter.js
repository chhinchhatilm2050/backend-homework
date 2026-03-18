import { Router } from "express";
import { createProduct, getAllProduct } from "../controllers/productController.js";
const productRouter = Router();
productRouter.post('/', createProduct);
productRouter.get('/', getAllProduct);

export {productRouter};