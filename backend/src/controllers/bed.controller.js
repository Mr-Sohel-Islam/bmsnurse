const Bed = require('../models/Bed');
const Patient = require('../models/Patient');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all beds
// @route   GET /api/beds
// @access  Private
const getBeds = async (req, res) => {
  try {
    const { ward, status, floor } = req.query;

    const query = {};
    if (ward && ward !== 'all') query.ward = ward;
    if (status && status !== 'all') query.status = status;
    if (floor) query.floor = parseInt(floor);

    const beds = await Bed.find(query)
      .populate('patient', 'name patientId status')
      .sort('bedNumber');

    res.json({
      success: true,
      data: beds
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get bed occupancy stats
// @route   GET /api/beds/occupancy
// @access  Private
const getBedOccupancy = async (req, res) => {
  try {
    const stats = await Bed.aggregate([
      {
        $group: {
          _id: '$ward',
          total: { $sum: 1 },
          occupied: {
            $sum: { $cond: [{ $eq: ['$status', 'occupied'] }, 1, 0] }
          },
          available: {
            $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] }
          },
          maintenance: {
            $sum: { $cond: [{ $eq: ['$status', 'maintenance'] }, 1, 0] }
          }
        }
      }
    ]);

    // Calculate overall stats
    const overall = stats.reduce(
      (acc, ward) => ({
        total: acc.total + ward.total,
        occupied: acc.occupied + ward.occupied,
        available: acc.available + ward.available,
        maintenance: acc.maintenance + ward.maintenance
      }),
      { total: 0, occupied: 0, available: 0, maintenance: 0 }
    );

    res.json({
      success: true,
      data: {
        overall,
        byWard: stats,
        occupancyRate: overall.total > 0 
          ? Math.round((overall.occupied / overall.total) * 100) 
          : 0
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

// @desc    Get single bed
// @route   GET /api/beds/:id
// @access  Private
const getBed = async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id)
      .populate('patient', 'name patientId diagnosis status attendingNurse');

    if (!bed) {
      return res.status(404).json({
        success: false,
        message: 'Bed not found'
      });
    }

    res.json({
      success: true,
      data: bed
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create bed
// @route   POST /api/beds
// @access  Private/Admin
const createBed = async (req, res) => {
  try {
    const bed = await Bed.create(req.body);

    res.status(201).json({
      success: true,
      data: bed
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Assign patient to bed
// @route   PUT /api/beds/:id/assign
// @access  Private
const assignPatient = async (req, res) => {
  try {
    const { patientId } = req.body;

    // Check if bed is available
    const bed = await Bed.findById(req.params.id);
    if (!bed) {
      return res.status(404).json({
        success: false,
        message: 'Bed not found'
      });
    }

    if (bed.status === 'occupied') {
      return res.status(400).json({
        success: false,
        message: 'Bed is already occupied'
      });
    }

    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Update bed
    bed.patient = patientId;
    bed.status = 'occupied';
    await bed.save();

    // Update patient
    patient.bed = bed._id;
    patient.isInBed = true;
    patient.room = `${bed.ward} - ${bed.room}`;
    await patient.save();

    // Log activity
    await ActivityLog.create({
      action: 'bed_assigned',
      description: `Patient ${patient.name} assigned to bed ${bed.bedNumber}`,
      user: req.user.id,
      patient: patientId,
      metadata: { bedId: bed._id, bedNumber: bed.bedNumber }
    });

    res.json({
      success: true,
      data: bed
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Release bed
// @route   PUT /api/beds/:id/release
// @access  Private
const releaseBed = async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id);
    
    if (!bed) {
      return res.status(404).json({
        success: false,
        message: 'Bed not found'
      });
    }

    const previousPatient = bed.patient;

    // Update patient if exists
    if (bed.patient) {
      await Patient.findByIdAndUpdate(bed.patient, {
        bed: null,
        isInBed: false
      });
    }

    // Update bed
    bed.patient = null;
    bed.status = 'available';
    bed.lastSanitized = new Date();
    await bed.save();

    // Log activity
    if (previousPatient) {
      await ActivityLog.create({
        action: 'bed_released',
        description: `Bed ${bed.bedNumber} released`,
        user: req.user.id,
        patient: previousPatient,
        metadata: { bedId: bed._id }
      });
    }

    res.json({
      success: true,
      data: bed
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update bed
// @route   PUT /api/beds/:id
// @access  Private/Admin
const updateBed = async (req, res) => {
  try {
    const bed = await Bed.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!bed) {
      return res.status(404).json({
        success: false,
        message: 'Bed not found'
      });
    }

    res.json({
      success: true,
      data: bed
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
  getBeds,
  getBedOccupancy,
  getBed,
  createBed,
  assignPatient,
  releaseBed,
  updateBed
};
