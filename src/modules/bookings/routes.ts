import { Router } from 'express';
import * as bookingController from './controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/', authenticate, bookingController.createBookingHandler);
router.get('/', authenticate, bookingController.getAllBookingsHandler);
router.put('/:bookingId', authenticate, bookingController.updateBookingHandler);

export default router;
