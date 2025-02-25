import { Router } from 'express';
import {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} from '../controllers/cards';
import { validateCard, validateId } from '../middlewares/validation';

const router = Router();

router.get('/', getCards);
router.post('/', validateCard, createCard);
router.delete('/:cardId', validateId, deleteCard);
router.put('/:cardId/likes', validateId, likeCard);
router.delete('/:cardId/likes', validateId, dislikeCard);

export default router;
