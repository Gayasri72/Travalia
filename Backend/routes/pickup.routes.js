import express from 'express';
import {
  createPickup,
  getAllPickups,
  getPickup,
  updatePickup,
  deletePickup,
  updatePickupStatus
} from '../controllers/pickup.controller.js';

const router = express.Router();

router
  .route('/')
  .get(getAllPickups)
  .post(createPickup);

router
  .route('/:id')
  .get(getPickup)
  .patch(updatePickup)
  .delete(deletePickup);

router
  .route('/:id/status')
  .patch(updatePickupStatus);

export default router; 