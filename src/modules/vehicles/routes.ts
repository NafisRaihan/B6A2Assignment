import { Router } from 'express';
import * as vehicleController from './controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

router.post('/', authenticate, authorize('admin'), vehicleController.createVehicleHandler);
router.get('/', vehicleController.getAllVehiclesHandler);
router.get('/:vehicleId', vehicleController.getVehicleByIdHandler);
router.put('/:vehicleId', authenticate, authorize('admin'), vehicleController.updateVehicleHandler);
router.delete('/:vehicleId', authenticate, authorize('admin'), vehicleController.deleteVehicleHandler);

export default router;
