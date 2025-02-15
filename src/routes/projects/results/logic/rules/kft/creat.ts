import type { Almanac, Rule } from "json-rules-engine";
import { AnalysisLevel } from "../../engine.types";
import { DEFAULTS } from "../../defaults";

const conditionIsCreatinineNormal = {
  any: [{
    name: 'Male Normal',
    all: [{
      fact: 'isMale',
      operator: 'equal',
      value: true
    }, {
      fact: 'creatinine',
      operator: 'inRange',
      value: DEFAULTS.MALE_CREATININE_RANGE
    }
    ],
  }, {
    name: 'Female Normal',
    all: [{
      fact: 'isMale',
      operator: 'equal',
      value: false
    }, {
      fact: 'creatinine',
      operator: 'inRange',
      value: DEFAULTS.FEMALE_CREATININE_RANGE
    }
    ],
  }
  ]
}

const conditionIsCreatinineLow = {
  any: [{
    name: 'Male Kidney Disease',
    all: [{
      fact: 'isMale',
      operator: 'equal',
      value: true
    }, {
      fact: 'creatinine',
      operator: 'lessThan',
      value: DEFAULTS.MALE_CREATININE_RANGE[0]
    }
    ],
  }, {
    name: 'Female Kidney Disease',
    all: [{
      fact: 'isMale',
      operator: 'equal',
      value: false
    }, {
      fact: 'creatinine',
      operator: 'lessThan',
      value: DEFAULTS.FEMALE_CREATININE_RANGE[0]
    }
    ],
  }
  ]
}

export const ruleIsCreatinineNormal: Rule = {
  name: 'isCreatinineNormal',
  priority: AnalysisLevel.LEVEL_1,
  conditions: conditionIsCreatinineNormal,
  event: { type: 'diagnosis', params: { creatinine: { fact: 'creatinine' } } },
  onSuccess: async function(event, almanac) {
    console.log('normal creatinine')
  },
  onFailure: async function(event, almanac: Almanac) {
    const mainArray = await almanac.factValue('mainArray')
    almanac.addFact('mainArray', [...mainArray, ruleIsCreatinineLow])
    console.log('abnormal creatinine')
    debugger
  }
}


const ruleIsCreatinineLow: Rule = {
  name: 'isCreatinineLow',
  priority: AnalysisLevel.LEVEL_1,
  conditions: conditionIsCreatinineLow,
  event: { type: 'diagnosis', params: { creatinine: { fact: 'creatinine' } } },
  onSuccess: async function(event, almanac) {
    console.log('low creatinine')
    // const mainArray = await almanac.factValue('mainArray')
    // almanac.addFact('mainArray', [...mainArray, ])
  },
  onFailure: async function(_, almanac) {
    console.log('high creatinine')
  }
}

function calculateCreatinineClearance() {

}
