import type { Almanac, Rule } from "json-rules-engine";
import { InteractiveEngine } from "../../engine";
import { AnalysisLevel } from "../../engine.types";
import { DEFAULTS } from "../../defaults";
import { ruleIsMcvNormal } from "./mcv";

const conditionIsHbNormal = {
  any: [{
    name: 'Male Normal',
    all: [{
      fact: 'isMale',
      operator: 'equal',
      value: true
    }, {
      fact: 'hb',
      operator: 'inRange',
      value: DEFAULTS.MALE_HB_RANGE
    }
    ],
  }, {
    name: 'Female Normal',
    all: [{
      fact: 'isMale',
      operator: 'equal',
      value: false
    }, {
      fact: 'hb',
      operator: 'inRange',
      value: DEFAULTS.FEMALE_HB_RANGE
    }
    ],
  }
  ]
}

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
      value: DEFAULTS.MALE_HB_RANGE[0]
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
      value: DEFAULTS.FEMALE_HB_RANGE[0]
    }
    ],
  }
  ]
}

export const ruleIsHbNormal: Rule = {
  name: 'isHbNormal',
  priority: AnalysisLevel.LEVEL_1,
  conditions: conditionIsHbNormal,
  event: { type: 'diagnosis', params: { hb: { fact: 'hb' } } },
  onSuccess: async function (event, almanac) {
    console.log('normal hb')
  },
  onFailure: async function (event, almanac: Almanac) {
    const mainArray = await almanac.factValue('mainArray')
    almanac.addFact('mainArray', [...mainArray, ruleIsAnaemic])
    console.log('abnormal hb')
  }
}


const ruleIsAnaemic: Rule = {
  name: 'isAnaemic',
  priority: AnalysisLevel.LEVEL_1,
  conditions: conditionIsAnaemic,
  event: { type: 'diagnosis', params: { hb: { fact: 'hb' } } },
  onSuccess: async function (event, almanac) {
    console.log('anaemic')
    const mainArray = await almanac.factValue('mainArray')
    almanac.addFact('mainArray', [...mainArray, ruleIsMcvNormal])
  },
  onFailure: async function (_, almanac) {
    console.log('polycythaemic')
  }
}

