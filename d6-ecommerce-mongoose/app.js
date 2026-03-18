import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import { router } from './routes/index.js';

const app = express();

app.use(morgan('combined'));
app.use(helmet());
app.use(express.json());

app.use('/api', router);

app.use(notFound);
app.use(errorHandler);

export default app;