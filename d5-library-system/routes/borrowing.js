import { Router } from "express";
import { insertBorrowings, overdueBorrowings, deleteReturnBook } from "../controllers/borrowings-collection.js";
const borrowingRoutes = Router();
borrowingRoutes.post('/borrowings', insertBorrowings);
borrowingRoutes.get('/borrowings/overdue', overdueBorrowings);
borrowingRoutes.delete('/borrowings/deletereturnbook',deleteReturnBook)
export { borrowingRoutes };