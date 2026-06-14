import { Router } from 'express';
import { loign, logout, refresh } from '../controllers/authController.js';

const authRouter = Router();
authRouter.post('/login', loign);
authRouter.post('/refresh', refresh);
authRouter.post('/logout', logout);

export default authRouter;