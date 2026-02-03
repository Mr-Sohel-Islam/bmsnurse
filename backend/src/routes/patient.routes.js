const express = require('express');
const router = express.Router();
const {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  dischargePatient,
  getPatientStats
} = require('../controllers/patient.controller');
const { protect } = require('../middleware/auth');
const { createPatientValidator, mongoIdValidator } = require('../middleware/validators');

router.use(protect);

router.get('/stats', getPatientStats);
router.route('/')
  .get(getPatients)
  .post(createPatientValidator, createPatient);

router.route('/:id')
  .get(mongoIdValidator, getPatient)
  .put(mongoIdValidator, updatePatient);

router.put('/:id/discharge', mongoIdValidator, dischargePatient);

module.exports = router;
