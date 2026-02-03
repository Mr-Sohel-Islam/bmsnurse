const Medication = require('../models/Medication');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get medications for a patient
// @route   GET /api/medications/patient/:patientId
// @access  Private
const getPatientMedications = async (req, res) => {
  try {
    const { status = 'active' } = req.query;

    const query = { patient: req.params.patientId };
    if (status !== 'all') query.status = status;

    const medications = await Medication.find(query)
      .populate('prescribedBy', 'name')
      .sort('-createdAt');

    res.json({
      success: true,
      data: medications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all due medications
// @route   GET /api/medications/due
// @access  Private
const getDueMedications = async (req, res) => {
  try {
    const { department } = req.query;
    const now = new Date();
    const currentHour = now.getHours().toString().padStart(2, '0') + ':00';

    // Find all active medications
    const medications = await Medication.find({ status: 'active' })
      .populate({
        path: 'patient',
        select: 'name patientId room department',
        match: department ? { department } : {}
      })
      .populate('prescribedBy', 'name');

    // Filter medications due now
    const dueMedications = medications.filter(med => {
      if (!med.patient) return false; // Patient didn't match department filter
      return med.scheduledTimes.some(time => {
        const scheduledHour = time.split(':')[0];
        return scheduledHour === currentHour.split(':')[0];
      });
    });

    res.json({
      success: true,
      data: dueMedications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create medication
// @route   POST /api/medications
// @access  Private
const createMedication = async (req, res) => {
  try {
    const medicationData = {
      ...req.body,
      prescribedBy: req.user.id
    };

    const medication = await Medication.create(medicationData);

    res.status(201).json({
      success: true,
      data: medication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Record medication administration
// @route   POST /api/medications/:id/administer
// @access  Private
const administerMedication = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const medication = await Medication.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    // Add administration record
    medication.administrations.push({
      administeredAt: new Date(),
      administeredBy: req.user.id,
      status,
      notes
    });

    await medication.save();

    // Log activity
    await ActivityLog.create({
      action: status === 'given' ? 'medication_administered' : 'medication_missed',
      description: `${medication.name} ${status} for patient`,
      user: req.user.id,
      patient: medication.patient,
      metadata: { medicationId: medication._id, status }
    });

    res.json({
      success: true,
      data: medication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update medication
// @route   PUT /api/medications/:id
// @access  Private
const updateMedication = async (req, res) => {
  try {
    const medication = await Medication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    res.json({
      success: true,
      data: medication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Discontinue medication
// @route   PUT /api/medications/:id/discontinue
// @access  Private
const discontinueMedication = async (req, res) => {
  try {
    const medication = await Medication.findByIdAndUpdate(
      req.params.id,
      {
        status: 'discontinued',
        endDate: new Date(),
        notes: req.body.reason
      },
      { new: true }
    );

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    res.json({
      success: true,
      data: medication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getPatientMedications,
  getDueMedications,
  createMedication,
  administerMedication,
  updateMedication,
  discontinueMedication
};
