const express = require('express');
const courseRouter = require('./courses');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

const {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampUploadPhoto,
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');
const advansedResults = require('../middleware/advansedResults');

router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
  .route('/')
  .get(advansedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampUploadPhoto);
module.exports = router;
