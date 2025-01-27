/**
 *
 * Causes
 * Actions
 * Questions
 * Info
 * Branches
 *
 * Could add a tag to each node that these questions/actions need to be saved
 */

import type { DecisionNode } from ".";

const euvolaemicHypoNa: DecisionNode = {
  info: 'Increased total body water but normal total body sodium',
  // branches: {
  //   'Urinary omsolality > 100 mOsm/kg': siadhnode,
  //   'Urinary omsolality < 100 mOsm/kg': lowsoluteintake
  // },
  plan: {
    Impression: ['Euvolaemic Hypotonic Hyponatremia']
  }
}

const hypovolaemicHypoNa: DecisionNode = {}
const hypervolaemicHypoNa: DecisionNode = {}

const hypotonicHypoNa: DecisionNode = {
  action: 'Asses fluid status (vitals, JVP, mucous membranes, oedema, U/Es)',
  info: 'Hypotonic Hyponatremia',
  branches: {
    'Hypovolaemic': hypovolaemicHypoNa,
    'Euvolaemic': euvolaemicHypoNa,
    'Hypervolaemic': hypervolaemicHypoNa
  }
}

const hypertonicHypoNa: DecisionNode = {
  action: 'Check for Blood Sugar levels or recent use of mannitol/sorbitol/radiocontrast media',
  plan: { Impression: ['Hypertonic Hyponatremia'], }
}
const isotonicHypoNa: DecisionNode = {
  action: 'Check for Hyperproteinuria / Hyperlilidaemia',
  info: 'Pseudohyponatremia',
  plan: { Impression: ['Isotonic Hyponatremia'], Actions: ['Lipid Profile', 'LFTs'] }
}

const checkSerumOsmolality: DecisionNode = {
  action: 'Check serum osmolality',
  branches: {
    '< 280 mOsm/kg': hypotonicHypoNa,
    '280 - 285 mOsm/kg': isotonicHypoNa,
    '> 285 mOsm/kg': hypertonicHypoNa
  },
  plan: {
    Actions: ['Check serum osmolality'],
  }
}


const severeHypoNaInitial: DecisionNode = {
  action: 'Treat as Severe Hyponatremia',
  plan: {
    Impression: ['Severe Hypontremia'],
  }
}

export const rootHypoNaNode: DecisionNode = {
  question: 'Is patient symptomatic because of the low sodium?',
  info: 'Confusion, Ataxia, Seizures',
  branches: {
    "Yes ": severeHypoNaInitial,
    'No': checkSerumOsmolality
  }
}
