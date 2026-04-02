import 'dotenv/config';
import express from 'express';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import notFound from './middlewares/nofFound.js';
import globalLimiter from './middlewares/rateLimit.js';
import helmet from 'helmet';
import requestLogger from './middlewares/logger.js';
import mongoSanitize from 'express-mongo-sanitize';

const app = express();
app.use(express.json());
app.use(helmet());
app.use(globalLimiter);
app.use(requestLogger);
app.use(mongoSanitize());

app.use(notFound);
app.use(globalErrorHandler);

export default app;