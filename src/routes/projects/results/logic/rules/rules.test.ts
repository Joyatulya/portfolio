import { Engine } from "json-rules-engine";
import { describe, expect, it } from "vitest";
import { ruleIsAnaemic, ruleIsMacrocyticAnaemia, ruleIsMicrocyticAnaemia } from "./fbc";

describe('FBC Family of tests', () => {
  // it('Anaemic when hb low', async () => {
  //   const facts = { hb: 100, isMale: true }
  //   const engine = new Engine()
  //   engine.addRule(ruleIsAnaemic)
  //   const results = await engine.run(facts)
  //   const result = await results.almanac.factValue('isAnaemic')
  //   expect(result).toBeTruthy()
  // })
  //
  // it('Female not Anaemic when hb between ranges', async () => {
  //   const facts = { hb: 121, isMale: false }
  //   const engine = new Engine()
  //   engine.addRule(ruleIsAnaemic)
  //   const results = await engine.run(facts)
  //   const result = await results.almanac.factValue('isAnaemic')
  //   expect(result).toBeFalsy()
  // })
  //
  //
  // it('Microcytic Anaemia', async () => {
  //   const facts = { hb: 100, isMale: false, mcv: 70 }
  //   const engine = new Engine()
  //   engine.addRule(ruleIsAnaemic)
  //   engine.addRule(ruleIsMicrocyticAnaemia)
  //   const results = await engine.run(facts)
  //   const isAnaemic = await results.almanac.factValue('isAnaemic')
  //   const isMicrocytic = await results.almanac.factValue('isMicrocyticAnaemia')
  //   expect(isAnaemic).toBeTruthy()
  //   expect(isMicrocytic).toBeTruthy()
  // })
  //


  it('Macrocytic Anaemia', async () => {
    const facts = { hb: 10, isMale: false, mcv: 110, plt: undefined }
    const engine = new Engine()
    engine.addRule(ruleIsAnaemic)
    engine.addRule(ruleIsMacrocyticAnaemia)
    const results = await engine.run(facts)
    console.warn("DEBUGPRINT[91]: rules.test.ts:44: results=", results)
    const isAnaemic = await results.almanac.factValue('isAnaemic')
    const isMacrocytic = await results.almanac.factValue('isMacrocyticAnaemia')
    expect(isAnaemic).toBeTruthy()
    expect(isMacrocytic).toBeTruthy()
  })

})
