import { Router } from 'express';
import * as userController from './controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

router.get('/', authenticate, authorize('admin'), userController.getAllUsersHandler);
router.put('/:userId', authenticate, userController.updateUserHandler);
router.delete('/:userId', authenticate, authorize('admin'), userController.deleteUserHandler);

export default router;
