import express from 'express';
import { createDrop, getAllDrops, deleteDrop, getUserDropDetails } from '../controllers/drop.controller.js';

const router = express.Router();


router.get('/drop-bookings', getAllDrops);

// Route to get drop details for a specific user
router.get('/user/:email', getUserDropDetails);

router.post('/', createDrop);
router.delete('/drop-bookings/:id', deleteDrop);
export default router;