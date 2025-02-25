import { Router } from 'express';
import {
  getCurrentUser,
  getUser,
  getUsers,
  updateUserAvatar,
  updateUserInfo,
} from '../controllers/users';
import { validateId } from '../middlewares/validation';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validateId, getUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

export default router;
