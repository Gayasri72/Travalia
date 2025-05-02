import express from 'express';
import {
  createDrop,
  getAllDrops,
  getDrop,
  updateDrop,
  deleteDrop,
  updateDropStatus
} from '../controllers/drop.controller.js';

const router = express.Router();

router
  .route('/')
  .get(getAllDrops)
  .post(createDrop);

router
  .route('/:id')
  .get(getDrop)
  .patch(updateDrop)
  .delete(deleteDrop);

router
  .route('/:id/status')
  .patch(updateDropStatus);

export default router; 