import express from 'express';
import {
  getAllTours,
  getAllToursAdmin,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} from '../controllers/tour.controller.js';
import upload from '../utills/upload.js';
const router = express.Router();

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tours-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router
  .route('/')
  .get(getAllTours)
  .post(
    upload.fields([
      { name: 'imageCover', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
    createTour,
  );
router.route('/admin').get(getAllToursAdmin);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default router;
