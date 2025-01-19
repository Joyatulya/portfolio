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

Types on measurements
- breakfast, lunch, dinner (before & after above)
- basal am, basal pm
- random , fasting
Features
	-	This could be a central area from which you can even show doctors in india how your glycemic control has been.
	- When they pick to add something, if it is around lunch, it will ask about carb & amount of insulin you are using apart from BM. Essentially it will be smart in this sense.
	*/

import type { number } from "echarts/core"
import type { number } from "echarts/types/src/echarts.all.js"

export function convert_mean_bm_to_hba1c(mean_bm: number): number {
	return Math.round((mean_bm + 46.7) / 28.7 * 10) / 10
}

type Tbm_aggergation = ReturnType<InsulinAnalysis['bm_aggregation']>

class InsulinAnalysis {

	HYPER_BM: number = 180
	FASTING: [number, number] = [80, 99]
	HYPO_BM: number = 70
	PATIENT: PATIENT = {
		age: 50,
		height: 160,
		weight: 60,
		hba1c: 6.5,
		isMale: true
	}
	NIGHT: [number, number] = [22, 6]


	is_hyper = (data: PARSED_BM): boolean => {
		return data.value >= this.HYPER_BM
	}

	is_hypo = (data: PARSED_BM): boolean => {
		return data.value <= this.HYPO_BM
	}

	is_fasting = (data: PARSED_BM): boolean => {
		return data.type === bmType.FASTING
	}

	filter_hypers = (data: PARSED_BM[]): PARSED_BM[] => {
		return data.filter(this.is_hyper)
	}

	filter_hypos = (data: PARSED_BM[]): PARSED_BM[] => {
		return data
			.filter(this.is_hypo)
			.sort((a, b) => a.value - b.value)
	}

	bm_aggregation(data: PARSED_BM[], reading_type: bmType | undefined, days: number = 4, check_reading_num = true) {
		/**
		 * https://www.straighthealthcare.com/insulin-dosing.html#adjust-basal
		 */

		const specified_days = InsulinAnalysis.filter_data_on_days(data, days)
		const specifid_bms_specific_days = reading_type ? specified_days.filter(x => x.type === reading_type) : specified_days

		// ensuring that they are on different days, and we have at least 3 days of
		// readings
		const reading_days = new Set(specifid_bms_specific_days.map(x => x.date))
		if (check_reading_num && reading_days.size <= 2) {
			throw new Error('Not enough readings for ' + reading_type)
		}

		let mean_bm = specifid_bms_specific_days.reduce((a, c) => a + c.value, 0) / specifid_bms_specific_days.length
		mean_bm = Math.round(mean_bm * 10) / 10

		return { readings: specifid_bms_specific_days, mean_bm, num_days: reading_days.size, num_readings: specifid_bms_specific_days.length }
	}


	/** 
	 * Given a list of BMs, returns the hyper and hypo readings. If no days
	 * provided, it returns all readings
	 * */
	analysis(data: BM[], days: number | undefined) {
		const parsed_data = days ? InsulinAnalysis.filter_data_on_days(InsulinAnalysis.parse_bm(data), days) : InsulinAnalysis.parse_bm(data)
		const hypos = this.filter_hypos(parsed_data)
		const hypers = this.filter_hypers(parsed_data)
		const fasting = this.bm_aggregation(parsed_data, bmType.FASTING)
		return { hypos, hypers, fasting }
	}


	calculate_averages(data: BM[], days = 7, validate_readings = false): { fasting: Tbm_aggergation, pre_dinner: Tbm_aggergation, pre_lunch: Tbm_aggergation, night: Tbm_aggergation, all: Tbm_aggergation } {
		const parsed_data = days ? InsulinAnalysis.filter_data_on_days(InsulinAnalysis.parse_bm(data), days) : InsulinAnalysis.parse_bm(data)
		const fasting = this.bm_aggregation(parsed_data, bmType.FASTING, days, validate_readings)
		const pre_dinner = this.bm_aggregation(parsed_data, bmType.PRE_DINNER, days, validate_readings)
		const pre_lunch = this.bm_aggregation(parsed_data, bmType.PRE_LUNCH, days, validate_readings)
		const night = this.bm_aggregation(parsed_data, bmType.NIGHT, days, validate_readings)
		const all = this.bm_aggregation(parsed_data, undefined, days, validate_readings)
		return { fasting, pre_dinner, pre_lunch, night, all }
	}

	// +++++++++++++++++ Static Methods +++++++++++++++++++++++

	static parse_bm(data: BM[]): PARSED_BM[] {
		return data.map(x => {
			return {
				...x,
				date: new Date(x.date),
				type: x.type as bmType
			}
		})
	}

	static filter_data_on_days(data: PARSED_BM[], days = 7) {
		const now = new Date()
		const one_week = new Date()
		one_week.setDate(now.getDate() - days)
		return data.filter(x => x.date >= one_week && x.date <= now)
	}
}

function between(num: number, min: number, max: number): boolean {
	return num >= min && num <= max
}

export function advanced_between(num: number, min: number, max: number): ComparisonOutcome {
	if (min > num) return ComparisonOutcome.LOW
	if (max < num) return ComparisonOutcome.HIGH
	return ComparisonOutcome.BETWEEN
}

export const insulin_analysis = new InsulinAnalysis()

type TBasal_Bolus_Regimen = {
	breakfast?: number
	lunch?: number
	dinner?: number
	basal: number
}

type TAdjustment_Table = { min: number; max: number; adjustment: number }[]
export class Basal_Bolus_T2DM extends InsulinAnalysis {

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
	constructor(patient_insulin_dose: TBasal_Bolus_Regimen) {
		super()
		this.patient_insulin_dose = patient_insulin_dose
	}

	static calc_insulin_adjustment(mean: number, type: 'FASTING' | 'MEAL') {
		const table = type === 'FASTING' ? Basal_Bolus_T2DM.fastingInsulinAdjustmentTable : Basal_Bolus_T2DM.mealInsulinAdjustmentTable
		return table.filter(x => between(mean, x.min, x.max))[0].adjustment
	}
	recommendation(data: BM[]) {
		const { night, pre_dinner, pre_lunch, fasting } = this.calculate_averages(data, 3)
		const insulin_adjustments: TBasal_Bolus_Regimen = { breakfast: 0, lunch: 0, dinner: 0, basal: 0 }
		if (!between(night.mean_bm, ...this.PRE_MEAL_BM_RANGE)) {
			insulin_adjustments.dinner = Basal_Bolus_T2DM.calc_insulin_adjustment(night.mean_bm, 'MEAL')
		}
		if (!between(pre_lunch.mean_bm, ...this.PRE_MEAL_BM_RANGE)) {
			insulin_adjustments.breakfast = Basal_Bolus_T2DM.calc_insulin_adjustment(pre_lunch.mean_bm, 'MEAL')
		}
		if (!between(pre_dinner.mean_bm, ...this.PRE_MEAL_BM_RANGE)) {
			insulin_adjustments.lunch = Basal_Bolus_T2DM.calc_insulin_adjustment(pre_dinner.mean_bm, 'MEAL')
		}
		if (!between(fasting.mean_bm, ...this.PRE_MEAL_BM_RANGE)) {
			insulin_adjustments.basal = Basal_Bolus_T2DM.calc_insulin_adjustment(fasting.mean_bm, 'FASTING')
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
		const total_insulin = Object.values(this.patient_insulin_dose).reduce((a, c) => a + c, 0)
		return 1800 / total_insulin
	}
	correction_factor_regular_insulin() {
		const total_insulin = Object.values(this.patient_insulin_dose).reduce((a, c) => a + c, 0)
		return 1500 / total_insulin
	}
}

class NPH_OD_T2DM extends InsulinAnalysis {
	/**
	 * https://www.straighthealthcare.com/insulin-dosing.html#insulin-therapy
	 */
	patient_insulin_dose: number
	static HIGH_BM_CORRECTION_FACTOR: number = 0.1
	static LOW_BM_CORRECTION_FACTOR: number = 0.15

	constructor(insulin_dose: number) {
		super()
		this.patient_insulin_dose = insulin_dose
	}

	//FIX: Make it robust
	insulin_adjustment(data: BM[]): { previous_insulin_dose: number, insulin_dose_change: number, new_insulin_dose: number } {
		let insulin_dose_change = 0
		let new_insulin_dose = this.patient_insulin_dose

		const parsed_data = InsulinAnalysis.parse_bm(data)
		const { mean_bm: mean_fasting_bm, num_days } = this.bm_aggregation(parsed_data, bmType.FASTING)
		const bm_comparison = advanced_between(mean_fasting_bm, ...this.FASTING)

		if (bm_comparison === ComparisonOutcome.LOW) {
			insulin_dose_change = - (NPH_OD_T2DM.LOW_BM_CORRECTION_FACTOR * this.patient_insulin_dose)
			// assert(insulin_dose_change < 0, '****** MAJOR ERROR: Correcting Hypoglycemia with Increating Insulin ******')
		} else if (bm_comparison === ComparisonOutcome.HIGH) {
			insulin_dose_change = NPH_OD_T2DM.HIGH_BM_CORRECTION_FACTOR * this.patient_insulin_dose
		}

		// Being extra careful & playing it safe from hypoglycaemia perspective
		new_insulin_dose = Math.floor(new_insulin_dose + insulin_dose_change)
		console.log(new_insulin_dose / this.PATIENT.weight)
		return { previous_insulin_dose: this.patient_insulin_dose, insulin_dose_change, new_insulin_dose }
	}
}

export const nph_od_t2dm = new NPH_OD_T2DM(20)

class NPH_BD_T2DM extends InsulinAnalysis {
	/**
	 * https://www.straighthealthcare.com/insulin-dosing.html - Dosing
	 * algorithm
	 * https://www.straighthealthcare.com/insulin-dosing.html#nph-dosing
	 *
	 * Adjustments
	 * - Can be made every 3 days
	*/
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

	nph_analysis(data: BM[]) {
		const parsed_data = InsulinAnalysis.parse_bm(data)
		const fasting = this.bm_aggregation(parsed_data, bmType.FASTING, 4, false)
		const pre_dinner = this.bm_aggregation(parsed_data, bmType.PRE_DINNER, 4, false)
		const all_readings = [...fasting.readings, ...pre_dinner.readings]
		const mean_all_readings = all_readings.reduce((a, c) => a + c.value, 0) / all_readings.length
		return { mean_all_readings, mean_fasting: fasting.mean_bm, mean_pre_dinner: pre_dinner.mean_bm }
	}

	insulin_adjustment(data: BM[]) {
		let total_insulin_adjustment: number = 0
		let morning_insulin_adjustment: number = 0
		let bedtime_insulin_adjustment: number = 0

		const parsed_data = InsulinAnalysis.parse_bm(data)
		const { mean_fasting, mean_pre_dinner, mean_all_readings } = this.nph_analysis(parsed_data)

		//Ranges calculation
		const pre_dinner_range = this.calc_adjutment_range(mean_pre_dinner, NPH_T2DM.pre_dinner_ranges)
		const fasting_range = this.calc_adjutment_range(mean_fasting, NPH_T2DM.fasting_ranges)

		// Insulin Dose calculations
		total_insulin_adjustment = this.calc_insulin_adjustment(mean_all_readings)

		//Check if we have to reduce insulin
		//BUG: Have to make this more robust
		if (total_insulin_adjustment < 0) {
			const minimum = Math.min(mean_fasting, mean_pre_dinner)
			if (minimum === mean_pre_dinner) {
				morning_insulin_adjustment = total_insulin_adjustment
			} else {
				bedtime_insulin_adjustment = total_insulin_adjustment
			}

			return { total_insulin_adjustment, morning_insulin_adjustment, bedtime_insulin_adjustment }
		}

		const { morning, bedtime } = this.calc_dose_range(fasting_range, pre_dinner_range)
		morning_insulin_adjustment = Math.round(morning * total_insulin_adjustment)
		bedtime_insulin_adjustment = Math.round(bedtime * total_insulin_adjustment)

		return { total_insulin_adjustment, morning_insulin_adjustment, bedtime_insulin_adjustment }
	}

	calc_insulin_adjustment(mean: number) {
		return NPH_T2DM.adjustmentTable.filter(x => between(mean, x.min, x.max))[0].adjustment
	}
	calc_adjutment_range(mean: number, table: typeof NPH_BD_T2DM.fasting_ranges) {
		return table.filter(x => between(mean, x.min, x.max))[0].range
	}

	calc_dose_range(fasting_range: number, pre_dinner_range: number) {
		return NPH_BD_T2DM.dose_distribution_table.filter(x => x.fasting_range === fasting_range && x.pre_dinner_range === pre_dinner_range)[0].adjustment
	}
}

export enum bmType {
	FASTING = 'fasting',
	PRE_LUNCH = 'pre-lunch',
	PRE_DINNER = 'pre-dinner',
	NIGHT = 'night',
}

export type BM = {
	date: string,
	value: number,
	type: string
}

export type PARSED_BM = Omit<BM, 'date' | 'type'> & { date: Date, type: bmType }


export interface PATIENT {
	age: number,
	height: number,
	weight: number,
	isMale: boolean,
	hba1c: number
}

export enum ComparisonOutcome {
	LOW,
	BETWEEN,
	HIGH,
}


export const INSULIN_REGIMENS = { 'nph_od': { label: 'Once a day Insulin', className: NPH_OD_T2DM }, 'nph_bd': { label: 'NPH Twice a day', className: NPH_BD_T2DM } }
