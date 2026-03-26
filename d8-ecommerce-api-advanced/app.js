import 'dotenv/config';
import express from 'express';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import notFound from './middlewares/notFound.js';
import { globalLimiter } from '../d7-social-network-api/middlewares/rateLimit.js';
import { requestLogger } from '../d7-social-network-api/middlewares/logger.js';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import router from './routes/index.js';

const app = express();
app.use(helmet());
app.use(globalLimiter);
app.use(requestLogger);
app.use(express.json());
app.use(mongoSanitize());

app.use('/api', router);

app.use(globalErrorHandler);
app.use(notFound);

export default app;