import type { Basal_Bolus_Regimen, basal_insulins, Basal_Regimen, rapid_insulins, short_insulins } from "./insulinAnalysis"

export enum enumBMType {
  FASTING = 'fasting',
  PRE_LUNCH = 'pre_lunch',
  PRE_DINNER = 'pre_dinner',
  NIGHT = 'night',
}

export type BM = {
  date: string,
  value: number,
  type: string
}

export type PARSED_BM = Omit<BM, 'date' | 'type'> & { date: Date, type: enumBMType }


export interface IRAW_PATIENT {
  age: number,
  height: number,
  weight: number,
  isMale: boolean,
  hba1c: number,
  insulinRegimen: TBasalInsulin | TNPH_BD_Insulin | TBasalBolusInsulin,
  units?: 'metric' | 'imperial',
  fasting_targets: [number, number]
}
type NewType = typeof NPH_BD_Regimen

export type IPATIENT = IRAW_PATIENT & {
  insulin_analyser: InstanceType<typeof Basal_Regimen | typeof NPH_BD_Regimen | typeof Basal_Bolus_Regimen>,
}

export enum ComparisonOutcome {
  LOW,
  BETWEEN,
  HIGH,
}
export type TRecommendation = {
  app_status: App_Status
  current_user_status: Current_User_Status,
  temporal_user_status: { status: Temporal_User_Status, delta: number },
  insulin_change: InsulinChange<TBasalBolusInsulin | TBasalInsulin | TNPH_BD_Insulin>,
}

export type InsulinChange<T extends TBasalBolusInsulin | TBasalInsulin | TNPH_BD_Insulin> = {
  type: 'add' | 'subtract',
  old_regimen: T
  new_regimen: T
}
export interface TBasalInsulin {
  type: 'basal',
  basal_time: string,
  basal_dose: number,
  basal_insulin: typeof basal_insulins[number]
}

export interface TNPH_BD_Insulin {
  type: 'nph_bd'
  basal_am_time: string,
  basal_am_dose: number,
  basal_pm_time: string,
  basal_pm_dose: number,
  basal_insulin: typeof basal_insulins[0]
}

export interface TBolusInsulin {
  type: 'basal_bolus',
  bolus_insulin: typeof rapid_insulins[number] | typeof short_insulins[number],
  bolus_lunch_time: string,
  bolus_lunch_dose: number,
  bolus_dinner_time: string,
  bolus_dinner_dose: number,
  bolus_night_time: string,
  bolus_night_dose: number
}

export type TBasalBolusInsulin = TBasalInsulin & TBolusInsulin


export type TBasal_Bolus_Regimen = {
  breakfast?: number
  lunch?: number
  dinner?: number
  basal: number
}

export type TAdjustment_Table = { min: number; max: number; adjustment: number }[]

export type Tbm_aggergation = { readings: PARSED_BM[], mean: number, num_days: number }
type TMealAggregation = Record<`${enumBMType}` | 'all', Tbm_aggergation>
export type TTopAggregation = Record<'all' | 'until_start_day' | 'start_day_to_end_day', TMealAggregation>


export enum Temporal_User_Status {
  MAINTAINING = 'Maintaining',
  IMPROVING = 'Improving',
  WORSENING = 'Worsening'
}

export enum App_Status {
  MONITORING = 'Monitoring',
  MAINTEANACE = 'Maintenance',
  RECOMMENDATION = 'Recommendation',
}

export enum Current_User_Status {
  IN_RANGE = 'In Range',
  HYPER = 'High Sugar Levels',
  HYPO = 'Low Sugar Levels'
}
