import { type Rule } from "json-rules-engine";

const MALE_HB_RANGE = [120, 160] as const
const FEMALE_HB_RANGE = [110, 150] as const
const MCV_RANGE = [80, 100]

const ruleIsAnaemic: Rule = {
  name: 'ruleIsAnaemic',
  priority: 100,
  conditions: {
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
  },
  event: { type: 'diagnosis' },
  onSuccess: async function (_, almanac) {
    almanac.addFact('isAnaemic', true)
  },
  onFailure: async function (_, almanac) {
    almanac.addFact('isAnaemic', false)
  }
}

const ruleIsMicrocyticAnaemia: Rule = {
  name: 'isMicrocyticAnaemia',
  priority: 95,
  conditions: {
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
  },
  event: { type: 'diagnosis' },
  onSuccess: async function (_, almanac) {
    almanac.addFact('isMicrocyticAnaemia', true)
  },
  onFailure: async function (_, almanac) {
    almanac.addFact('isMicrocyticAnaemia', false)
  }
}

const ruleIsMacrocyticAnaemia: Rule = {
  name: 'isMacrocyticAnaemia',
  priority: 95,
  conditions: {
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
  },
  event: { type: 'diagnosis' },
  onSuccess: async function (_, almanac) {
    almanac.addFact('isMacrocyticAnaemia', true)
  },
  onFailure: async function (_, almanac) {
    almanac.addFact('isMacrocyticAnaemia', false)
  }
}
