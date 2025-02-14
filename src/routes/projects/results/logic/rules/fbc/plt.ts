import type { Almanac, Rule } from "json-rules-engine";
import { AnalysisLevel } from "../../engine.types";
import { DEFAULTS } from "../../defaults";

const conditionIsPlateletsNormal = {
  all: [{
    fact: 'plt',
    operator: 'inRange',
    value: DEFAULTS.PLATELET_RANGE
  }]
};

const conditionIsThrombocytopenic = {
  all: [{
    fact: 'plt',
    operator: 'lessThan',
    value: DEFAULTS.PLATELET_RANGE[0]
  }]
};


const ruleIsThrombocytopenic: Rule = {
  name: 'isThrombocytopenic',
  priority: AnalysisLevel.LEVEL_1,
  conditions: conditionIsThrombocytopenic,
  event: { type: 'diagnosis', params: { plt: { fact: 'plt' } } },
  onSuccess: async () => console.log('thrombocytopenia'),
  onFailure: async () => console.log('thrombocytosis')
};

export const ruleIsPlateletsNormal: Rule = {
  name: 'isPlateletsNormal',
  priority: AnalysisLevel.LEVEL_1,
  conditions: conditionIsPlateletsNormal,
  event: { type: 'diagnosis', params: { plt: { fact: 'plt' } } },
  onSuccess: async () => console.log('normal platelets'),
  onFailure: async (_, almanac) => {
    const mainArray = await almanac.factValue('mainArray');
    almanac.addFact('mainArray', [...mainArray, ruleIsThrombocytopenic]);
    console.log('abnormal platelets');
  }
};
