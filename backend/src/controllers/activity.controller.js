const ActivityLog = require('../models/ActivityLog');

// @desc    Get activity logs
// @route   GET /api/activities
// @access  Private
const getActivities = async (req, res) => {
  try {
    const {
      action,
      user,
      patient,
      startDate,
      endDate,
      page = 1,
      limit = 50
    } = req.query;

    const query = {};

    if (action) query.action = action;
    if (user) query.user = user;
    if (patient) query.patient = patient;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      ActivityLog.find(query)
        .populate('user', 'name role')
        .populate('patient', 'name patientId')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      ActivityLog.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: activities,
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

// @desc    Get recent activities (for dashboard)
// @route   GET /api/activities/recent
// @access  Private
const getRecentActivities = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const activities = await ActivityLog.find()
      .populate('user', 'name role avatar')
      .populate('patient', 'name patientId')
      .sort('-createdAt')
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get my activities
// @route   GET /api/activities/my
// @access  Private
const getMyActivities = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const activities = await ActivityLog.find({ user: req.user.id })
      .populate('patient', 'name patientId')
      .sort('-createdAt')
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get patient activities
// @route   GET /api/activities/patient/:patientId
// @access  Private
const getPatientActivities = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const activities = await ActivityLog.find({ patient: req.params.patientId })
      .populate('user', 'name role')
      .sort('-createdAt')
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: activities
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
  getActivities,
  getRecentActivities,
  getMyActivities,
  getPatientActivities
};
