const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'login',
      'logout',
      'patient_admitted',
      'patient_discharged',
      'patient_updated',
      'vital_recorded',
      'medication_administered',
      'medication_missed',
      'task_created',
      'task_completed',
      'task_assigned',
      'alert_created',
      'alert_acknowledged',
      'schedule_created',
      'schedule_updated',
      'bed_assigned',
      'bed_released',
      'other'
    ]
  },
  description: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed // Store any additional data
  },
  ipAddress: {
    type: String
  }
}, {
  timestamps: true
});

// Index for querying activity logs
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ patient: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
