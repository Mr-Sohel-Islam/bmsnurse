const express = require('express');
const router = express.Router();
const {
  getBeds,
  getBedOccupancy,
  getBed,
  createBed,
  assignPatient,
  releaseBed,
  updateBed
} = require('../controllers/bed.controller');
const { protect, authorize } = require('../middleware/auth');
const { mongoIdValidator } = require('../middleware/validators');

router.use(protect);

router.get('/occupancy', getBedOccupancy);

router.route('/')
  .get(getBeds)
  .post(authorize('admin'), createBed);

router.route('/:id')
  .get(mongoIdValidator, getBed)
  .put(mongoIdValidator, authorize('admin'), updateBed);

router.put('/:id/assign', mongoIdValidator, assignPatient);
router.put('/:id/release', mongoIdValidator, releaseBed);

module.exports = router;
