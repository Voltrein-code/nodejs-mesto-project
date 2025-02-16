import express, { NextFunction, Response } from 'express';
import mongoose from 'mongoose';
import routes from './routes';
import { IRequestWithUser } from './types/express';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: удалить заглушку
app.use((req: IRequestWithUser, res: Response, next: NextFunction) => {
  req.user = {
    _id: '67b1b8f3ec391163a2d931a4',
  };

  next();
});

app.use(routes);

app.listen(+PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Приложение запущено на порту: ${PORT}`);
});
