import {
  Router, Request, Response, NextFunction,
} from 'express';
import NotFoundError from '../errors/notFoundError';
import userRouter from './users';
import cardRouter from './cards';
import { validateCredentials, validateUser } from '../middlewares/validation';
import { createUser, login } from '../controllers/users';
import auth from '../middlewares/auth';

const router = Router();

router.post('/signup', validateUser, createUser);
router.post('/signin', validateCredentials, login);

router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Маршрут не найден.'));
});

export default router;
