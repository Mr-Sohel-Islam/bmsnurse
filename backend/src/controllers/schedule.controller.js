const Schedule = require('../models/Schedule');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get schedules
// @route   GET /api/schedule
// @access  Private
const getSchedules = async (req, res) => {
  try {
    const { department, startDate, endDate, staff } = req.query;

    const query = {};

    if (department && department !== 'all') {
      query.department = department;
    }

    if (staff) {
      query.staff = staff;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const schedules = await Schedule.find(query)
      .populate('staff', 'name role department')
      .sort('date');

    res.json({
      success: true,
      data: schedules
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get my schedule
// @route   GET /api/schedule/my
// @access  Private
const getMySchedule = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = { staff: req.user.id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const schedules = await Schedule.find(query).sort('date');

    res.json({
      success: true,
      data: schedules
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get weekly schedule view
// @route   GET /api/schedule/weekly
// @access  Private
const getWeeklySchedule = async (req, res) => {
  try {
    const { weekStart, department } = req.query;

    const startDate = new Date(weekStart);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    const query = {
      date: { $gte: startDate, $lt: endDate }
    };

    if (department && department !== 'all') {
      query.department = department;
    }

    const schedules = await Schedule.find(query)
      .populate('staff', 'name role')
      .sort('date');

    // Group by staff member
    const staffSchedules = {};
    schedules.forEach(schedule => {
      const staffId = schedule.staff._id.toString();
      if (!staffSchedules[staffId]) {
        staffSchedules[staffId] = {
          staff: schedule.staff,
          shifts: []
        };
      }
      staffSchedules[staffId].shifts.push({
        date: schedule.date,
        shiftType: schedule.shiftType,
        shiftStart: schedule.shiftStart,
        shiftEnd: schedule.shiftEnd,
        status: schedule.status
      });
    });

    res.json({
      success: true,
      data: Object.values(staffSchedules)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create schedule
// @route   POST /api/schedule
// @access  Private/Admin
const createSchedule = async (req, res) => {
  try {
    const scheduleData = {
      ...req.body,
      createdBy: req.user.id
    };

    const schedule = await Schedule.create(scheduleData);

    // Log activity
    await ActivityLog.create({
      action: 'schedule_created',
      description: `Schedule created for staff`,
      user: req.user.id,
      metadata: { scheduleId: schedule._id }
    });

    res.status(201).json({
      success: true,
      data: schedule
    });
  } catch (error) {
    // Handle duplicate key error (same staff, same date)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Schedule already exists for this staff member on this date'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Bulk create schedules
// @route   POST /api/schedule/bulk
// @access  Private/Admin
const bulkCreateSchedule = async (req, res) => {
  try {
    const { schedules } = req.body;

    const schedulesWithCreator = schedules.map(s => ({
      ...s,
      createdBy: req.user.id
    }));

    const created = await Schedule.insertMany(schedulesWithCreator, { ordered: false })
      .catch(err => {
        // Return successfully inserted documents even if some fail
        if (err.insertedDocs) return err.insertedDocs;
        throw err;
      });

    res.status(201).json({
      success: true,
      data: created,
      count: created.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update schedule
// @route   PUT /api/schedule/:id
// @access  Private/Admin
const updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    // Log activity
    await ActivityLog.create({
      action: 'schedule_updated',
      description: `Schedule updated`,
      user: req.user.id,
      metadata: { scheduleId: schedule._id }
    });

    res.json({
      success: true,
      data: schedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete schedule
// @route   DELETE /api/schedule/:id
// @access  Private/Admin
const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    res.json({
      success: true,
      message: 'Schedule deleted'
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
  getSchedules,
  getMySchedule,
  getWeeklySchedule,
  createSchedule,
  bulkCreateSchedule,
  updateSchedule,
  deleteSchedule
};
