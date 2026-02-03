const Vital = require('../models/Vital');
const Patient = require('../models/Patient');
const Alert = require('../models/Alert');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get vitals for a patient
// @route   GET /api/vitals/patient/:patientId
// @access  Private
const getPatientVitals = async (req, res) => {
  try {
    const { limit = 50, startDate, endDate } = req.query;

    const query = { patient: req.params.patientId };

    if (startDate || endDate) {
      query.recordedAt = {};
      if (startDate) query.recordedAt.$gte = new Date(startDate);
      if (endDate) query.recordedAt.$lte = new Date(endDate);
    }

    const vitals = await Vital.find(query)
      .populate('recordedBy', 'name')
      .sort('-recordedAt')
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: vitals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get latest vital for a patient
// @route   GET /api/vitals/patient/:patientId/latest
// @access  Private
const getLatestVital = async (req, res) => {
  try {
    const vital = await Vital.findOne({ patient: req.params.patientId })
      .populate('recordedBy', 'name')
      .sort('-recordedAt');

    if (!vital) {
      return res.status(404).json({
        success: false,
        message: 'No vitals found for this patient'
      });
    }

    res.json({
      success: true,
      data: vital
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Record new vital signs
// @route   POST /api/vitals
// @access  Private
const createVital = async (req, res) => {
  try {
    const vitalData = {
      ...req.body,
      recordedBy: req.user.id
    };

    const vital = await Vital.create(vitalData);

    // Check for critical values and create alerts
    const criticalAlerts = [];
    
    if (vital.heartRate.isAbnormal) {
      criticalAlerts.push({
        type: 'vital',
        title: 'Abnormal Heart Rate',
        message: `Heart rate: ${vital.heartRate.value} bpm`,
        patient: vital.patient,
        priority: vital.heartRate.value < 50 || vital.heartRate.value > 120 ? 'critical' : 'high'
      });
    }

    if (vital.bloodPressure.isAbnormal) {
      criticalAlerts.push({
        type: 'vital',
        title: 'Abnormal Blood Pressure',
        message: `BP: ${vital.bloodPressure.systolic}/${vital.bloodPressure.diastolic} mmHg`,
        patient: vital.patient,
        priority: vital.bloodPressure.systolic > 180 || vital.bloodPressure.systolic < 80 ? 'critical' : 'high'
      });
    }

    if (vital.oxygenSaturation.isAbnormal) {
      criticalAlerts.push({
        type: 'vital',
        title: 'Low Oxygen Saturation',
        message: `SpO2: ${vital.oxygenSaturation.value}%`,
        patient: vital.patient,
        priority: vital.oxygenSaturation.value < 90 ? 'critical' : 'high'
      });
    }

    if (vital.temperature.isAbnormal) {
      criticalAlerts.push({
        type: 'vital',
        title: 'Abnormal Temperature',
        message: `Temperature: ${vital.temperature.value}°F`,
        patient: vital.patient,
        priority: vital.temperature.value > 103 || vital.temperature.value < 95 ? 'critical' : 'medium'
      });
    }

    // Create alerts for critical values
    if (criticalAlerts.length > 0) {
      await Alert.insertMany(criticalAlerts.map(alert => ({
        ...alert,
        createdBy: req.user.id
      })));

      // Update patient status if critical
      const hasCritical = criticalAlerts.some(a => a.priority === 'critical');
      if (hasCritical) {
        await Patient.findByIdAndUpdate(vital.patient, { status: 'critical' });
      }
    }

    // Log activity
    await ActivityLog.create({
      action: 'vital_recorded',
      description: `Vital signs recorded for patient`,
      user: req.user.id,
      patient: vital.patient,
      metadata: {
        heartRate: vital.heartRate.value,
        bloodPressure: `${vital.bloodPressure.systolic}/${vital.bloodPressure.diastolic}`,
        temperature: vital.temperature.value,
        oxygenSaturation: vital.oxygenSaturation.value
      }
    });

    res.status(201).json({
      success: true,
      data: vital,
      alerts: criticalAlerts.length > 0 ? criticalAlerts : undefined
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get vital trends for a patient
// @route   GET /api/vitals/patient/:patientId/trends
// @access  Private
const getVitalTrends = async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    const vitals = await Vital.find({
      patient: req.params.patientId,
      recordedAt: { $gte: startTime }
    }).sort('recordedAt');

    // Format for charting
    const trends = vitals.map(v => ({
      time: v.recordedAt,
      heartRate: v.heartRate.value,
      systolic: v.bloodPressure.systolic,
      diastolic: v.bloodPressure.diastolic,
      temperature: v.temperature.value,
      oxygenSaturation: v.oxygenSaturation.value,
      respiratoryRate: v.respiratoryRate?.value
    }));

    res.json({
      success: true,
      data: trends
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
  getPatientVitals,
  getLatestVital,
  createVital,
  getVitalTrends
};
