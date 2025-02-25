import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import helmet from 'helmet';
import cors from 'cors';
import { errorLoger, requestLoger } from './middlewares/logger';
import limiter from './middlewares/limiter';
import errorHandler from './middlewares/errorHandler';
import routes from './routes';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.set('trust proxy', 'loopback');

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(routes);
app.use(limiter);
app.use(requestLoger);
app.use(errorLoger);
app.use(errors());
app.use(errorHandler);

app.listen(+PORT);
