/**
 * How to handle severity of anaemia
 *
 * FBC:
 *  - hb
 *  - plt
 *  - wbc
 *  - neut
 *  - other cells
 *  - mcv
 *
 */

import { Operator, type Rule } from "json-rules-engine";
import { FEMALE_HB_RANGE, MALE_HB_RANGE, MCV_RANGE, PLT_RANGE } from "../defaults";
import { AnalysisLevel, Severity } from "..";
const readline = require('readline')

const conditionIsAnaemic = {
  any: [{
    name: 'Male Anaemic',
    all: [{
      fact: 'isMale',
      operator: 'equal',
      value: true
    }, {
      fact: 'hb',
      operator: 'lessThan',
      value: MALE_HB_RANGE[0]
    }
    ],
  }, {
    name: 'Female Anaemic',
    all: [{
      fact: 'isMale',
      operator: 'equal',
      value: false
    }, {
      fact: 'hb',
      operator: 'lessThan',
      value: FEMALE_HB_RANGE[0]
    }
    ],
  }
  ]
}

export const ruleIsAnaemic: Rule = {
  name: 'isAnaemic',
  priority: AnalysisLevel.LEVEL_1,
  conditions: conditionIsAnaemic,
  event: { type: 'diagnosis', params: { hb: { fact: 'hb' } } },
  onSuccess: async function (event, almanac) {
    console.warn("DEBUGPRINT[90]: fbc.ts:50: event=", event)
    almanac.addFact('isAnaemic', true)
    // FIX: Try to add severity here
    // almanac.addFact('severity', anaemiaSeverity(event))
  },
  onFailure: async function (_, almanac) {
    almanac.addFact('isAnaemic', false)
  }
}


const conditonPlateletsInRange = {
  name: 'isPlatletsInRange',
  all: [{
    fact: 'plt',
    operator: 'inRange',
    value: PLT_RANGE
  }]
}
export const ruleIsPlatletsInRange: Rule = {
  name: 'isPlatletsInRange',
  priority: AnalysisLevel.LEVEL_1,
  conditions: conditonPlateletsInRange,
  event: { type: 'diagnosis' },
  onSuccess: async function (_, almanac) {
    console.log('platlets in range')
  }
}


const conditionIsMicrocyticAnaemia = {
  name: 'Microcytic Anaemia',
  all: [
    {
      fact: 'isAnaemic',
      operator: 'equal',
      value: true
    },
    {
      fact: 'mcv',
      operator: 'lessThan',
      value: MCV_RANGE[0]
    }
  ]
}
export const ruleIsMicrocyticAnaemia: Rule = {
  name: 'isMicrocyticAnaemia',
  priority: AnalysisLevel.LEVEL_2,
  conditions: conditionIsMicrocyticAnaemia,
  event: { type: 'diagnosis' },
  onSuccess: async function (_, almanac) {
    almanac.addFact('isMicrocyticAnaemia', true)
  },
  onFailure: async function (_, almanac) {
    almanac.addFact('isMicrocyticAnaemia', false)
  }
}

const conditionIsMacrocyticAnaemia = {
  name: 'Macrocytic Anaemia',
  all: [
    {
      fact: 'isAnaemic',
      operator: 'equal',
      value: true
    },
    {
      fact: 'mcv',
      operator: 'greaterThan',
      value: MCV_RANGE[1]
    }
  ]
}

export const ruleIsMacrocyticAnaemia: Rule = {
  name: 'isMacrocyticAnaemia',
  priority: AnalysisLevel.LEVEL_2,
  conditions: conditionIsMacrocyticAnaemia,
  event: { type: 'diagnosis' },
  onSuccess: async function (_, almanac) {
    almanac.addFact('isMacrocyticAnaemia', true)
  },
  onFailure: async function (_, almanac) {
    almanac.addFact('isMacrocyticAnaemia', false)
  }
}

// +++++++++++++++++++++++++++++++++++ Helpers  +++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++ Helpers  +++++++++++++++++++++++++++++++

function anaemiaSeverity(hb: number): Severity {
  if (hb < 80) return Severity.SEVERE
  if (hb < 100) return Severity.MODERATE
  return Severity.MILD
}

function inRangeConditionFactory(fact: string, range: [number, number]) {
  return {
    all: [{
      fact,
      range,
      operator: 'inRange'
    }]
  }
}
