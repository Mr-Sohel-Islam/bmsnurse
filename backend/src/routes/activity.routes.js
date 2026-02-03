const express = require('express');
const router = express.Router();
const {
  getActivities,
  getRecentActivities,
  getMyActivities,
  getPatientActivities
} = require('../controllers/activity.controller');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getActivities);
router.get('/recent', getRecentActivities);
router.get('/my', getMyActivities);
router.get('/patient/:patientId', getPatientActivities);

module.exports = router;
