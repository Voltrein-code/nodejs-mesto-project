import { Router } from 'express';
import {
  createUser, getUserById, getUsers, updateUserAvatar, updateUserInfo,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

export default router;
