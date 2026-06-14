import { Router } from 'express';
import { createCategory, getAllCategory, getCategoryById, updateCategory, deleteCategory } from '../controllers/categoryControllers.js';
import { createCategoryValidation, updateCategoryValidation, categoryIdValidation } from '../validators/categoryValidator.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkOwnership } from '../middlewares/authorize.js';
import CategoryModel from '../model/Category.js';

const categoryRouter = Router();
categoryRouter.use(authenticate);
categoryRouter.post('', createCategoryValidation, createCategory);
categoryRouter.get('', getAllCategory);
categoryRouter.get('/:id', categoryIdValidation, getCategoryById);
categoryRouter.put('/:id', categoryIdValidation, updateCategoryValidation, checkOwnership(CategoryModel), updateCategory);
categoryRouter.delete('/:id', categoryIdValidation, checkOwnership(CategoryModel), deleteCategory);

export default categoryRouter;
