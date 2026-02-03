const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  bedNumber: {
    type: String,
    required: true,
    unique: true
  },
  ward: {
    type: String,
    enum: ['General', 'ICU', 'Emergency', 'Pediatric', 'Maternity', 'Surgery'],
    required: true
  },
  floor: {
    type: Number,
    required: true
  },
  room: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'maintenance'],
    default: 'available'
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    default: null
  },
  features: [{
    type: String // e.g., 'ventilator', 'monitor', 'oxygen'
  }],
  lastSanitized: {
    type: Date
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for querying available beds
bedSchema.index({ ward: 1, status: 1 });

module.exports = mongoose.model('Bed', bedSchema);
