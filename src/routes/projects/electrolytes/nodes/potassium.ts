import type { DecisionNode } from ".";
export const symptomsModerateHypokalemia = [
  'Malaise',
  'Muscle weakness/ cramps',
  'export constipation',
  'ECG changes: U waves, T wave flattening or inversion, ST segment depression',
  'Respiratory insufficiency'
]

export const symptomsSevereHypokalemia = [
  ...symptomsModerateHypokalemia,
  'Paralysis',
  'Rhabdomyolysis',
  'Cardiac arrhythmia, especially patients with ischaemic heart disease, heart failure, left ventricular hypertrophy',
  'Digoxin Toxicity'
]
export const severeHypokalemia: DecisionNode = {
  action: "No replacement needed. Monitor for other imbalances.",
  info: "Potassium is within normal range. Check for other electrolytes if clinically indicated.",
};

export const nonCardiacSymptomaticHypokalemia: DecisionNode = {
  action: "Get patient a monitored bed, needs monitoring while high dose K",
  info: "Potassium is within normal range. Check for other electrolytes if clinically indicated.",
  question: "Are there any ECG changes? Increased PR interval, QRS duration",
};

export const cardiacSymptomaticHypokalemia: DecisionNode = {
  action: "Get patient a monitored bed, needs monitoring while high dose K",
  info: "Potassium is within normal range. Check for other electrolytes if clinically indicated.",
  question: "Are there any ECG changes? Increased PR interval, QRS duration",
  plan: {
    Actions: ['Monitored Bed', 'Repeat K+ levels in 4 hours']
  }
};

export const mildHypokalemia: DecisionNode = {
  action: "No replacement needed. Monitor for other imbalances.",
  info: "Potassium is within normal range. Check for other electrolytes if clinically indicated.",
  question: "Are there any ECG changes? Increased PR interval, QRS duration",
  branches: {
    'Yes': cardiacSymptomaticHypokalemia,
    'No': nonCardiacSymptomaticHypokalemia
  }
};


export const moderateHypokalemia: DecisionNode = {
  action: "No replacement needed. Monitor for other imbalances.",
  info: symptomsModerateHypokalemia,
  question: "Are there any ECG changes? Increased PR interval, QRS duration",
  branches: {
    'Yes': cardiacSymptomaticHypokalemia,
    'No': nonCardiacSymptomaticHypokalemia
  },
  plan: {
    Impression: ['Moderate Hypokalemia'],
  }
};

export const actionNormalK: DecisionNode = {
  action: "No replacement needed. Monitor for other imbalances.",
  info: "Potassium is within normal range. Check for other electrolytes if clinically indicated.",
};

export const actionHighK: DecisionNode = {
  action: "Administer calcium gluconate, insulin, and glucose to stabilize cardiac membranes.",
  info: "High potassium (hyperkalemia) can cause life-threatening arrhythmias.",
};


export const actionHypokalemia: DecisionNode = {
  question: "How Low is the Potassium?",
  info: "Low potassium (hypokalemia) can cause muscle weakness and arrhythmias.",
  branches: {
    '3 - 3.5 mEq/L': mildHypokalemia,
    '2.5 - 3 mEq/L': moderateHypokalemia,
    '<2.5 mEq/L': severeHypokalemia
  }
};

const causesHypokalemia = {
  causes: ['Insufficient Intake']
}

export const KRootNode: DecisionNode = {
  question: "What is the patient's potassium level?",
  branches: {
    'Less than 3.5 mEq/L': actionHypokalemia,
    'More than 5.3 mEq/L': actionHighK,
  },
};

