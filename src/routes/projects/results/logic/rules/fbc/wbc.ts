import type { Almanac, Rule } from "json-rules-engine"
import { DEFAULTS } from "../../defaults"
import { AnalysisLevel } from "../../engine.types"

const conditionIsWbcNormal = {
  name: 'Male Normal WBC',
  all: [{
    fact: 'wbc',
    operator: 'inRange',
    value: DEFAULTS.WBC_RANGE
  }
  ],
}

const conditionIsLeukopenic = {
  name: 'isLeukopenic',
  all: [{
    fact: 'wbc',
    operator: 'lessThan',
    value: DEFAULTS.WBC_RANGE[0]
  }
  ],
}

const ruleIsLeukopenic: Rule = {
  name: 'isLeukopenic',
  priority: AnalysisLevel.LEVEL_1,
  conditions: conditionIsLeukopenic,
  event: { type: 'diagnosis', params: { wbc: { fact: 'wbc' } } },
  onSuccess: async function (event, almanac) {
    console.log('leukopenic')
  },
  onFailure: async function (_, almanac) {
    console.log('leukocytosis')
  }
}
export const ruleIsWbcNormal: Rule = {
  name: 'isWbcNormal',
  priority: AnalysisLevel.LEVEL_1,
  conditions: conditionIsWbcNormal,
  event: { type: 'diagnosis', params: { wbc: { fact: 'wbc' } } },
  onSuccess: async function (event, almanac) {
    console.log('normal wbc')
  },
  onFailure: async function (event, almanac: Almanac) {
    const mainArray = await almanac.factValue('mainArray')
    almanac.addFact('mainArray', [...mainArray, ruleIsLeukopenic])
    console.log('abnormal wbc')
  }
} 
