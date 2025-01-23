/* 
 
 I am making this too complicated, first try to implement the simplest of models & then see.

 * Different variables to consider
  - Insulin regimen
  - Insulin doses
  - Current Hba1c / glycemic control
  - number of hypos
  - patient factors - age, height, weight, decent (which will be south asian for all intents.)
  - Medications which they are already taking, because there is no point changing insulin if on suboptimal therapy.
  - Personal targets, hyper & hypo ranges.

Features
  -	This could be a central area from which you can even show doctors in india how your glycemic control has been.
  - When they pick to add something, if it is around lunch, it will ask about carb & amount of insulin you are using apart from BM. Essentially it will be smart in this sense.
  - Just like garmin, the app has different states in which it functions.
    There can be a monitoring phase in which it has made a change & now is just observing. It will just see how your sugar is. It can then switch to a reccomendation phase in which it believes that you should make a change to your regimen because you are not meeting targets. It can then maintaience phase(could be named better), in which you are in targets & maintaining that. You should continue on the same regimen.
  */

import { App_Status, ComparisonOutcome, Current_User_Status, enumBMType, Temporal_User_Status, type BM, type InsulinChange, type IPATIENT, type IRAW_PATIENT, type PARSED_BM, type TBasalInsulin, type Tbm_aggergation, type TMealAggregation, type TNPH_BD_Insulin, type TRecommendation, type TTopAggregation } from "./insulinAnalysis.types";




// Helper Functions
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const groupBy = function (xs: any[], key: string) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export function convert_mean_bm_to_hba1c(mean_bm: number): number {
  return Math.round((mean_bm + 46.7) / 28.7 * 10) / 10
}

function getStandardDeviation(array: number[]): number {
  if (!array || array.length === 0) { return 0; }
  const n = array.length
  const mean = array.reduce((a, b) => a + b) / n
  return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

function between(num: number, min: number, max: number): boolean {
  return num >= min && num <= max
}

export function advanced_between(num: number, min: number, max: number): ComparisonOutcome {
  if (min > num) return ComparisonOutcome.LOW
  if (max < num) return ComparisonOutcome.HIGH
  return ComparisonOutcome.BETWEEN
}


export function parse_bm(data: BM[]): PARSED_BM[] {
  return data.map(x => {
    return {
      ...x,
      date: new Date(x.date),
      type: x.type as enumBMType
    }
  })
}


export abstract class InsulinAnalysis {

  HYPER_BM: number = 180
  HYPO_BM: number = 70
  NIGHT: [number, number] = [22, 6]
  // abstract USER_STATUS : TRecommendation['user_status']

  PATIENT: IRAW_PATIENT

  constructor(patient: IRAW_PATIENT) {
    this.PATIENT = patient
  }

  abstract recommendation(data: PARSED_BM[]): TRecommendation
  // abstract temporal_sugar_status(data: TTopAggregation): { current_user_status: Current_User_Status, temporal_user_status: Temporal_User_Status }

  is_hyper = (data: PARSED_BM): boolean => {
    return data.value >= this.HYPER_BM
  }

  is_hypo = (data: PARSED_BM): boolean => {
    return data.value <= this.HYPO_BM
  }

  is_fasting = (data: PARSED_BM): boolean => {
    return data.type === enumBMType.FASTING
  }

  filter_hypers = (data: PARSED_BM[]): PARSED_BM[] => {
    return data.filter(this.is_hyper)
  }

  filter_hypos = (data: PARSED_BM[]): PARSED_BM[] => {
    return data
      .filter(this.is_hypo)
      .sort((a, b) => a.value - b.value)
  }




  static bm_aggregation(data: PARSED_BM[]): TMealAggregation {
    /**
     * https://www.straighthealthcare.com/insulin-dosing.html#adjust-basal
     */

    // @ts-ignore
    const result = {} as TMealAggregation
    const grouping = { ...groupBy(data, 'type'), all: data } as Record<string, PARSED_BM[]>

    for (let [key, value] of Object.entries(grouping)) {
      let final = {} as Tbm_aggergation
      final['readings'] = value
      let mean_bm = value.reduce((a, c) => a + c.value, 0) / value.length
      final['mean'] = Math.round(mean_bm)
      final['num_days'] = (new Set(value.map(x => x.date))).size
      // @ts-ignore
      result[key] = final
    }

    return result
  }

  /**
   * Aggregation
   *	- All
   *	- 7-3 days
   *	- < 3 days 
   *		- all
   *		- fasting
   *		- etc	
   *			- readings
   *			- mean
   *
   */
  static calculate_averages(data: PARSED_BM[]): TTopAggregation {
    const aggregation = InsulinAnalysis.filter_data_on_days(data)
    let final = {} as TTopAggregation
    for (let [key, value] of Object.entries(aggregation)) {
      // @ts-ignore
      final[key] = InsulinAnalysis.bm_aggregation(value)  //!TS
    }
    return final
  }

  static filter_data_on_days(data: PARSED_BM[], start_day: number = 3, end_day: number = 7) {
    const now = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(now.getDate() + 1)
    const start_date = new Date()
    start_date.setDate(now.getDate() - start_day)
    const end_date = new Date()
    end_date.setDate(now.getDate() - end_day)
    let aggregation: Record<string, PARSED_BM[]> = { all: [], until_start_day: [], start_day_to_end_day: [] }
    for (let x of data) {
      aggregation['all'].push(x)
      if (x.date < end_date) continue
      if (end_date < x.date && x.date < start_date) aggregation['start_day_to_end_day'].push(x)
      if (start_date < x.date && x.date < tomorrow) aggregation['until_start_day'].push(x)
    }
    return aggregation
  }

}

export class Basal_Regimen extends InsulinAnalysis {
  /**
   * https://www.straighthealthcare.com/insulin-dosing.html#insulin-therapy
   */
  static HIGH_BM_CORRECTION_FACTOR: number = 0.1
  static LOW_BM_CORRECTION_FACTOR: number = 0.15

  constructor(patient: IRAW_PATIENT) {
    super(patient)
    if (!patient || patient.insulinRegimen.type !== 'basal') {
      throw new Error(`${patient.insulinRegimen.type} Data given to wrong Basal OD Regimen`)
    }
    this.PATIENT = patient
  }

  temporal_sugar_status(data: TTopAggregation) {
    const { until_start_day, start_day_to_end_day } = data
    const { all: { mean: recent_all_mean }, fasting: { mean: recent_fasting_mean } } = until_start_day
    const { all: { mean: penultimate_all_mean, readings: penultimate_all_readings }, fasting: { mean: penultimate_fasting_mean } } = start_day_to_end_day

    const delta_all = recent_all_mean - penultimate_all_mean
    // const delta_all_percent = Math.round(delta_all / penultimate_all_mean * 100) / 100
    const penultimate_all_sd = getStandardDeviation(penultimate_all_readings.map(x => x.value))
    const num_std_change = delta_all / penultimate_all_sd
    const is_signifcant_change = Math.abs(num_std_change) > 1

    const delta_fasting = recent_fasting_mean - penultimate_fasting_mean
    const delta_fasting_percent = Math.round(delta_fasting / penultimate_fasting_mean * 100) / 100

    let temporal_status: Temporal_User_Status = Temporal_User_Status.MAINTAINING
    let current_status: Current_User_Status
    const bm_comparison = advanced_between(recent_fasting_mean, ...this.PATIENT.fasting_targets)

    switch (bm_comparison) {
      case ComparisonOutcome.LOW:
        current_status = Current_User_Status.HYPO
        if (!is_signifcant_change) break
        temporal_status = delta_fasting > 0 ? Temporal_User_Status.IMPROVING : Temporal_User_Status.WORSENING
        break

      case ComparisonOutcome.BETWEEN:
        //BUG: Could be a potential Bug if patient straying away from mean
        current_status = Current_User_Status.IN_RANGE
        if (!is_signifcant_change) break
        temporal_status = is_signifcant_change ? Temporal_User_Status.IMPROVING : Temporal_User_Status.MAINTAINING
        break

      case ComparisonOutcome.HIGH:
        current_status = Current_User_Status.HYPER
        if (!is_signifcant_change) break
        temporal_status = delta_fasting < 0 ? Temporal_User_Status.IMPROVING : Temporal_User_Status.WORSENING
        break
    }
    return { current_status, temporal_status, delta: delta_fasting_percent }
  }

  /**
   * For this, I need Insulin Data, If dose was changed recently and current
   * user status & temporal status are required as well
   *
   * @param num_readings number - This will depend on the total readings I have,
   * & is dependent on insulin as well
  */
  calc_app_status(current_user_status: Current_User_Status, temporal_user_status: Temporal_User_Status, num_readings: number): App_Status {
    // let app_status: App_Status

    const recent_change = num_readings < 3
    if (recent_change) App_Status.MONITORING

    const user_stable = current_user_status === Current_User_Status.IN_RANGE && temporal_user_status === (Temporal_User_Status.MAINTAINING || Temporal_User_Status.IMPROVING)
    if (user_stable) return App_Status.MAINTEANACE

    // TODO: For extra options to the patient
    const user_out_range_but_improving = current_user_status !== Current_User_Status.IN_RANGE && temporal_user_status === Temporal_User_Status.IMPROVING
    if (user_out_range_but_improving) return App_Status.RECOMMENDATION

    const user_out_of_range = current_user_status !== Current_User_Status.IN_RANGE && temporal_user_status === (Temporal_User_Status.MAINTAINING || Temporal_User_Status.WORSENING)
    if (user_out_of_range) return App_Status.RECOMMENDATION

    return App_Status.MONITORING
  }

  //FIX: Make it robust
  recommendation(data: PARSED_BM[]): TRecommendation {
    let insulin_dose_change = 0

    const insulin_change: InsulinChange<TBasalInsulin> = { old_regimen: { ...this.PATIENT.insulinRegimen }, new_regimen: { ...this.PATIENT.insulinRegimen } }
    const old_insulin_dose = this.PATIENT.insulinRegimen.basal_dose
    let new_insulin_dose = old_insulin_dose
    const aggregation = InsulinAnalysis.calculate_averages(data)
    const user_status = this.temporal_sugar_status(aggregation)
    // const app_status = this.calc_app_status(user_status.current_status, user_status.temporal_status, aggregation.until_start_day.fasting.num_days)
    let app_status = App_Status.MONITORING


    const bm_comparison = advanced_between(aggregation.until_start_day.fasting.mean, ...this.PATIENT.fasting_targets)
    switch (bm_comparison) {

      case ComparisonOutcome.LOW: //Hypoglycaemia
        insulin_change.type = 'subtract'
        app_status = App_Status.RECOMMENDATION
        insulin_dose_change = - (Basal_Regimen.LOW_BM_CORRECTION_FACTOR * old_insulin_dose)
        const is_insulin_change_negative = insulin_dose_change < 0
        if (!is_insulin_change_negative) throw new Error('Major Error in Basal Insulin, Dose Increased in hyperglycaemia')
        break

      case ComparisonOutcome.HIGH:
        insulin_change.type = 'add'
        app_status = App_Status.RECOMMENDATION
        insulin_dose_change = Basal_Regimen.HIGH_BM_CORRECTION_FACTOR * old_insulin_dose
        break
    }

    // Being extra careful & playing it safe from hypoglycaemia perspective
    new_insulin_dose = Math.floor(new_insulin_dose + insulin_dose_change)
    insulin_change.new_regimen.basal_dose = new_insulin_dose
    console.warn("DEBUGPRINT[62]: insulinAnalysis.ts:306: insulin_change=", insulin_change)

    return { app_status, current_user_status: user_status.current_status, temporal_user_status: { status: user_status.temporal_status, delta: user_status.delta }, insulin_change }
    // return { previous_insulin_dose: this.basal_dose, insulin_dose_change, new_insulin_dose }
  }
}

export class Basal_Bolus_Regimen extends InsulinAnalysis {

  patient_insulin_dose: TBasal_Bolus_Regimen
  PRE_MEAL_BM_RANGE = [100, 119]

  static mealInsulinAdjustmentTable: TAdjustment_Table = [
    { min: 180, max: Infinity, adjustment: 3 },
    { min: 160, max: 179, adjustment: 2 },
    { min: 140, max: 159, adjustment: 2 },
    { min: 120, max: 139, adjustment: 1 },
    { min: 80, max: 99, adjustment: -1 },
    { min: 60, max: 79, adjustment: -2 },
    { min: -Infinity, max: 59, adjustment: -4 }, // less than 60
  ];

  static fastingInsulinAdjustmentTable: TAdjustment_Table = [
    { min: 180, max: Infinity, adjustment: 8 },
    { min: 160, max: 179, adjustment: 6 },
    { min: 140, max: 159, adjustment: 4 },
    { min: 120, max: 139, adjustment: 2 },
    { min: 100, max: 119, adjustment: 1 },
    { min: 80, max: 99, adjustment: 0 },
    { min: 60, max: 79, adjustment: -2 },
    { min: -Infinity, max: 59, adjustment: -4 },
  ];

  constructor(patient: IRAW_PATIENT) {
    super(patient)
    this.patient_insulin_dose = patient_insulin_dose
  }

  static calc_insulin_adjustment(mean: number, type: 'FASTING' | 'MEAL') {
    const table = type === 'FASTING' ? Basal_Bolus_Regimen.fastingInsulinAdjustmentTable : Basal_Bolus_Regimen.mealInsulinAdjustmentTable
    return table.filter(x => between(mean, x.min, x.max))[0].adjustment
  }

  recommendation(data: PARSED_BM[]) {
    const { night, pre_dinner, pre_lunch, fasting } = this.calculate_averages(data, 3)
    const insulin_adjustments: TBasal_Bolus_Regimen = { breakfast: 0, lunch: 0, dinner: 0, basal: 0 }
    if (!between(night.mean_bm, ...this.PRE_MEAL_BM_RANGE)) {
      insulin_adjustments.dinner = Basal_Bolus_Regimen.calc_insulin_adjustment(night.mean_bm, 'MEAL')
    }
    if (!between(pre_lunch.mean_bm, ...this.PRE_MEAL_BM_RANGE)) {
      insulin_adjustments.breakfast = Basal_Bolus_Regimen.calc_insulin_adjustment(pre_lunch.mean_bm, 'MEAL')
    }
    if (!between(pre_dinner.mean_bm, ...this.PRE_MEAL_BM_RANGE)) {
      insulin_adjustments.lunch = Basal_Bolus_Regimen.calc_insulin_adjustment(pre_dinner.mean_bm, 'MEAL')
    }
    if (!between(fasting.mean_bm, ...this.PRE_MEAL_BM_RANGE)) {
      insulin_adjustments.basal = Basal_Bolus_Regimen.calc_insulin_adjustment(fasting.mean_bm, 'FASTING')
    }
    console.log(insulin_adjustments)
    return insulin_adjustments
  }

  correctional_insulin_dose(pre_meal_bm: number): number {
    const comparison = advanced_between(pre_meal_bm, ...this.PRE_MEAL_BM_RANGE)
    if (comparison === ComparisonOutcome.BETWEEN) return 0
    if (comparison === ComparisonOutcome.LOW) {
      throw new Error('Needs less insulin, DANGER CLOSE, Implement this')
    }
    const difference = pre_meal_bm - this.PRE_MEAL_BM_RANGE[1]
    const correction_factor = this.correction_factor_rapid_insulin()
    return Math.floor(difference / correction_factor)
  }

  correction_factor_rapid_insulin() {
    const total_insulin = Object.values(this.PATIENT.insulinRegimen).reduce((a, c) => a + c, 0)
    return 1800 / total_insulin
  }
  correction_factor_regular_insulin() {
    const total_insulin = Object.values(this.patient_insulin_dose).reduce((a, c) => a + c, 0)
    return 1500 / total_insulin
  }
}


export class NPH_BD_Regimen extends InsulinAnalysis {
  /**
   * https://www.straighthealthcare.com/insulin-dosing.html - Dosing
   * algorithm
   * https://www.straighthealthcare.com/insulin-dosing.html#nph-dosing
   *
   * Adjustments
   * - Can be made every 3 days
  */

  constructor(patient: Omit<IPATIENT, 'insulin_analyser'>) {
    super(patient)
  }

  static fasting_ranges: { min: number; max: number; range: number }[] = [
    { min: 160, max: Infinity, range: 3 },
    { min: 101, max: 160, range: 2 },
    { min: -Infinity, max: 100, range: 1 },
  ];

  static pre_dinner_ranges: { min: number; max: number; range: number }[] = [
    { min: 161, max: Infinity, range: 3 },
    { min: 131, max: 160, range: 2 },
    { min: -Infinity, max: 130, range: 1 },
  ];

  static adjustmentTable: { min: number; max: number; adjustment: number }[] = [
    { min: 180, max: Infinity, adjustment: 8 },
    { min: 160, max: 179, adjustment: 6 },
    { min: 140, max: 159, adjustment: 4 },
    { min: 120, max: 139, adjustment: 2 },
    { min: 100, max: 119, adjustment: 1 },
    { min: 80, max: 99, adjustment: 0 },
    { min: 60, max: 79, adjustment: -2 },
    { min: -Infinity, max: 59, adjustment: -4 },
  ];

  static dose_distribution_table: { fasting_range: number, pre_dinner_range: number, adjustment: { morning: number, bedtime: number } }[] = [
    { fasting_range: 1, pre_dinner_range: 1, adjustment: { morning: 0, bedtime: 0 } },
    { fasting_range: 1, pre_dinner_range: 2, adjustment: { morning: 1, bedtime: 0 } },
    { fasting_range: 1, pre_dinner_range: 3, adjustment: { morning: 1, bedtime: 0 } },
    { fasting_range: 2, pre_dinner_range: 3, adjustment: { morning: 0.67, bedtime: 0.33 } },
    { fasting_range: 2, pre_dinner_range: 2, adjustment: { morning: 0.5, bedtime: 0.5 } },
    { fasting_range: 3, pre_dinner_range: 3, adjustment: { morning: 0.5, bedtime: 0.5 } },
    { fasting_range: 3, pre_dinner_range: 2, adjustment: { morning: 0.67, bedtime: 0.33 } },
    { fasting_range: 2, pre_dinner_range: 1, adjustment: { morning: 0, bedtime: 1 } },
    { fasting_range: 3, pre_dinner_range: 1, adjustment: { morning: 0, bedtime: 1 } },
  ]

  insulin_adjustment(aggregate_data: TTopAggregation, old_regimen: TNPH_BD_Insulin): InsulinChange<TNPH_BD_Insulin> | { insulin_adjustment: number, app_status: App_Status } {
    let total_insulin_adjustment: number = 0
    let morning_insulin_adjustment: number = 0
    let bedtime_insulin_adjustment: number = 0
    let app_status: App_Status
    const { all, until_start_day, start_day_to_end_day } = aggregate_data
    let adjustment_type: InsulinChange<TNPH_BD_Regimen>['type']
    let new_regimen = { ...old_regimen }
    const recent_fasting_mean = until_start_day.fasting.mean
    const recent_pre_dinner_mean = until_start_day.pre_dinner.mean

    //Ranges calculation
    const pre_dinner_range = this.calc_adjutment_range(recent_pre_dinner_mean, NPH_BD_Regimen.pre_dinner_ranges)
    const fasting_range = this.calc_adjutment_range(recent_fasting_mean, NPH_BD_Regimen.fasting_ranges)

    // Insulin Dose calculations
    // They are saying to calculate the mean of all (fasting & pre-dinner)
    // readings, but I have just done that for all. Is that okay?
    // BUG:
    total_insulin_adjustment = this.calc_insulin_adjustment(all.all.mean)

    //Check if we have to reduce insulin
    //BUG: Have to make this more robust
    if (total_insulin_adjustment < 0) {
      adjustment_type = 'subtract'
      const minimum = Math.min(recent_fasting_mean, recent_pre_dinner_mean)
      if (minimum === recent_fasting_mean) {
        morning_insulin_adjustment = total_insulin_adjustment
      } else {
        bedtime_insulin_adjustment = total_insulin_adjustment
      }
    } else {
      adjustment_type = 'add'
      const { morning, bedtime } = this.calc_dose_range(fasting_range, pre_dinner_range)
      morning_insulin_adjustment = Math.round(morning * total_insulin_adjustment)
      bedtime_insulin_adjustment = Math.round(bedtime * total_insulin_adjustment)
    }

    new_regimen.basal_am_dose += morning_insulin_adjustment
    new_regimen.basal_pm_dose += bedtime_insulin_adjustment

    app_status = morning_insulin_adjustment !== 0 || bedtime_insulin_adjustment !== 0 ? App_Status.RECOMMENDATION : App_Status.MONITORING

    return { type: adjustment_type, old_regimen, new_regimen, insulin_adjustment: total_insulin_adjustment, app_status }
  }

  temporal_sugar_status(data: TTopAggregation, insulin_adjustment: number): Pick<TRecommendation, 'temporal_user_status' | 'current_user_status'> {
    let current_status: Current_User_Status
    if (insulin_adjustment > 0) current_status = Current_User_Status.HYPER
    else if (insulin_adjustment < 0) current_status = Current_User_Status.HYPO
    else current_status = Current_User_Status.IN_RANGE

    const { until_start_day: { all: recent_all }, start_day_to_end_day: { all: penultimate_all } } = data
    const delta = recent_all.mean - penultimate_all.mean
    const delta_percent = Math.round(delta / penultimate_all.mean * 100) / 100

    const penultimate_all_sd = getStandardDeviation(penultimate_all.readings.map(x => x.value))
    const num_std_change = delta / penultimate_all_sd
    const is_signifcant_change = Math.abs(num_std_change) > 1

    let temporal_status: Temporal_User_Status = Temporal_User_Status.MAINTAINING

    switch (true) {

      case current_status === Current_User_Status.IN_RANGE && !is_signifcant_change:
        temporal_status = Temporal_User_Status.MAINTAINING
        break

      case current_status !== Current_User_Status.IN_RANGE && !is_signifcant_change:
        temporal_status = Temporal_User_Status.WORSENING
        break

      case is_signifcant_change && current_status === Current_User_Status.HYPER && delta > 0:
        temporal_status = Temporal_User_Status.WORSENING
        break

      case is_signifcant_change && current_status === Current_User_Status.HYPER && delta < 0:
        temporal_status = Temporal_User_Status.IMPROVING
        break

      case is_signifcant_change && current_status === Current_User_Status.HYPO && delta < 0:
        temporal_status = Temporal_User_Status.WORSENING
        break

      case is_signifcant_change && current_status === Current_User_Status.HYPO && delta > 0:
        temporal_status = Temporal_User_Status.IMPROVING
        break
    }

    return { current_user_status: current_status, temporal_user_status: { status: temporal_status, delta: delta_percent } }
  }

  recommendation(data: PARSED_BM[]) {

    const aggregate_data = NPH_BD_Regimen.calculate_averages(data)
    const { insulin_adjustment, app_status, ...insulin_change } = this.insulin_adjustment(aggregate_data, this.PATIENT.insulinRegimen)
    const user_current_temporal_status = this.temporal_sugar_status(aggregate_data, insulin_adjustment)
    return { ...user_current_temporal_status, app_status, insulin_change }

  }

  calc_insulin_adjustment(mean: number) {
    return NPH_BD_Regimen.adjustmentTable.filter(x => between(mean, x.min, x.max))[0].adjustment
  }
  calc_adjutment_range(mean: number, table: typeof NPH_BD_Regimen.fasting_ranges) {
    return table.filter(x => between(mean, x.min, x.max))[0].range
  }

  calc_dose_range(fasting_range: number, pre_dinner_range: number) {
    return NPH_BD_Regimen.dose_distribution_table.filter(x => x.fasting_range === fasting_range && x.pre_dinner_range === pre_dinner_range)[0].adjustment
  }
}



export const basal_insulins = [
  'NPH / Humulin® N / Novolin® N',
  'Basaglar® (insulin glargine)',
  'Lantus® (insulin glargine)',
  'Rezvoglar® (insulin glargine)',
  'Semglee® (insulin glargine)',
  'Toujeo® (insulin glargine)',
  'Levemir® (insulin detemir)',
  'Tresiba® (insulin degludec)',
  // 'Insulin glargine / Basaglar® / Lantus® / Rezvoglar® / Semglee® / Toujeo®',
  // 'Insulin detemir / Levemir® ',
  // 'Insulin degludec / Tresiba®',
] as const


export const rapid_insulins = [
  'Admelog® (insulin lispro)',
  'Afrezza® (inhaled insulin)',
  'Apidra® (insulin glulisine)',
  'Fiasp® (insulin aspart)',
  'Humalog® (insulin lispro)',
  'Lyumjev® (insulin lispro-aabc)',
  'Novolog® (insulin aspart)',
] as const

export const short_insulins = [
  'Humulin® R(regular)',
  'Novolin® R(regular)',
] as const


export function insulinRegimenFactory(user: Omit<IPATIENT, 'insulin_anayser'>) {
  const regimens = { 'basal': Basal_Regimen, 'nph_bd': NPH_BD_Regimen, 'basal_bolus': Basal_Bolus_Regimen }
  const regimen = regimens[user.insulinRegimen.type]
  return new regimen(user)
}
