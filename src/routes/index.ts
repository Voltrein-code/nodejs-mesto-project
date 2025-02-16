import { Router, Request, Response } from 'express';
import userRouter from './users';
import cardRouter from './cards';
import { HttpStatusCode } from '../types/enums';

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req: Request, res: Response) => {
  res.status(HttpStatusCode.NotFoundError).send({ message: 'Маршрут не найден.' });
});

export default router;
