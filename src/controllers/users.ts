import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { IRequestWithUser } from '../types/express';
import User from '../models/user';
import { HttpStatusCode } from '../types/enums';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.send({ data: users });
  } catch {
    res.status(HttpStatusCode.ServerError).send({ message: 'Ошибка сервера.' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).orFail(() => {
      const customError = new Error(
        'Пользователь по указанному _id не найден.',
      );
      customError.name = 'NotFoundError';
      throw customError;
    });

    res.send({ data: user });
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      res
        .status(HttpStatusCode.BadRequestError)
        .send({ message: 'Передан некорректный _id пользователя.' });
    } else if (err instanceof Error && err.name === 'NotFoundError') {
      res.status(HttpStatusCode.NotFoundError).send({ message: err.message });
    } else {
      res.status(HttpStatusCode.NotFoundError).send({ message: 'Ошибка сервера.' });
    }
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  try {
    const user = await User.create({ name, about, avatar });
    res.status(HttpStatusCode.Created).send({ data: user });
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      res.status(HttpStatusCode.BadRequestError).send({ message: err.message });
    } else {
      res.status(HttpStatusCode.ServerError).send({ message: 'Ошибка сервера.' });
    }
  }
};

const updateUser = async (req: IRequestWithUser, res: Response) => {
  const currentUserId = req.user?._id;
  const { body } = req;

  try {
    const updatedUser = await User.findByIdAndUpdate(currentUserId, body, {
      new: true,
      runValidators: true,
    }).orFail(() => {
      const customError = new Error(
        'Пользователь по указанному _id не найден.',
      );
      customError.name = 'NotFoundError';
      throw customError;
    });

    res.send({ data: updatedUser });
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      res
        .status(HttpStatusCode.BadRequestError)
        .send({ message: 'Передан некорректный _id пользователя.' });
    } else if (err instanceof MongooseError.ValidationError) {
      res.status(HttpStatusCode.BadRequestError).send({ message: err.message });
    } else if (err instanceof Error && err.name === 'NotFoundError') {
      res.status(HttpStatusCode.NotFoundError).send({ message: err.message });
    } else {
      res.status(HttpStatusCode.ServerError).send({ message: 'Ошибка сервера.' });
    }
  }
};

export const updateUserAvatar = (req: IRequestWithUser, res: Response) => {
  if (!req.body.avatar) {
    res.status(HttpStatusCode.BadRequestError).send({
      message: 'Переданы некорректные данные при обновлении аватара.',
    });
    return;
  }

  updateUser(req, res);
};

export const updateUserInfo = (req: IRequestWithUser, res: Response) => {
  const { name, about } = req.body;

  if (!name || !about) {
    res.status(HttpStatusCode.BadRequestError).send({
      message: 'Переданы некорректные данные при обновлении профиля.',
    });
    return;
  }

  updateUser(req, res);
};
