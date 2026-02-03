const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: 0,
    max: 150
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  department: {
    type: String,
    enum: ['OPD', 'IPD', 'Emergency', 'ICU'],
    required: true
  },
  status: {
    type: String,
    enum: ['critical', 'warning', 'stable', 'normal'],
    default: 'stable'
  },
  diagnosis: {
    type: String,
    required: true
  },
  admissionDate: {
    type: Date,
    default: Date.now
  },
  dischargeDate: {
    type: Date,
    default: null
  },
  attendingDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attendingNurse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attendingNurseName: {
    type: String // Denormalized for quick display
  },
  room: {
    type: String
  },
  bed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bed'
  },
  isInBed: {
    type: Boolean,
    default: false
  },
  triageLevel: {
    type: Number,
    min: 1,
    max: 5,
    default: null // 1 = most urgent, 5 = least urgent
  },
  arrivalTime: {
    type: Date
  },
  contactInfo: {
    phone: String,
    email: String,
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    }
  },
  insurance: {
    provider: String,
    policyNumber: String
  },
  allergies: [{
    type: String
  }],
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Generate unique patient ID before saving
patientSchema.pre('save', async function(next) {
  if (!this.patientId) {
    const count = await this.constructor.countDocuments();
    this.patientId = `P${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

// Index for common queries
patientSchema.index({ department: 1, status: 1 });
patientSchema.index({ attendingNurse: 1 });
patientSchema.index({ patientId: 1 });

module.exports = mongoose.model('Patient', patientSchema);
