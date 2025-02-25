import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IRequestWithUser } from '../types/express';
import User from '../models/user';
import { HttpStatusCode } from '../types/enums';
import NotFoundError from '../errors/notFoundError';
import BadRequestError from '../errors/badRequestError';
import { JWT_SECRET } from '../constans/config';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    res.send({ data: users });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    });

    res.send({ data: user });
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      next(new BadRequestError('Передан некорректный _id пользователя.'));
    } else {
      next(err);
    }
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hash,
    });
    res.status(HttpStatusCode.Created).send({ data: user });
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  }
};

export const login = async (req: Request, res:Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET);

    res.cookie('jwt', token, {
      maxAge: 86400, // 1 день
      httpOnly: true,
      sameSite: true,
    }).send({ data: user.deletePassword() });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
  const currentUserId = req.user?._id;
  const { body } = req;

  try {
    const updatedUser = await User.findByIdAndUpdate(currentUserId, body, {
      new: true,
      runValidators: true,
    }).orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    });

    res.send({ data: updatedUser });
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      next(new BadRequestError('Передан некорректный _id пользователя.'));
    } else if (err instanceof MongooseError.ValidationError) {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  }
};

export const updateUserAvatar = (req: IRequestWithUser, res: Response, next: NextFunction) => {
  if (!req.body.avatar) {
    next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
    return;
  }

  updateUser(req, res, next);
};

export const updateUserInfo = (req: IRequestWithUser, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  if (!name || !about) {
    next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
    return;
  }

  updateUser(req, res, next);
};
