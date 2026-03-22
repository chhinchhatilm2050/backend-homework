import 'dotenv/config';
import express from 'express';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import { globalLimiter } from '../d7-social-network-api/middlewares/rateLimit.js';
import { requestLogger } from '../d7-social-network-api/middlewares/logger.js';
import helmet from 'helmet';

const app = express();
app.use(helmet());
app.use(globalLimiter);
app.use(requestLogger);
app.use(express.json());

app.use(errorHandler);
app.use(notFound);

export default app;