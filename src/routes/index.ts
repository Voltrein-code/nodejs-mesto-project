import { Router, Request, Response } from 'express';
import userRouter from './users';
import cardRouter from './cards';

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req: Request, res: Response) => {
  res.status(404).send({ message: 'Маршрут не найден.' });
});

export default router;
