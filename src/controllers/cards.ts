import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { IRequestWithUser } from '../types/express';
import { HttpStatusCode, TodoMethod } from '../types/enums';
import Card from '../models/card';

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    res.send({ data: cards });
  } catch {
    res.status(HttpStatusCode.ServerError).send({ message: 'Ошибка сервера.' });
  }
};

export const createCard = async (req: IRequestWithUser, res: Response) => {
  const owner = req.user?._id;
  const { name, link } = req.body;

  try {
    const newCard = await Card.create({ name, link, owner });
    res.status(HttpStatusCode.Created).send({ data: newCard });
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      res.status(HttpStatusCode.BadRequestError).send({ message: err.message });
    } else {
      res.status(HttpStatusCode.ServerError).send({ message: 'Ошибка сервера.' });
    }
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  const { cardId } = req.params;

  try {
    const cardForDelete = await Card.findById(cardId).orFail(() => {
      const customError = new Error('Карточка с указанным _id не найдена.');
      customError.name = 'NotFoundError';
      throw customError;
    });

    await Card.deleteOne({ _id: cardForDelete.id });
    res.send({ data: cardForDelete });
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      res.status(HttpStatusCode.BadRequestError).send({ message: 'Передан некорректный _id карточки.' });
    } else if (err instanceof Error && err.name === 'NotFoundError') {
      res.status(HttpStatusCode.NotFoundError).send({ message: err.message });
    } else {
      res.status(HttpStatusCode.ServerError).send({ message: 'Ошибка сервера.' });
    }
  }
};

const toggleLike = async (
  req: IRequestWithUser,
  res: Response,
  todo: TodoMethod,
) => {
  const { cardId } = req.params;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { [todo]: { likes: req.user?._id } },
      { new: true },
    ).orFail(() => {
      const customError = new Error('Карточка с указанным _id не найдена.');
      customError.name = 'NotFoundError';
      throw customError;
    });

    res.send({ data: updatedCard });
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      res.status(HttpStatusCode.BadRequestError).send({ message: 'Передан некорректный _id карточки.' });
    } else if (err instanceof Error && err.name === 'NotFoundError') {
      res.status(HttpStatusCode.NotFoundError).send({ message: err.message });
    } else {
      res.status(HttpStatusCode.ServerError).send({ message: 'Ошибка сервера.' });
    }
  }
};

export const likeCard = (req: IRequestWithUser, res: Response) => {
  toggleLike(req, res, TodoMethod.ADD);
};
export const dislikeCard = (req: IRequestWithUser, res: Response) => {
  toggleLike(req, res, TodoMethod.REMOVE);
};
