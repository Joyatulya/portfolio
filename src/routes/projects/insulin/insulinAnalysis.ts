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


export function convert_mean_bm_to_hba1c(mean_bm: number): number {
	return Math.round((mean_bm + 46.7) / 28.7 * 10) / 10
}

type Tbm_aggergation = ReturnType<InsulinAnalysis['bm_aggregation']>

export function parse_bm(data: BM[]): PARSED_BM[] {
	return data.map(x => {
		return {
			...x,
			date: new Date(x.date),
			type: x.type as bmType
		}
	})
}
class InsulinAnalysis {

	HYPER_BM: number = 180
	FASTING: [number, number] = [80, 99]
	HYPO_BM: number = 70
	// PATIENT: Omit<IPATIENT, 'insulin_analyser'>
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
			console.log(reading_days)
			throw new Error('Not enough readings for ' + reading_type)
		}

		let mean_bm = specifid_bms_specific_days.reduce((a, c) => a + c.value, 0) / specifid_bms_specific_days.length
		mean_bm = Math.round(mean_bm)

		return { readings: specifid_bms_specific_days, mean_bm, num_days: reading_days.size, num_readings: specifid_bms_specific_days.length }
	}


	/** 
	 * Given a list of BMs, returns the hyper and hypo readings. If no days
	 * provided, it returns all readings
	 * */
	analysis(data: PARSED_BM[], days: number | undefined) {
		const parsed_data = days ? InsulinAnalysis.filter_data_on_days(data, days) : data
		const hypos = this.filter_hypos(parsed_data)
		const hypers = this.filter_hypers(parsed_data)
		const fasting = this.bm_aggregation(parsed_data, bmType.FASTING)
		return { hypos, hypers, fasting }
	}


	// BUG: Validate Readings might cause more problems than it will solve
	calculate_averages(data: PARSED_BM[], days = 7, validate_readings = false, readings?: `${bmType}`[]): Record<`${bmType}` | 'all', Tbm_aggergation> {
		const parsed_data = days ? InsulinAnalysis.filter_data_on_days(data, days) : data
		let averages: Record<`${bmType}` | 'all', Tbm_aggergation> = {}
		if (readings) {
			for (let key of readings) {
				averages[key] = this.bm_aggregation(parsed_data, key)
			}
		} else {
			averages.fasting = this.bm_aggregation(parsed_data, bmType.FASTING, days, validate_readings)
			averages.pre_dinner = this.bm_aggregation(parsed_data, bmType.PRE_DINNER, days, validate_readings)
			averages.pre_lunch = this.bm_aggregation(parsed_data, bmType.PRE_LUNCH, days, validate_readings)
			averages.night = this.bm_aggregation(parsed_data, bmType.NIGHT, days, validate_readings)
		}
			averages.all = this.bm_aggregation(parsed_data, undefined, days, validate_readings)
		return averages
	}

	// +++++++++++++++++ Static Methods +++++++++++++++++++++++


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
	recommendation(data: PARSED_BM[]) {
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

export class NPH_OD_T2DM extends InsulinAnalysis {
	/**
	 * https://www.straighthealthcare.com/insulin-dosing.html#insulin-therapy
	 */
	static HIGH_BM_CORRECTION_FACTOR: number = 0.1
	static LOW_BM_CORRECTION_FACTOR: number = 0.15
	patient: Omit<IPATIENT, 'insulin_analyser'>
	basal_dose: number

	constructor(patient: Omit<IPATIENT, 'insulin_analyser'>) {
		super()
		if (!patient || patient.insulinRegimen.type !== 'basal') throw new Error('Wrong Data given to wrong analyzer')
		this.patient = patient
		this.basal_dose = this.patient.insulinRegimen.basal_dose
	}

	//FIX: Make it robust
	recommendation(data: PARSED_BM[]): { previous_insulin_dose: number, insulin_dose_change: number, new_insulin_dose: number } {
		let insulin_dose_change = 0
		let new_insulin_dose = this.basal_dose

		const { mean_bm: mean_fasting_bm, } = this.bm_aggregation(data, bmType.FASTING, 3)
		const bm_comparison = advanced_between(mean_fasting_bm, ...this.patient.fasting_targets)

		if (bm_comparison === ComparisonOutcome.LOW) {
			insulin_dose_change = - (NPH_OD_T2DM.LOW_BM_CORRECTION_FACTOR * this.basal_dose)
			// assert(insulin_dose_change < 0, '****** MAJOR ERROR: Correcting Hypoglycemia with Increating Insulin ******')
		} else if (bm_comparison === ComparisonOutcome.HIGH) {
			insulin_dose_change = NPH_OD_T2DM.HIGH_BM_CORRECTION_FACTOR * this.basal_dose
		}

		// Being extra careful & playing it safe from hypoglycaemia perspective
		new_insulin_dose = Math.floor(new_insulin_dose + insulin_dose_change)
		return { previous_insulin_dose: this.basal_dose, insulin_dose_change, new_insulin_dose }
	}
}

class NPH_BD_T2DM extends InsulinAnalysis {
	/**
	 * https://www.straighthealthcare.com/insulin-dosing.html - Dosing
	 * algorithm
	 * https://www.straighthealthcare.com/insulin-dosing.html#nph-dosing
	 *
	 * Adjustments
	 * - Can be made every 3 days
	*/
	patient: Omit<IPATIENT, 'insulin_analyser'>

	constructor(patient: Omit<IPATIENT, 'insulin_analyser'>) {
		super()
		this.patient = patient
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


	recommendation(data: PARSED_BM[]) {
		let total_insulin_adjustment: number = 0
		let morning_insulin_adjustment: number = 0
		let bedtime_insulin_adjustment: number = 0

		const { fasting, pre_dinner, all } = this.calculate_averages(data, 3, true, ['fasting', 'pre_dinner'])
		//Ranges calculation
		const pre_dinner_range = this.calc_adjutment_range(pre_dinner.mean_bm, NPH_BD_T2DM.pre_dinner_ranges)
		const fasting_range = this.calc_adjutment_range(fasting.mean_bm, NPH_BD_T2DM.fasting_ranges)

		// Insulin Dose calculations
		total_insulin_adjustment = this.calc_insulin_adjustment(all.mean_bm)

		//Check if we have to reduce insulin
		//BUG: Have to make this more robust
		if (total_insulin_adjustment < 0) {
			const minimum = Math.min(fasting.mean_bm, pre_dinner.mean_bm)
			if (minimum === pre_dinner.mean_bm) {
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
		return NPH_BD_T2DM.adjustmentTable.filter(x => between(mean, x.min, x.max))[0].adjustment
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
	PRE_LUNCH = 'pre_lunch',
	PRE_DINNER = 'pre_dinner',
	NIGHT = 'night',
}

export type BM = {
	date: string,
	value: number,
	type: string
}

export type PARSED_BM = Omit<BM, 'date' | 'type'> & { date: Date, type: bmType }


export interface IPATIENT {
	age: number,
	height: number,
	weight: number,
	isMale: boolean,
	hba1c: number,
	insulinRegimen: TBasalInsulin | TNPH_BD_Insulin,
	units?: 'metric' | 'imperial',
	insulin_analyser: typeof NPH_OD_T2DM | typeof NPH_BD_T2DM | typeof Basal_Bolus_T2DM,
	fasting_targets: [number, number]
}

export enum ComparisonOutcome {
	LOW,
	BETWEEN,
	HIGH,
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

export const INSULIN_ANALYSERS = { 'basal': NPH_OD_T2DM, 'nph_bd': NPH_BD_T2DM, 'basal_bolus': Basal_Bolus_T2DM }
