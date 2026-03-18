import { Router } from "express";
import { getAllReview, createReview, getReviewById } from "../controllers/reviewController.js";
const reviewRouter = Router();
reviewRouter.post('/:id/reviews', createReview);
reviewRouter.get('/reviews', getAllReview);
reviewRouter.get('/:id/reviews', getReviewById);

export {reviewRouter};