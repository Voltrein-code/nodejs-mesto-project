import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { IRequestWithUser } from '../types/express';
import { HttpStatusCode, TodoMethod } from '../types/enums';
import Card from '../models/card';
import BadRequestError from '../errors/badRequestError';
import NotFoundError from '../errors/notFoundError';
import ForbiddenError from '../errors/forbiddenError';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    res.send({ data: cards });
  } catch (err) {
    next(err);
  }
};

export const createCard = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
  const owner = req.user?._id;
  const { name, link } = req.body;

  try {
    const newCard = await Card.create({ name, link, owner });
    res.status(HttpStatusCode.Created).send({ data: newCard });
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  }
};

export const deleteCard = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  try {
    const cardForDelete = await Card.findById(cardId).orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    });

    if (cardForDelete.owner.toString() !== req.user?._id) {
      throw new ForbiddenError('Карточка не пренадлежит текущему пользователю, удаление не доступно');
    }

    await Card.deleteOne({ _id: cardForDelete.id });
    res.send({ data: cardForDelete });
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      next(new BadRequestError('Передан некорректный _id карточки.'));
    } else {
      next(err);
    }
  }
};

const toggleLike = async (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction,
  todo: TodoMethod,
) => {
  const { cardId } = req.params;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { [todo]: { likes: req.user?._id } },
      { new: true },
    ).orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    });

    res.send({ data: updatedCard });
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      next(new BadRequestError('Передан некорректный _id карточки.'));
    } else {
      next(err);
    }
  }
};

export const likeCard = (req: IRequestWithUser, res: Response, next: NextFunction) => {
  toggleLike(req, res, next, TodoMethod.ADD);
};
export const dislikeCard = (req: IRequestWithUser, res: Response, next: NextFunction) => {
  toggleLike(req, res, next, TodoMethod.REMOVE);
};
