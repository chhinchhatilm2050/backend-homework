import 'dotenv/config'
import express from 'express';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import { globalLimiter } from './middlewares/rateLimit.js';
import { requestLogger} from './middlewares/logger.js';
import helmet from 'helmet';

const app = express();
app.use(requestLogger);
app.use(helmet);
app.use(globalLimiter);
app.use(express.json());

app.use(errorHandler);
app.use(notFound);

export default app;