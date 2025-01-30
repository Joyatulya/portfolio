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
 */

import { Almanac, Engine, Rule } from "json-rules-engine"
import type { AllTests } from ".."
import { ruleIsAnaemic } from "../rules/fbc"

const dictionaryLevel1 : Record<AllTests, Rule> = {
  hb: [ruleIsAnaemic, ruleIsPolycythaemic]
}

export class InteractiveEngine {
  myAlmanac = new Almanac()
  engine = new Engine()

  run(){

  }
}
