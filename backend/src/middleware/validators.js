const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Auth validators
const loginValidator = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const registerValidator = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().withMessage('Name is required'),
  body('role')
    .optional()
    .isIn(['admin', 'doctor', 'nurse', 'staff'])
    .withMessage('Invalid role'),
  validate
];

// Patient validators
const createPatientValidator = [
  body('name').notEmpty().withMessage('Patient name is required'),
  body('age').isInt({ min: 0, max: 150 }).withMessage('Valid age is required'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Valid gender is required'),
  body('department').isIn(['OPD', 'IPD', 'Emergency', 'ICU']).withMessage('Valid department is required'),
  body('diagnosis').notEmpty().withMessage('Diagnosis is required'),
  validate
];

// Vital validators
const createVitalValidator = [
  body('patient').isMongoId().withMessage('Valid patient ID is required'),
  body('heartRate.value').isInt({ min: 20, max: 300 }).withMessage('Valid heart rate is required'),
  body('bloodPressure.systolic').isInt({ min: 50, max: 250 }).withMessage('Valid systolic BP is required'),
  body('bloodPressure.diastolic').isInt({ min: 30, max: 150 }).withMessage('Valid diastolic BP is required'),
  body('temperature.value').isFloat({ min: 90, max: 110 }).withMessage('Valid temperature is required'),
  body('oxygenSaturation.value').isInt({ min: 50, max: 100 }).withMessage('Valid oxygen saturation is required'),
  validate
];

// Task validators
const createTaskValidator = [
  body('title').notEmpty().withMessage('Task title is required'),
  body('type')
    .isIn(['medication', 'vital-check', 'lab-work', 'documentation', 'patient-care', 'other'])
    .withMessage('Valid task type is required'),
  body('assignedTo').isMongoId().withMessage('Valid assignee ID is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  validate
];

// MongoDB ID validator
const mongoIdValidator = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  validate
];

module.exports = {
  validate,
  loginValidator,
  registerValidator,
  createPatientValidator,
  createVitalValidator,
  createTaskValidator,
  mongoIdValidator
};
