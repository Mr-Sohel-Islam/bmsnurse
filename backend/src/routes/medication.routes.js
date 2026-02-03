const express = require('express');
const router = express.Router();
const {
  getPatientMedications,
  getDueMedications,
  createMedication,
  administerMedication,
  updateMedication,
  discontinueMedication
} = require('../controllers/medication.controller');
const { protect, authorize } = require('../middleware/auth');
const { mongoIdValidator } = require('../middleware/validators');

router.use(protect);

router.get('/due', getDueMedications);
router.get('/patient/:patientId', getPatientMedications);

router.post('/', authorize('doctor', 'admin'), createMedication);
router.post('/:id/administer', mongoIdValidator, administerMedication);
router.put('/:id', mongoIdValidator, updateMedication);
router.put('/:id/discontinue', mongoIdValidator, authorize('doctor', 'admin'), discontinueMedication);

module.exports = router;
