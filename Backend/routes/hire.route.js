import express from 'express';
import { getBookingHires } from '../controllers/hire.controller.js';

const router = express.Router();

router.get('/booking-hires', getBookingHires);

export default router;