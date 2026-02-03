const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  shiftType: {
    type: String,
    enum: ['morning', 'afternoon', 'night', 'off'],
    required: true
  },
  shiftStart: {
    type: String, // e.g., "07:00"
    required: function() { return this.shiftType !== 'off'; }
  },
  shiftEnd: {
    type: String, // e.g., "15:00"
    required: function() { return this.shiftType !== 'off'; }
  },
  department: {
    type: String,
    enum: ['OPD', 'IPD', 'Emergency', 'ICU', 'General'],
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'absent', 'swapped'],
    default: 'scheduled'
  },
  notes: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Prevent duplicate shifts for same staff on same date
scheduleSchema.index({ staff: 1, date: 1 }, { unique: true });
scheduleSchema.index({ department: 1, date: 1 });

module.exports = mongoose.model('Schedule', scheduleSchema);
