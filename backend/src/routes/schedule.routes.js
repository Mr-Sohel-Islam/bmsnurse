const express = require('express');
const router = express.Router();
const {
  getSchedules,
  getMySchedule,
  getWeeklySchedule,
  createSchedule,
  bulkCreateSchedule,
  updateSchedule,
  deleteSchedule
} = require('../controllers/schedule.controller');
const { protect, authorize } = require('../middleware/auth');
const { mongoIdValidator } = require('../middleware/validators');

router.use(protect);

router.get('/my', getMySchedule);
router.get('/weekly', getWeeklySchedule);

router.route('/')
  .get(getSchedules)
  .post(authorize('admin'), createSchedule);

router.post('/bulk', authorize('admin'), bulkCreateSchedule);

router.route('/:id')
  .put(mongoIdValidator, authorize('admin'), updateSchedule)
  .delete(mongoIdValidator, authorize('admin'), deleteSchedule);

module.exports = router;
