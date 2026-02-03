const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../models/User');
const Patient = require('../models/Patient');
const Bed = require('../models/Bed');
const Vital = require('../models/Vital');
const Task = require('../models/Task');
const Alert = require('../models/Alert');
const Medication = require('../models/Medication');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Patient.deleteMany({}),
      Bed.deleteMany({}),
      Vital.deleteMany({}),
      Task.deleteMany({}),
      Alert.deleteMany({}),
      Medication.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Create users
    const users = await User.create([
      {
        email: 'admin@hospital.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
        department: 'Admin',
        phone: '555-0100'
      },
      {
        email: 'doctor@hospital.com',
        password: 'doctor123',
        name: 'Dr. John Smith',
        role: 'doctor',
        department: 'General',
        phone: '555-0101'
      },
      {
        email: 'sarah@hospital.com',
        password: 'nurse123',
        name: 'Sarah Johnson',
        role: 'nurse',
        department: 'ICU',
        phone: '555-0102'
      },
      {
        email: 'mike@hospital.com',
        password: 'nurse123',
        name: 'Mike Chen',
        role: 'nurse',
        department: 'Emergency',
        phone: '555-0103'
      },
      {
        email: 'emily@hospital.com',
        password: 'nurse123',
        name: 'Emily Davis',
        role: 'nurse',
        department: 'OPD',
        phone: '555-0104'
      },
      {
        email: 'dr.wilson@hospital.com',
        password: 'doctor123',
        name: 'Dr. Lisa Wilson',
        role: 'doctor',
        department: 'Emergency',
        phone: '555-0105'
      }
    ]);
    console.log(`Created ${users.length} users`);

    const [admin, doctor, sarah, mike, emily, drWilson] = users;

    // Create beds
    const beds = await Bed.create([
      { bedNumber: 'ICU-001', ward: 'ICU', floor: 2, room: '201', status: 'available' },
      { bedNumber: 'ICU-002', ward: 'ICU', floor: 2, room: '201', status: 'available' },
      { bedNumber: 'ICU-003', ward: 'ICU', floor: 2, room: '202', status: 'maintenance' },
      { bedNumber: 'GEN-001', ward: 'General', floor: 3, room: '301', status: 'available' },
      { bedNumber: 'GEN-002', ward: 'General', floor: 3, room: '301', status: 'available' },
      { bedNumber: 'GEN-003', ward: 'General', floor: 3, room: '302', status: 'available' },
      { bedNumber: 'ER-001', ward: 'Emergency', floor: 1, room: '101', status: 'available' },
      { bedNumber: 'ER-002', ward: 'Emergency', floor: 1, room: '101', status: 'available' },
      { bedNumber: 'ER-003', ward: 'Emergency', floor: 1, room: '102', status: 'available' },
      { bedNumber: 'PED-001', ward: 'Pediatric', floor: 4, room: '401', status: 'available' }
    ]);
    console.log(`Created ${beds.length} beds`);

    // Create patients
    const patients = await Patient.create([
      {
        patientId: 'P001',
        name: 'Robert Johnson',
        age: 67,
        gender: 'Male',
        department: 'IPD',
        status: 'critical',
        diagnosis: 'Acute Myocardial Infarction',
        admissionDate: new Date('2024-01-15'),
        attendingDoctor: doctor._id,
        attendingNurse: sarah._id,
        attendingNurseName: 'Sarah Johnson',
        room: 'ICU - 201',
        isInBed: true,
        allergies: ['Penicillin'],
        triageLevel: 1
      },
      {
        patientId: 'P002',
        name: 'Maria Garcia',
        age: 45,
        gender: 'Female',
        department: 'IPD',
        status: 'stable',
        diagnosis: 'Post-surgical recovery (Appendectomy)',
        admissionDate: new Date('2024-01-18'),
        attendingDoctor: doctor._id,
        attendingNurse: sarah._id,
        attendingNurseName: 'Sarah Johnson',
        room: 'General - 301',
        isInBed: true
      },
      {
        patientId: 'P003',
        name: 'James Williams',
        age: 58,
        gender: 'Male',
        department: 'Emergency',
        status: 'warning',
        diagnosis: 'Chest pain - Under observation',
        admissionDate: new Date('2024-01-20'),
        attendingDoctor: drWilson._id,
        attendingNurse: mike._id,
        attendingNurseName: 'Mike Chen',
        room: 'ER - 101',
        isInBed: true,
        triageLevel: 2,
        arrivalTime: new Date('2024-01-20T14:30:00')
      },
      {
        patientId: 'P004',
        name: 'Lisa Anderson',
        age: 32,
        gender: 'Female',
        department: 'OPD',
        status: 'normal',
        diagnosis: 'Prenatal Checkup',
        admissionDate: new Date('2024-01-20'),
        attendingDoctor: doctor._id,
        attendingNurse: emily._id,
        attendingNurseName: 'Emily Davis',
        isInBed: false
      },
      {
        patientId: 'P005',
        name: 'Thomas Brown',
        age: 72,
        gender: 'Male',
        department: 'ICU',
        status: 'critical',
        diagnosis: 'Severe Pneumonia with Respiratory Failure',
        admissionDate: new Date('2024-01-19'),
        attendingDoctor: doctor._id,
        attendingNurse: sarah._id,
        attendingNurseName: 'Sarah Johnson',
        room: 'ICU - 202',
        isInBed: true,
        allergies: ['Sulfa drugs', 'Aspirin'],
        triageLevel: 1
      },
      {
        patientId: 'P006',
        name: 'Patricia Brown',
        age: 55,
        gender: 'Female',
        department: 'OPD',
        status: 'normal',
        diagnosis: 'Annual Physical Examination',
        admissionDate: new Date('2024-01-20'),
        attendingNurse: emily._id,
        attendingNurseName: 'Emily Davis',
        isInBed: false
      },
      {
        patientId: 'P007',
        name: 'Michael Davis',
        age: 41,
        gender: 'Male',
        department: 'Emergency',
        status: 'warning',
        diagnosis: 'Severe abdominal pain',
        admissionDate: new Date('2024-01-20'),
        attendingDoctor: drWilson._id,
        attendingNurse: mike._id,
        attendingNurseName: 'Mike Chen',
        room: 'ER - 102',
        isInBed: true,
        triageLevel: 2,
        arrivalTime: new Date('2024-01-20T16:45:00')
      },
      {
        patientId: 'P008',
        name: 'Jennifer Martinez',
        age: 28,
        gender: 'Female',
        department: 'IPD',
        status: 'stable',
        diagnosis: 'Diabetic Ketoacidosis - Recovering',
        admissionDate: new Date('2024-01-17'),
        attendingDoctor: doctor._id,
        attendingNurse: sarah._id,
        attendingNurseName: 'Sarah Johnson',
        room: 'General - 302',
        isInBed: true
      }
    ]);
    console.log(`Created ${patients.length} patients`);

    // Assign beds to patients
    const bedAssignments = [
      { bed: beds[0], patient: patients[0] }, // ICU-001 for Robert
      { bed: beds[3], patient: patients[1] }, // GEN-001 for Maria
      { bed: beds[6], patient: patients[2] }, // ER-001 for James
      { bed: beds[1], patient: patients[4] }, // ICU-002 for Thomas
      { bed: beds[7], patient: patients[6] }, // ER-002 for Michael
      { bed: beds[4], patient: patients[7] }, // GEN-002 for Jennifer
    ];

    for (const assignment of bedAssignments) {
      await Bed.findByIdAndUpdate(assignment.bed._id, {
        patient: assignment.patient._id,
        status: 'occupied'
      });
      await Patient.findByIdAndUpdate(assignment.patient._id, {
        bed: assignment.bed._id
      });
    }
    console.log('Assigned beds to patients');

    // Create vitals for ICU patients
    const vitals = await Vital.create([
      {
        patient: patients[0]._id,
        recordedBy: sarah._id,
        heartRate: { value: 110, unit: 'bpm' },
        bloodPressure: { systolic: 145, diastolic: 92, unit: 'mmHg' },
        temperature: { value: 99.2, unit: '°F' },
        oxygenSaturation: { value: 94, unit: '%' },
        respiratoryRate: { value: 22, unit: 'breaths/min' },
        recordedAt: new Date()
      },
      {
        patient: patients[4]._id,
        recordedBy: sarah._id,
        heartRate: { value: 95, unit: 'bpm' },
        bloodPressure: { systolic: 130, diastolic: 85, unit: 'mmHg' },
        temperature: { value: 101.5, unit: '°F' },
        oxygenSaturation: { value: 89, unit: '%' },
        respiratoryRate: { value: 28, unit: 'breaths/min' },
        recordedAt: new Date()
      }
    ]);
    console.log(`Created ${vitals.length} vital records`);

    // Create alerts
    const alerts = await Alert.create([
      {
        type: 'critical',
        title: 'Critical Vitals - Room ICU-201',
        message: 'Patient Robert Johnson has elevated heart rate and low oxygen saturation',
        patient: patients[0]._id,
        targetDepartment: 'ICU',
        priority: 'critical',
        status: 'active',
        createdBy: sarah._id
      },
      {
        type: 'vital',
        title: 'Low SpO2 Alert',
        message: 'Oxygen saturation dropped below 90% for Thomas Brown',
        patient: patients[4]._id,
        targetDepartment: 'ICU',
        priority: 'critical',
        status: 'active',
        createdBy: sarah._id
      },
      {
        type: 'medication',
        title: 'Medication Due',
        message: 'Insulin administration due for Jennifer Martinez',
        patient: patients[7]._id,
        targetUser: sarah._id,
        priority: 'high',
        status: 'active'
      }
    ]);
    console.log(`Created ${alerts.length} alerts`);

    // Create tasks
    const tasks = await Task.create([
      {
        title: 'Check vitals - ICU patients',
        description: 'Routine vital signs check for all ICU patients',
        type: 'vital-check',
        priority: 'high',
        status: 'pending',
        assignedTo: sarah._id,
        assignedBy: admin._id,
        dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
      },
      {
        title: 'Administer morning medications',
        description: 'Morning medication round for General ward',
        type: 'medication',
        priority: 'high',
        status: 'in-progress',
        patient: patients[1]._id,
        assignedTo: sarah._id,
        assignedBy: doctor._id,
        dueDate: new Date(Date.now() + 1 * 60 * 60 * 1000)
      },
      {
        title: 'Update patient documentation',
        description: 'Complete discharge summary for Maria Garcia',
        type: 'documentation',
        priority: 'medium',
        status: 'pending',
        patient: patients[1]._id,
        assignedTo: sarah._id,
        assignedBy: doctor._id,
        dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000)
      },
      {
        title: 'ER Patient Assessment',
        description: 'Complete initial assessment for new ER arrival',
        type: 'patient-care',
        priority: 'urgent',
        status: 'pending',
        patient: patients[6]._id,
        assignedTo: mike._id,
        assignedBy: drWilson._id,
        dueDate: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
      }
    ]);
    console.log(`Created ${tasks.length} tasks`);

    // Create medications
    const medications = await Medication.create([
      {
        patient: patients[0]._id,
        name: 'Aspirin',
        dosage: '81mg',
        route: 'oral',
        frequency: 'Once daily',
        scheduledTimes: ['08:00'],
        startDate: new Date('2024-01-15'),
        status: 'active',
        prescribedBy: doctor._id
      },
      {
        patient: patients[0]._id,
        name: 'Metoprolol',
        dosage: '25mg',
        route: 'oral',
        frequency: 'Twice daily',
        scheduledTimes: ['08:00', '20:00'],
        startDate: new Date('2024-01-15'),
        status: 'active',
        prescribedBy: doctor._id
      },
      {
        patient: patients[7]._id,
        name: 'Insulin Lispro',
        dosage: '10 units',
        route: 'sc',
        frequency: 'Three times daily with meals',
        scheduledTimes: ['07:00', '12:00', '18:00'],
        startDate: new Date('2024-01-17'),
        status: 'active',
        prescribedBy: doctor._id
      },
      {
        patient: patients[4]._id,
        name: 'Azithromycin',
        dosage: '500mg',
        route: 'iv',
        frequency: 'Once daily',
        scheduledTimes: ['10:00'],
        startDate: new Date('2024-01-19'),
        status: 'active',
        prescribedBy: doctor._id
      }
    ]);
    console.log(`Created ${medications.length} medications`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest credentials:');
    console.log('  Admin: admin@hospital.com / admin123');
    console.log('  Doctor: doctor@hospital.com / doctor123');
    console.log('  Nurse: sarah@hospital.com / nurse123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
