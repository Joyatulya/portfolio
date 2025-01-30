import { Engine, Rule, type EngineResult } from "json-rules-engine";
import { z } from "zod";

export enum Severity {
  MILD = 'Mild',
  MODERATE = 'Moderate',
  SEVERE = 'Severe'
}

export enum AnalysisLevel {
  LEVEL_1 = 100, // single parameter
  LEVEL_2 = 95, // Dual parameter
  LEVEL_3 = 90 // More complex
}

const zUser = z.object({
  weight: z.coerce.number().min(0).max(500).default(60),
  age: z.coerce.number().min(0).max(120).default(50),
  isMale: z.coerce.boolean().default(true)
})

const zFBC = z.object({
  hb: z.coerce.number().min(0).max(250).optional(),
  plt: z.coerce.number().min(0).max(10_00_000).optional(),
  wbc: z.coerce.number().min(0).max(500).optional(),
  neut: z.coerce.number().min(0).max(500).optional(),
  mcv: z.coerce.number().min(50).max(150).optional(),
})

const zKFT = z.object({
  na: z.coerce.number().positive().max(200).optional(),
  k: z.coerce.number().positive().max(11).optional(),
  creat: z.coerce.number().positive().optional(),
  urea: z.coerce.number().positive().optional(),
})

export type AllTests = keyof typeof zFBC._type | keyof typeof zKFT._type
/**
  * Could change this to builder pattern (returning self)
  */

class Plan {

  rules: Rule[] = []
  engine = new Engine()
  result?: EngineResult

  addRule(rule: Rule | Rule[]) {
    if (Array.isArray(rule)) {
      this.rules.concat(rule)
    } else {
      this.rules.push(rule)
    }
  }

  async run() {
    this.result = await this.engine.run(this.rules)
  }
}
