const express = require('express');
const router = express.Router();
const {
  getPatientVitals,
  getLatestVital,
  createVital,
  getVitalTrends
} = require('../controllers/vital.controller');
const { protect } = require('../middleware/auth');
const { createVitalValidator, mongoIdValidator } = require('../middleware/validators');

router.use(protect);

router.post('/', createVitalValidator, createVital);
router.get('/patient/:patientId', getPatientVitals);
router.get('/patient/:patientId/latest', getLatestVital);
router.get('/patient/:patientId/trends', getVitalTrends);

module.exports = router;
