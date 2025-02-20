import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import UnauthorizedError from '../errors/unauthorizedError';
import { JWT_SECRET } from '../constans/config';
import { IRequestWithUser } from '../types/express';

type JSONWebTokenPayload = {
  _id: string;
} | undefined;

const auth = (req: IRequestWithUser, res: Response, next: NextFunction) => {
  const { token } = req.cookies;

  try {
    req.user = jwt.verify(token, JWT_SECRET) as JSONWebTokenPayload;
    next();
  } catch {
    next(new UnauthorizedError('Доступ запрещен, необходима авторизация'));
  }
};

export default auth;
