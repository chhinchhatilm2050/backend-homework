import { Router } from "express";
import { createCategory, getAllCategory, getCategoryById } from "../controllers/categoryController.js";
const categoryRouter = Router();
categoryRouter.post('/', createCategory);
categoryRouter.get('/', getAllCategory);
categoryRouter.get('/:id', getCategoryById)

export {categoryRouter};