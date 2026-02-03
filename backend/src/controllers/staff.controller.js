const User = require('../models/User');

// @desc    Get all staff
// @route   GET /api/staff
// @access  Private
const getStaff = async (req, res) => {
  try {
    const { role, department, isActive, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (role && role !== 'all') query.role = role;
    if (department && department !== 'all') query.department = department;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [staff, total] = await Promise.all([
      User.find(query)
        .select('-refreshToken')
        .sort('name')
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: staff,
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

// @desc    Get single staff member
// @route   GET /api/staff/:id
// @access  Private
const getStaffMember = async (req, res) => {
  try {
    const staff = await User.findById(req.params.id).select('-refreshToken');

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    res.json({
      success: true,
      data: staff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get nurses (for assignment dropdowns)
// @route   GET /api/staff/nurses
// @access  Private
const getNurses = async (req, res) => {
  try {
    const { department } = req.query;

    const query = { role: 'nurse', isActive: true };
    if (department && department !== 'all') query.department = department;

    const nurses = await User.find(query)
      .select('name department')
      .sort('name');

    res.json({
      success: true,
      data: nurses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get doctors (for assignment dropdowns)
// @route   GET /api/staff/doctors
// @access  Private
const getDoctors = async (req, res) => {
  try {
    const { department } = req.query;

    const query = { role: 'doctor', isActive: true };
    if (department && department !== 'all') query.department = department;

    const doctors = await User.find(query)
      .select('name department')
      .sort('name');

    res.json({
      success: true,
      data: doctors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update staff member
// @route   PUT /api/staff/:id
// @access  Private/Admin
const updateStaff = async (req, res) => {
  try {
    // Prevent password update through this route
    delete req.body.password;

    const staff = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-refreshToken');

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    res.json({
      success: true,
      data: staff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Deactivate staff member
// @route   PUT /api/staff/:id/deactivate
// @access  Private/Admin
const deactivateStaff = async (req, res) => {
  try {
    const staff = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-refreshToken');

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    res.json({
      success: true,
      data: staff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get staff statistics
// @route   GET /api/staff/stats
// @access  Private
const getStaffStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const departmentStats = await User.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        byRole: stats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        byDepartment: departmentStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        total: stats.reduce((sum, s) => sum + s.count, 0)
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

module.exports = {
  getStaff,
  getStaffMember,
  getNurses,
  getDoctors,
  updateStaff,
  deactivateStaff,
  getStaffStats
};
