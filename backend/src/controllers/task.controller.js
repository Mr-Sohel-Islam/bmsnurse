const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const {
      status,
      priority,
      type,
      assignedTo,
      patient,
      dueDate,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    if (status && status !== 'all') query.status = status;
    if (priority && priority !== 'all') query.priority = priority;
    if (type && type !== 'all') query.type = type;
    if (assignedTo) query.assignedTo = assignedTo;
    if (patient) query.patient = patient;

    if (dueDate) {
      const date = new Date(dueDate);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      query.dueDate = { $gte: date, $lt: nextDay };
    }

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate('patient', 'name patientId')
        .populate('assignedTo', 'name')
        .populate('assignedBy', 'name')
        .sort({ priority: -1, dueDate: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Task.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: tasks,
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

// @desc    Get my tasks
// @route   GET /api/tasks/my
// @access  Private
const getMyTasks = async (req, res) => {
  try {
    const { status = 'pending,in-progress' } = req.query;
    const statusArray = status.split(',');

    const tasks = await Task.find({
      assignedTo: req.user.id,
      status: { $in: statusArray }
    })
      .populate('patient', 'name patientId room')
      .sort({ priority: -1, dueDate: 1 });

    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('patient', 'name patientId room department')
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name')
      .populate('completedBy', 'name');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      assignedBy: req.user.id
    };

    const task = await Task.create(taskData);

    // Log activity
    await ActivityLog.create({
      action: 'task_created',
      description: `Task "${task.title}" created`,
      user: req.user.id,
      patient: task.patient,
      metadata: { taskId: task._id, assignedTo: task.assignedTo }
    });

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Complete task
// @route   PUT /api/tasks/:id/complete
// @access  Private
const completeTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        status: 'completed',
        completedAt: new Date(),
        completedBy: req.user.id,
        notes: req.body.notes
      },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Log activity
    await ActivityLog.create({
      action: 'task_completed',
      description: `Task "${task.title}" completed`,
      user: req.user.id,
      patient: task.patient
    });

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task deleted'
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
  getTasks,
  getMyTasks,
  getTask,
  createTask,
  updateTask,
  completeTask,
  deleteTask
};
