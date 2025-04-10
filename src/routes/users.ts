import { Router } from 'express';
import {
  getCurrentUser,
  getUser,
  getUsers,
  updateUserAvatar,
  updateUserInfo,
} from '../controllers/users';
import { validateAvatar, validateId, validateProfileInfo } from '../middlewares/validation';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validateId, getUser);
router.patch('/me', validateProfileInfo, updateUserInfo);
router.patch('/me/avatar', validateAvatar, updateUserAvatar);

export default router;
