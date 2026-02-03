const Patient = require('../models/Patient');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private
const getPatients = async (req, res) => {
  try {
    const {
      department,
      status,
      nurse,
      search,
      page = 1,
      limit = 20,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = {};

    if (department && department !== 'all') {
      query.department = department;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (nurse && nurse !== 'all') {
      query.attendingNurse = nurse;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { patientId: { $regex: search, $options: 'i' } },
        { diagnosis: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    const [patients, total] = await Promise.all([
      Patient.find(query)
        .populate('attendingNurse', 'name')
        .populate('attendingDoctor', 'name')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Patient.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: patients,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('attendingNurse', 'name email phone')
      .populate('attendingDoctor', 'name email phone')
      .populate('bed');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create patient
// @route   POST /api/patients
// @access  Private
const createPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);

    // Log activity
    await ActivityLog.create({
      action: 'patient_admitted',
      description: `New patient ${patient.name} admitted to ${patient.department}`,
      user: req.user.id,
      patient: patient._id
    });

    res.status(201).json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Log activity
    await ActivityLog.create({
      action: 'patient_updated',
      description: `Patient ${patient.name} record updated`,
      user: req.user.id,
      patient: patient._id,
      metadata: { updatedFields: Object.keys(req.body) }
    });

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Discharge patient
// @route   PUT /api/patients/:id/discharge
// @access  Private
const dischargePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        dischargeDate: new Date(),
        status: 'normal',
        isInBed: false,
        bed: null
      },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Log activity
    await ActivityLog.create({
      action: 'patient_discharged',
      description: `Patient ${patient.name} discharged`,
      user: req.user.id,
      patient: patient._id
    });

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get patient statistics
// @route   GET /api/patients/stats
// @access  Private
const getPatientStats = async (req, res) => {
  try {
    const [
      totalPatients,
      criticalPatients,
      departmentStats,
      inBedCount
    ] = await Promise.all([
      Patient.countDocuments({ dischargeDate: null }),
      Patient.countDocuments({ status: 'critical', dischargeDate: null }),
      Patient.aggregate([
        { $match: { dischargeDate: null } },
        { $group: { _id: '$department', count: { $sum: 1 } } }
      ]),
      Patient.countDocuments({ isInBed: true })
    ]);

    const stats = {
      total: totalPatients,
      critical: criticalPatients,
      inBed: inBedCount,
      byDepartment: departmentStats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {})
    };

    res.json({
      success: true,
      data: stats
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
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  dischargePatient,
  getPatientStats
};
