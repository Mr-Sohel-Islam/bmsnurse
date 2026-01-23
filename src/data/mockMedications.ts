export type MedicationFrequency = 
  | 'once' 
  | 'BID' // twice daily
  | 'TID' // three times daily
  | 'QID' // four times daily
  | 'Q4H' // every 4 hours
  | 'Q6H' // every 6 hours
  | 'Q8H' // every 8 hours
  | 'Q12H' // every 12 hours
  | 'PRN' // as needed
  | 'stat'; // immediately

export type AdministrationRoute = 
  | 'PO' // oral
  | 'IV' // intravenous
  | 'IM' // intramuscular
  | 'SC' // subcutaneous
  | 'SL' // sublingual
  | 'topical'
  | 'inhaled';

export type MedicationStatus = 'scheduled' | 'due' | 'overdue' | 'administered' | 'held' | 'discontinued';

export interface DrugInteraction {
  drugName: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
}

export interface ScheduledDose {
  id: string;
  scheduledTime: string;
  status: MedicationStatus;
  administeredAt?: string;
  administeredBy?: string;
  notes?: string;
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  genericName: string;
  dosage: string;
  route: AdministrationRoute;
  frequency: MedicationFrequency;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  instructions?: string;
  scheduledDoses: ScheduledDose[];
  interactions: DrugInteraction[];
  warnings: string[];
  isHighAlert: boolean;
}

export interface AdministrationLog {
  id: string;
  medicationId: string;
  patientId: string;
  patientName: string;
  medicationName: string;
  dosage: string;
  route: AdministrationRoute;
  scheduledTime: string;
  administeredAt: string;
  administeredBy: string;
  status: 'given' | 'held' | 'refused' | 'not-given';
  notes?: string;
}

// Drug interaction database (simplified)
export const drugInteractionDatabase: Record<string, DrugInteraction[]> = {
  'Aspirin': [
    { drugName: 'Warfarin', severity: 'severe', description: 'Increased risk of bleeding' },
    { drugName: 'Ibuprofen', severity: 'moderate', description: 'Reduced cardioprotective effect' },
    { drugName: 'Methotrexate', severity: 'severe', description: 'Increased methotrexate toxicity' },
  ],
  'Metoprolol': [
    { drugName: 'Verapamil', severity: 'severe', description: 'Risk of bradycardia and heart block' },
    { drugName: 'Clonidine', severity: 'moderate', description: 'Rebound hypertension on withdrawal' },
    { drugName: 'Insulin', severity: 'moderate', description: 'Masked hypoglycemia symptoms' },
  ],
  'Morphine': [
    { drugName: 'Benzodiazepines', severity: 'severe', description: 'Respiratory depression risk' },
    { drugName: 'MAOIs', severity: 'severe', description: 'Serotonin syndrome risk' },
    { drugName: 'Alcohol', severity: 'severe', description: 'CNS depression' },
  ],
  'Insulin': [
    { drugName: 'Metoprolol', severity: 'moderate', description: 'Masked hypoglycemia symptoms' },
    { drugName: 'Corticosteroids', severity: 'moderate', description: 'Increased blood glucose' },
    { drugName: 'Alcohol', severity: 'moderate', description: 'Hypoglycemia risk' },
  ],
  'Warfarin': [
    { drugName: 'Aspirin', severity: 'severe', description: 'Increased bleeding risk' },
    { drugName: 'NSAIDs', severity: 'severe', description: 'Increased bleeding risk' },
    { drugName: 'Vitamin K', severity: 'moderate', description: 'Reduced anticoagulant effect' },
  ],
  'Oxycodone': [
    { drugName: 'Benzodiazepines', severity: 'severe', description: 'Respiratory depression' },
    { drugName: 'Alcohol', severity: 'severe', description: 'CNS depression' },
    { drugName: 'Muscle relaxants', severity: 'moderate', description: 'Increased sedation' },
  ],
  'Enoxaparin': [
    { drugName: 'Aspirin', severity: 'moderate', description: 'Increased bleeding risk' },
    { drugName: 'NSAIDs', severity: 'moderate', description: 'Increased bleeding risk' },
    { drugName: 'Warfarin', severity: 'severe', description: 'Major bleeding risk' },
  ],
};

// Generate scheduled doses based on frequency
function generateScheduledDoses(
  frequency: MedicationFrequency,
  startDate: string
): ScheduledDose[] {
  const doses: ScheduledDose[] = [];
  const baseDate = new Date(startDate);
  const now = new Date();
  
  const scheduleHours: Record<MedicationFrequency, number[]> = {
    'once': [9],
    'BID': [8, 20],
    'TID': [8, 14, 20],
    'QID': [6, 12, 18, 24],
    'Q4H': [0, 4, 8, 12, 16, 20],
    'Q6H': [6, 12, 18, 24],
    'Q8H': [6, 14, 22],
    'Q12H': [8, 20],
    'PRN': [],
    'stat': [now.getHours()],
  };

  const hours = scheduleHours[frequency];
  
  // Generate for today
  hours.forEach((hour, idx) => {
    const doseTime = new Date(now);
    doseTime.setHours(hour, 0, 0, 0);
    
    let status: MedicationStatus = 'scheduled';
    let administeredAt: string | undefined;
    let administeredBy: string | undefined;
    
    if (doseTime < now) {
      // Past doses
      if (Math.random() > 0.2) {
        status = 'administered';
        administeredAt = new Date(doseTime.getTime() + Math.random() * 15 * 60000).toISOString();
        administeredBy = ['Sarah Johnson', 'Michael Chen', 'Emily Rodriguez'][Math.floor(Math.random() * 3)];
      } else {
        status = 'overdue';
      }
    } else if (doseTime.getTime() - now.getTime() < 30 * 60000) {
      status = 'due';
    }
    
    doses.push({
      id: `dose-${Date.now()}-${idx}`,
      scheduledTime: doseTime.toISOString(),
      status,
      administeredAt,
      administeredBy,
    });
  });

  return doses;
}

export const mockMedications: Medication[] = [
  // Patient P001 - John Smith (Critical - MI)
  {
    id: 'M001',
    patientId: 'P001',
    name: 'Aspirin',
    genericName: 'Acetylsalicylic acid',
    dosage: '81mg',
    route: 'PO',
    frequency: 'once',
    startDate: '2026-01-20',
    prescribedBy: 'Dr. Anderson',
    instructions: 'Take with food',
    scheduledDoses: generateScheduledDoses('once', '2026-01-20'),
    interactions: drugInteractionDatabase['Aspirin'] || [],
    warnings: ['GI bleeding risk', 'Avoid in active bleeding'],
    isHighAlert: false,
  },
  {
    id: 'M002',
    patientId: 'P001',
    name: 'Metoprolol',
    genericName: 'Metoprolol tartrate',
    dosage: '25mg',
    route: 'PO',
    frequency: 'BID',
    startDate: '2026-01-20',
    prescribedBy: 'Dr. Anderson',
    instructions: 'Monitor heart rate before administration',
    scheduledDoses: generateScheduledDoses('BID', '2026-01-20'),
    interactions: drugInteractionDatabase['Metoprolol'] || [],
    warnings: ['Do not give if HR < 60', 'May mask hypoglycemia'],
    isHighAlert: true,
  },
  {
    id: 'M003',
    patientId: 'P001',
    name: 'Nitroglycerin',
    genericName: 'Nitroglycerin',
    dosage: '0.4mg',
    route: 'SL',
    frequency: 'PRN',
    startDate: '2026-01-20',
    prescribedBy: 'Dr. Anderson',
    instructions: 'Give for chest pain. May repeat x3 every 5 minutes.',
    scheduledDoses: [],
    interactions: [],
    warnings: ['Check BP before giving', 'May cause severe hypotension'],
    isHighAlert: true,
  },
  
  // Patient P003 - Robert Davis (Critical - Pneumonia)
  {
    id: 'M004',
    patientId: 'P003',
    name: 'Ceftriaxone',
    genericName: 'Ceftriaxone sodium',
    dosage: '1g',
    route: 'IV',
    frequency: 'Q12H',
    startDate: '2026-01-22',
    prescribedBy: 'Dr. Martinez',
    instructions: 'Infuse over 30 minutes',
    scheduledDoses: generateScheduledDoses('BID', '2026-01-22'),
    interactions: [],
    warnings: ['Check for penicillin allergy', 'Monitor for allergic reaction'],
    isHighAlert: false,
  },
  {
    id: 'M005',
    patientId: 'P003',
    name: 'Azithromycin',
    genericName: 'Azithromycin',
    dosage: '500mg',
    route: 'IV',
    frequency: 'once',
    startDate: '2026-01-22',
    prescribedBy: 'Dr. Martinez',
    instructions: 'Infuse over 1 hour',
    scheduledDoses: generateScheduledDoses('once', '2026-01-22'),
    interactions: [
      { drugName: 'Warfarin', severity: 'moderate', description: 'Increased anticoagulation' },
    ],
    warnings: ['QT prolongation risk', 'Monitor cardiac rhythm'],
    isHighAlert: false,
  },

  // Patient P005 - James Wilson (DKA)
  {
    id: 'M006',
    patientId: 'P005',
    name: 'Insulin Regular',
    genericName: 'Insulin human regular',
    dosage: '0.1 units/kg/hr',
    route: 'IV',
    frequency: 'Q4H',
    startDate: '2026-01-21',
    prescribedBy: 'Dr. Patel',
    instructions: 'Continuous infusion. Titrate per protocol.',
    scheduledDoses: generateScheduledDoses('Q4H', '2026-01-21'),
    interactions: drugInteractionDatabase['Insulin'] || [],
    warnings: ['HIGH ALERT medication', 'Verify with second nurse', 'Monitor glucose hourly'],
    isHighAlert: true,
  },
  {
    id: 'M007',
    patientId: 'P005',
    name: 'Potassium Chloride',
    genericName: 'Potassium chloride',
    dosage: '20mEq',
    route: 'IV',
    frequency: 'Q6H',
    startDate: '2026-01-21',
    prescribedBy: 'Dr. Patel',
    instructions: 'Infuse over 2 hours. Never give IV push.',
    scheduledDoses: generateScheduledDoses('Q6H', '2026-01-21'),
    interactions: [],
    warnings: ['HIGH ALERT medication', 'Never IV push', 'Monitor for cardiac arrhythmias'],
    isHighAlert: true,
  },

  // Patient P007 - Michael Thompson (MVA)
  {
    id: 'M008',
    patientId: 'P007',
    name: 'Morphine Sulfate',
    genericName: 'Morphine sulfate',
    dosage: '4mg',
    route: 'IV',
    frequency: 'PRN',
    startDate: '2026-01-22',
    prescribedBy: 'Dr. Lee',
    instructions: 'Give for pain > 5/10. May repeat every 4 hours.',
    scheduledDoses: [],
    interactions: drugInteractionDatabase['Morphine'] || [],
    warnings: ['HIGH ALERT - Opioid', 'Respiratory depression risk', 'Assess pain and sedation'],
    isHighAlert: true,
  },

  // Patient P008 - Jennifer Martinez (TKR)
  {
    id: 'M009',
    patientId: 'P008',
    name: 'Oxycodone',
    genericName: 'Oxycodone hydrochloride',
    dosage: '5mg',
    route: 'PO',
    frequency: 'Q6H',
    startDate: '2026-01-20',
    prescribedBy: 'Dr. Kim',
    instructions: 'Give for pain > 4/10',
    scheduledDoses: generateScheduledDoses('Q6H', '2026-01-20'),
    interactions: drugInteractionDatabase['Oxycodone'] || [],
    warnings: ['HIGH ALERT - Opioid', 'May cause constipation', 'Fall precautions'],
    isHighAlert: true,
  },
  {
    id: 'M010',
    patientId: 'P008',
    name: 'Enoxaparin',
    genericName: 'Enoxaparin sodium',
    dosage: '40mg',
    route: 'SC',
    frequency: 'once',
    startDate: '2026-01-20',
    prescribedBy: 'Dr. Kim',
    instructions: 'Inject in abdomen. Rotate sites.',
    scheduledDoses: generateScheduledDoses('once', '2026-01-20'),
    interactions: drugInteractionDatabase['Enoxaparin'] || [],
    warnings: ['Monitor for bleeding', 'Hold if platelets < 100k'],
    isHighAlert: true,
  },
  {
    id: 'M011',
    patientId: 'P008',
    name: 'Cefazolin',
    genericName: 'Cefazolin sodium',
    dosage: '1g',
    route: 'IV',
    frequency: 'Q8H',
    startDate: '2026-01-20',
    endDate: '2026-01-23',
    prescribedBy: 'Dr. Kim',
    instructions: 'Surgical prophylaxis. Discontinue after 48 hours.',
    scheduledDoses: generateScheduledDoses('Q8H', '2026-01-20'),
    interactions: [],
    warnings: ['Check for penicillin allergy'],
    isHighAlert: false,
  },
];

export const mockAdministrationLogs: AdministrationLog[] = [
  {
    id: 'AL001',
    medicationId: 'M001',
    patientId: 'P001',
    patientName: 'John Smith',
    medicationName: 'Aspirin 81mg',
    dosage: '81mg',
    route: 'PO',
    scheduledTime: '2026-01-22T08:00:00',
    administeredAt: '2026-01-22T08:05:00',
    administeredBy: 'Sarah Johnson',
    status: 'given',
    notes: 'Given with breakfast',
  },
  {
    id: 'AL002',
    medicationId: 'M002',
    patientId: 'P001',
    patientName: 'John Smith',
    medicationName: 'Metoprolol 25mg',
    dosage: '25mg',
    route: 'PO',
    scheduledTime: '2026-01-22T08:00:00',
    administeredAt: '2026-01-22T08:10:00',
    administeredBy: 'Sarah Johnson',
    status: 'given',
    notes: 'HR 72 before administration',
  },
  {
    id: 'AL003',
    medicationId: 'M006',
    patientId: 'P005',
    patientName: 'James Wilson',
    medicationName: 'Insulin Regular',
    dosage: '0.1 units/kg/hr',
    route: 'IV',
    scheduledTime: '2026-01-22T06:00:00',
    administeredAt: '2026-01-22T06:02:00',
    administeredBy: 'Michael Chen',
    status: 'given',
    notes: 'Glucose 285. Rate adjusted per protocol.',
  },
  {
    id: 'AL004',
    medicationId: 'M009',
    patientId: 'P008',
    patientName: 'Jennifer Martinez',
    medicationName: 'Oxycodone 5mg',
    dosage: '5mg',
    route: 'PO',
    scheduledTime: '2026-01-22T06:00:00',
    administeredAt: '2026-01-22T06:15:00',
    administeredBy: 'Michael Chen',
    status: 'given',
    notes: 'Pain 6/10 before, 3/10 after 30 minutes',
  },
];

export function getMedicationsForPatient(patientId: string): Medication[] {
  return mockMedications.filter(med => med.patientId === patientId);
}

export function getDueMedications(): Medication[] {
  return mockMedications.filter(med => 
    med.scheduledDoses.some(dose => dose.status === 'due' || dose.status === 'overdue')
  );
}

export function getOverdueMedications(): Medication[] {
  return mockMedications.filter(med =>
    med.scheduledDoses.some(dose => dose.status === 'overdue')
  );
}
