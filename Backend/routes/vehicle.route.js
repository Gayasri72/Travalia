import express from 'express';
import {
  createVehicle,
  getAllVehicles,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicle.controller.js';

const router = express.Router();

router.route('/').get(getAllVehicles).post(createVehicle);
router.route('/:id').patch(updateVehicle).delete(deleteVehicle);

export default router;