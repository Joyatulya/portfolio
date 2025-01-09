import { z } from "zod";

export const fluids: { name: string, na: number }[] = [
	{
		name: '0.9% Saline',
		na: 154
	},
	{
		name: '0.45% Saline',
		na: 77
	},
	{
		name: "Hartmann's",
		na: 131
	},
	{
		name: "Lactated Ringer's",
		na: 130
	},
	{
		name: 'Enteral Water',
		na: 0
	},
	{
		name: '5% Dextrose',
		na: 0
	},
	{
		name: 'D5-2NS',
		na: 34
	}
];

export enum SexTypes {
	MALE = 'M',
	FEMALE = 'F'
}

export enum AgeGroupTypes {
	CHILD = 'C',
	ADULT = 'A',
	ELDERLY = 'E'
}

export interface IBasicPatient {
	age: AgeGroupTypes
	sex: SexTypes
	weight: number
	height?: number
}

export const NaSchema = z.object({
	weight : z.number().min(0).max(500).default(60),
	curr_na : z.number().min(80).max(250),
	target_na : z.number().min(80).max(250).default(140),
	// age : z.number().int().positive().max(120).default(60)
})

export interface ISodiumPatient extends IBasicPatient {
	// insensible_losses: number | undefined;
	// other_losses: number;
	// urinary_losses: number;
	curr_sodium: number;
	target_sodium: number;
	// correction_rate: number;
	// correction_fluid_na: number;
}

export class SodiumAnalysis {
	// These are the water coefficient for different age groups
	static WATER_COEFF = {
		C: {
			F: 0.6,
			M: 0.6
		},
		A: {
			F: 0.5,
			M: 0.6
		},
		E: {
			F: 0.45,
			M: 0.5
		}
	};
	patient_data: ISodiumPatient;

	constructor(patient_data: ISodiumPatient) {
		this.patient_data = patient_data;
		// console.clear();
		// console.table({
		// 	age: this.age,
		// 	sex: this.sex,
		// 	weight: this.weight,
		// 	'curr na': this.curr_sodium,
		// 	w_coeff: this.w_coeff,
		// 	'target na': this.target_sodium,
		// 	TBW: this.TBW,
		// 	'water deficit': this.water_deficit(),
		// 	'corr rate': this.correction_rate,
		// 	'corr fluid na': this.correction_fluid_na,
		// 	'change na / litre': this.change_na_per_litre_fluid(),
		// 	'litre / day': this.litre_fluid_per_day(),
		// 	'infusion rate': this.infusion_rate(),
		// 	treatment_duration: this.expected_treatment_duration()
		// });
	}

	get weight(): number | null {
		let weight = SodiumAnalysis.number_input_validation(this.patient_data.weight);
		return weight;
	}

	get height() {
		const height = SodiumAnalysis.number_input_validation(this.patient_data.height);
		return height;
	}

	get curr_sodium() {
		const curr_na = SodiumAnalysis.number_input_validation(this.patient_data.curr_sodium);
		return curr_na;
	}

	get target_sodium() {
		return SodiumAnalysis.number_input_validation(this.patient_data.target_sodium);
	}

	get age() {
		return this.patient_data.age;
	}

	get sex() {
		return this.patient_data.sex;
	}

	get w_coeff() {
		const w_coeff = SodiumAnalysis.WATER_COEFF[this.age][this.sex];
		return w_coeff;
	}

	get correction_rate() {
		return this.patient_data.correction_rate;
	}

	get correction_fluid_na() {
		return this.patient_data.correction_fluid_na;
	}
	get TBW(): number {
		// Total body water
		return this.w_coeff * this.weight;
	}

	get urinary_losses(): number {
		let losses = this.patient_data.urinary_losses
		losses = losses ? losses : 0
		return losses
	}
	get other_losses(): number {
		let losses = this.patient_data.other_losses
		losses = losses ? losses : 0
		return losses
	}
	get insensible_losses(): number {
		let losses = this.patient_data.insensible_losses
		losses = losses ? losses : 0
		return losses
	}

	get total_other_losses() {
		return roundNum(this.urinary_losses + this.other_losses + this.insensible_losses, 1)
	}

	water_deficit(): number | string {
		let water_deficit = this.TBW * (this.curr_sodium / this.target_sodium - 1);
		water_deficit = roundNum(water_deficit);
		return SodiumAnalysis.number_penultimate_sanity_checking(water_deficit)
	}

	change_na_per_litre_fluid() {
		let change = -(this.correction_fluid_na - this.curr_sodium) / (this.TBW + 1);
		return change;
	}

	litre_fluid_per_day(include_losses = false) {
		let fluid_amount = this.correction_rate / this.change_na_per_litre_fluid();
		fluid_amount = Math.abs(Math.round(fluid_amount * 100)) / 100;
		if (include_losses) {
			let _ = roundNum(fluid_amount + this.total_other_losses, 1)
			return SodiumAnalysis.number_penultimate_sanity_checking(_)
		}
		return SodiumAnalysis.number_penultimate_sanity_checking(fluid_amount);
	}

	// infusion_rate() {
	// 	// in ml/hr
	// 	let rate = (this.litre_fluid_per_day() / 24) * 1000;
	// 	rate = roundNum(rate, 1);
	// 	return SodiumAnalysis.number_penultimate_sanity_checking(rate)
	// }

	/* expected_treatment_duration(): string[] {
		const TIME_FORMAT = 'ddd D/MM/YY HH:MM';
		let duration = this.water_deficit() / this.litre_fluid_per_day();
		duration = duration * 24;
		duration = roundNum(duration, 1);

		// Time realted shit
		let start_time = moment();
		let end_time = moment().add(duration, 'hours');
		let treatment_duration = start_time.format(TIME_FORMAT) + ' — ' + end_time.format(TIME_FORMAT)
		let numIsTidy = SodiumAnalysis.number_penultimate_sanity_checking(duration)
		if (numIsTidy === '-') {
			return ['-', '']
		}
		if (duration > 48) {
			duration /= 24
			duration = roundNum(duration, 1);
			return [`${duration} days`, treatment_duration];
		}
		return [`${duration} hours`, treatment_duration];
	} */

	get_analysis() {
		let analysis = {
			// age: this.age,
			// sex: this.sex,
			// weight: this.weight,
			// 'curr na': this.curr_sodium,
			// w_coeff: this.w_coeff,
			// 'target na': this.target_sodium,
			// TBW: this.TBW,
			// 'corr fluid na': this.correction_fluid_na,
			// 'change na / litre': this.change_na_per_litre_fluid(),
			// 'corr rate': this.correction_rate,
			// 'Water Deficit': this.water_deficit(),
			// Litre: this.litre_fluid_per_day(),
			// 'infusion rate': this.infusion_rate(),
			// treatment_duration: this.expected_treatment_duration()
		};
		return analysis;
	}

	// Utilities +++++++++++++++++++++++++++++++++++++++
	static number_input_validation(number : number) {
		let parsed_num = parseFloat(number);
		if (parsed_num && !Number.isNaN(parsed_num)) {
			return parsed_num;
		} else {
			return '-';
			throw Error(number);
		}
	}

	static number_penultimate_sanity_checking(num) {
		if (num === 0 || Number.isNaN(num) || !Number.isFinite(num)) {
			return '-'
		}
		return num
	}
}
