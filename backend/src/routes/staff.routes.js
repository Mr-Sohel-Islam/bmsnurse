const express = require('express');
const router = express.Router();
const {
  getStaff,
  getStaffMember,
  getNurses,
  getDoctors,
  updateStaff,
  deactivateStaff,
  getStaffStats
} = require('../controllers/staff.controller');
const { protect, authorize } = require('../middleware/auth');
const { mongoIdValidator } = require('../middleware/validators');

router.use(protect);

router.get('/nurses', getNurses);
router.get('/doctors', getDoctors);
router.get('/stats', getStaffStats);

router.route('/')
  .get(getStaff);

router.route('/:id')
  .get(mongoIdValidator, getStaffMember)
  .put(mongoIdValidator, authorize('admin'), updateStaff);

router.put('/:id/deactivate', mongoIdValidator, authorize('admin'), deactivateStaff);

module.exports = router;
