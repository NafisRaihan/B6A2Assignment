import { Router } from 'express';
import * as authController from './controller';

const router = Router();

router.post('/signup', authController.signupHandler);
router.post('/signin', authController.signinHandler);

export default router;
