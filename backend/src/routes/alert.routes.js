const express = require('express');
const router = express.Router();
const {
  getAlerts,
  getMyAlerts,
  getAlertCounts,
  createAlert,
  acknowledgeAlert,
  resolveAlert,
  dismissAlert
} = require('../controllers/alert.controller');
const { protect } = require('../middleware/auth');
const { mongoIdValidator } = require('../middleware/validators');

router.use(protect);

router.get('/my', getMyAlerts);
router.get('/counts', getAlertCounts);

router.route('/')
  .get(getAlerts)
  .post(createAlert);

router.put('/:id/acknowledge', mongoIdValidator, acknowledgeAlert);
router.put('/:id/resolve', mongoIdValidator, resolveAlert);
router.put('/:id/dismiss', mongoIdValidator, dismissAlert);

module.exports = router;
