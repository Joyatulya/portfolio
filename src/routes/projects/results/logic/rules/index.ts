import type { Rule } from "json-rules-engine";
import type { InferenceValues } from "../types";
import { ruleIsHbNormal } from "./fbc/hb";
import { ruleIsPlateletsNormal } from "./fbc/plt";
import { ruleIsWbcNormal } from "./fbc/wbc";
import { ruleIsCreatinineNormal } from "./kft/creat";

export const levelOneRules: Record<keyof InferenceValues, Rule[]> = {
  hb: [ruleIsHbNormal],
  weight: [],
  wbc: [ruleIsWbcNormal],
  plt: [ruleIsPlateletsNormal],
  creatinine: [ruleIsCreatinineNormal]
}
