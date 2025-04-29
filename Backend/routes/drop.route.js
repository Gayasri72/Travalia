import express from 'express';
import { createDrop, getAllDrops, deleteDrop,getBookingHires } from '../controllers/drop.controller.js';

const router = express.Router();


router.get('/drop-bookings', getAllDrops);
router.get('/drop-booking', getBookingHires);
router.post('/', createDrop);
router.delete('/drop-bookings/:id', deleteDrop);
export default router;