const Alert = require('../models/Alert');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all alerts
// @route   GET /api/alerts
// @access  Private
const getAlerts = async (req, res) => {
  try {
    const { status = 'active', priority, type, department, limit = 50 } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status === 'active' ? { $in: ['active', 'acknowledged'] } : status;
    }

    if (priority && priority !== 'all') query.priority = priority;
    if (type && type !== 'all') query.type = type;
    if (department && department !== 'all') {
      query.$or = [
        { targetDepartment: department },
        { targetDepartment: 'All' }
      ];
    }

    const alerts = await Alert.find(query)
      .populate('patient', 'name patientId room')
      .populate('targetUser', 'name')
      .populate('acknowledgedBy', 'name')
      .sort({ priority: -1, createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get my alerts
// @route   GET /api/alerts/my
// @access  Private
const getMyAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({
      $or: [
        { targetUser: req.user.id },
        { targetDepartment: req.user.department },
        { targetDepartment: 'All' }
      ],
      status: { $in: ['active', 'acknowledged'] }
    })
      .populate('patient', 'name patientId room')
      .sort({ priority: -1, createdAt: -1 });

    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get alert counts by priority
// @route   GET /api/alerts/counts
// @access  Private
const getAlertCounts = async (req, res) => {
  try {
    const counts = await Alert.aggregate([
      { $match: { status: { $in: ['active', 'acknowledged'] } } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const result = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      total: 0
    };

    counts.forEach(c => {
      result[c._id] = c.count;
      result.total += c.count;
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create alert
// @route   POST /api/alerts
// @access  Private
const createAlert = async (req, res) => {
  try {
    const alertData = {
      ...req.body,
      createdBy: req.user.id
    };

    const alert = await Alert.create(alertData);

    // Log activity
    await ActivityLog.create({
      action: 'alert_created',
      description: `Alert created: ${alert.title}`,
      user: req.user.id,
      patient: alert.patient
    });

    res.status(201).json({
      success: true,
      data: alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Acknowledge alert
// @route   PUT /api/alerts/:id/acknowledge
// @access  Private
const acknowledgeAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      {
        status: 'acknowledged',
        acknowledgedBy: req.user.id,
        acknowledgedAt: new Date()
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    // Log activity
    await ActivityLog.create({
      action: 'alert_acknowledged',
      description: `Alert acknowledged: ${alert.title}`,
      user: req.user.id,
      patient: alert.patient
    });

    res.json({
      success: true,
      data: alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Resolve alert
// @route   PUT /api/alerts/:id/resolve
// @access  Private
const resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      {
        status: 'resolved',
        resolvedBy: req.user.id,
        resolvedAt: new Date()
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.json({
      success: true,
      data: alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Dismiss alert
// @route   PUT /api/alerts/:id/dismiss
// @access  Private
const dismissAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status: 'dismissed' },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.json({
      success: true,
      data: alert
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
  getAlerts,
  getMyAlerts,
  getAlertCounts,
  createAlert,
  acknowledgeAlert,
  resolveAlert,
  dismissAlert
};
