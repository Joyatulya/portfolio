import type { Almanac, Rule } from "json-rules-engine"
import { DEFAULTS } from "../../defaults"
import { AnalysisLevel } from "../../engine.types"

const conditionIsMcvNormal = {
  name: 'Normal MCV',
  all: [
    {
      fact: 'mcv',
      operator: 'inRange',
      value: DEFAULTS.MCV_RANGE
    },
    // {
    //   fact: 'mcv',
    //   operator: 'notEqual',
    //   value: null
    // },
  ],
}

const conditionIsMicrocytic = {
  name: 'isMicrocytic',
  all: [{
    fact: 'mcv',
    operator: 'lessThan',
    value: DEFAULTS.MCV_RANGE[0]
  }],
}

const ruleIsMicrocytic: Rule = {
  name: 'isMicrocytic',
  priority: AnalysisLevel.LEVEL_1,
  conditions: conditionIsMicrocytic,
  event: { type: 'diagnosis', params: { mcv: { fact: 'mcv' } } },
  onSuccess: async function (event, almanac) {
    console.log('microcytic')
  },
  onFailure: async function (_, almanac) {
    console.log('macrocytic')
  }
}
export const ruleIsMcvNormal: Rule = {
  name: 'isMcvNormal',
  priority: AnalysisLevel.LEVEL_1,
  conditions: conditionIsMcvNormal,
  event: { type: 'diagnosis', params: { mcv: { fact: 'mcv' } } },
  onSuccess: async function (event, almanac) {
    console.log('normal mcv')
  },
  onFailure: async function (event, almanac: Almanac) {
    const mainArray = await almanac.factValue('mainArray')
    almanac.addFact('mainArray', [...mainArray, ruleIsMicrocytic])
    console.log('abnormal mcv')
  }
} 
