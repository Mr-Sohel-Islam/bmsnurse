const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Medication name is required'],
    trim: true
  },
  dosage: {
    type: String,
    required: [true, 'Dosage is required']
  },
  route: {
    type: String,
    enum: ['oral', 'iv', 'im', 'sc', 'topical', 'inhaled', 'rectal', 'other'],
    required: true
  },
  frequency: {
    type: String,
    required: true // e.g., "every 6 hours", "twice daily"
  },
  scheduledTimes: [{
    type: String // e.g., "08:00", "14:00", "20:00"
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'discontinued', 'on-hold'],
    default: 'active'
  },
  prescribedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String
  },
  administrations: [{
    administeredAt: { type: Date, required: true },
    administeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['given', 'missed', 'refused', 'held'], required: true },
    notes: String
  }]
}, {
  timestamps: true
});

// Index for querying patient medications
medicationSchema.index({ patient: 1, status: 1 });

module.exports = mongoose.model('Medication', medicationSchema);
