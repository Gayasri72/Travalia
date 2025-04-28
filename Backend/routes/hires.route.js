import express from 'express';
import {
  createHire,
  getAllHires,
  getHireById,
  updateHire,
  deleteHire,
} from '../controllers/hires.controller.js';

const router = express.Router();

router.route('/').get(getAllHires).post(createHire);
router.route('/:id').get(getHireById).patch(updateHire).delete(deleteHire);

export default router;
