export interface Unit {
  label: string;
  unit: string;
  conversion_factor: number;
  range?: {
    high: number;
    low: number;
  };
}

export const WeightUnits: Unit[] = [
  {
  label: "weight",
    unit: "kg",
    conversion_factor: 1,
  },
  {
    label: "weight",
    unit: "lbs",
    conversion_factor:  0.45,
  },
  {
    label: "weight",
    unit: "Stone",
    conversion_factor: 6.35,
  },
];

export const HeightUnits: Unit[] = [
  {
    label: "height",
    unit: "cm",
    conversion_factor: 1,
  },
  {
    label: "height",
    unit: "m",
    conversion_factor: 100,
  },
  {
    label: "height",
    unit: "inches",
    conversion_factor: 2.54,
  },
];

export const SodiumUnits: Unit[] = [
  {
    label: "Current Sodium",
    unit: "mmol/L",
    conversion_factor: 1,
    range: {
      high: 145,
      low: 135,
    },
  },
];

export const TargetSodiumUnits: Unit[] = [
  {
    label: "Target Sodium",
    unit: "mmol/L",
    conversion_factor: 1,
    range: {
      high: 145,
      low: 135,
    },
  },
]
export const CorrectionRate: Unit[] = [
  {
    label: "Correction Rate",
    unit: "mEq/L/day",
    conversion_factor: 1,
    range: {
      high: 12,
      low: 0,
    },
  },
];

export const UrniaryLosses : Unit[] = [
  {
  label: 'Urinary Losses',
    unit: 'ml/day',
    conversion_factor: .001,
  },
  {
    label: 'Urinary Losses',
    unit: 'ml/hr',
    conversion_factor: .024
  }
]


export const OtherLosses : Unit[] = [
  {
  label: 'Vomiting & Diarrhoea Losses',
    unit: 'ml/day',
    conversion_factor: .001,
  },
]
export const InsensibleLosses : Unit[] = [
  {
  label: 'Insensible Losses',
    unit: 'ml/day',
    conversion_factor: .001,
  },
]