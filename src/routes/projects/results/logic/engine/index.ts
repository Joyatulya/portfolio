/**
 * 
 * Things could be different when using level 1 assertions. I might still be
 * asking questions.
 *
 * Based off of the different level 1 analysis, they could have an array
 * attached to them which could essentially be pointing towards the next things
 * to do. I don't know about this data structure, what it will be called. I have
 * to make it as homogenous as possible.
 *
 * The initial Idea that came tO my mind was a list with all the level 1 rules,
 * which run in parallel, and then go to the next level. Next level questions
 * are defined by another data structure which depends on the level 1 questions.
 * Essentially it keeps on adding rules to a list based off of if something
 * passed or not. Also the initial list (level 1) can be made based off of how
 * many different parameters are being provided.
 *
 * Ex - If I have hb & plt, and nothing else, then we our level 1 list will be
 * small, & because that is small, our level 2 list will be smaller.
 *
 * Compound conditions are best left to later levels of inference, that means
 * saying if it is anaemia is technically level 2, but might have to think about
 * it.
 *
 * The datastructure that we are talking about might be a graph, can't say for
 * sure.
 *
 * The reason I am using the rules engine is for separation of concerns, isn't
 * it? It is so that I can define all of these right where the rules are being
 * made. SO that I can point towards the next node from the decision itself.
 *
 * If I want to reduce the complexity, I would have to come up with a wayt to
 * check if within range or not & on which side of the equation it is.
 * Essentially a kind of ternary thing, which can be used for our level 1
 * analysis.
 *
 * Easiest way that comes to my mind is to ensure if value is within range or
 * not. Based off of that, we can run the result function which can further
 * segregate the stuff.
 *
 * I have to make sure I define & stick with what does a failure event mean &
 * what does success event mean. No wrong answer here, what do I want. If I find
 * an abnormality, or anything that needs to take further action, that will have
 * a priority to go into the success event side of things. Don'h have to make
 * the decision now, roam around, think about it, but make this decision so as
 * to app remains more cohesive.
 *
 * I could make an analysis outcome object which can tell us about each param.
 * Like {
 *    param : 'hb',
 *    type : 'high',
 *    severity : 'moderate',
 *    value : 180
 * }
 *
 * the interactive run could go through the initial list created one by one
 * (loop) & based off of the outcome, ask questions or keep on moving forward.
 * The level 2 list will be made through similar way but the next nodes will be
 * added through the onSuccess & onFailure functions.
 * Lets try a small example & see how it goes.
 *
 * ## Types of parameters
 *
 * Some paramters are of type range, both high & low matter and in others only
 * one side of the equation matters.
 *
 * Range Params = hb, wbc, plt, neut, mcv, prot, glob, all electrolytes
 * Single side params = bili, ast, alt, alp, ggt, alb, creat, urea
 * 
 */

import { Almanac, Engine, Rule, type EngineResult, } from "json-rules-engine"
import { z, ZodSchema } from "zod"
import { operators } from "../operator";
import { zInferenceValues, type InferenceValues } from "../types";
import { levelOneRules } from "../rules";


export class InteractiveEngine {
  private engine: Engine
  private almanac: Almanac = new Almanac();

  constructor() {
    this.engineSetup();
  }

  private engineSetup() {
    this.engine = new Engine([], { replaceFactsInEventParams: true });
    this.engine.addOperator("inRange", operators.inRangeOperator);
    this.addFact('mainArray', [])
  }

  public async initialize(values: unknown): Promise<void> { // Using unknown and validating
    const { success, data: validatedValues, error } = this.validateValues(values);
    if (!success) {
      // console.warn("Error parsing init values =", error);
      throw new Error("Invalid input values"); // Or handle differently
    }

    // Add validated values as facts
    for (const key in validatedValues) {
      if (validatedValues.hasOwnProperty(key)) {
        this.almanac.addFact(key, validatedValues[key]);
      }
    }

    // Dynamically add rules based on provided values
    const rulesToAdd = this.getRulesForInput(validatedValues);
    rulesToAdd.forEach(rule => this.engine.addRule(rule));
  }

  async run() {

    let result: EngineResult
    let i = 0
    debugger
    while (true) {
      result = await this.engine.run(undefined, { almanac: this.almanac })
      let newRules: Rule[] = await this.almanac.factValue('mainArray')

      console.warn("DEBUGPRINT[22]: index.ts:126: newRules=", newRules.map(x => x.name))
      if (newRules.length < 1) break

      this.engineSetup()
      newRules.forEach(rule => {
        this.engine.addRule(rule)
      });

      i++
    }
    console.warn("DEBUGPRINT[23]: index.ts:134: result=", result)
    return result
  }

  private getRulesForInput(values: InferenceValues): Rule[] {
    let arr: Rule[] = []
    Object.keys(values).forEach(test => {
      const rules = levelOneRules[test] as Rule[] | undefined
      if (rules) arr = [...arr, ...rules]
    })
    return arr
  }


  public addFact(key: string, fact: any): void {
    this.almanac.addFact(key, fact);
  }

  public async getFact(key: string): Promise<any> {
    return this.almanac.factValue(key);
  }

  private validateValues(values: unknown) {
    return zInferenceValues.safeParse(values);
  }

  get mainArray() {
    return this.getFact('mainArray')
  }

  async interrogateAlmanac() {
  }
}
