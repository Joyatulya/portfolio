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
	weight: z.coerce.number().min(0).max(500).default(60),
	curr_na: z.coerce.number().min(80).max(250),
	target_na: z.coerce.number().min(80).max(250).default(140),
	age: z.coerce.number().int().positive().max(120).default(60),
	sex: z.enum([SexTypes.MALE, SexTypes.FEMALE]),
	fluid_na: z.coerce.number().min(0),
	losses: z.coerce.number().min(0).default(0),
	na_correction_rate: z.coerce.number().min(1).max(15).default(5),
})

export interface ISodiumPatient extends IBasicPatient {
	[x: string]: number;
	// fluid_losses: number | undefined;
	curr_na: number;
	target_na: number;
	// na_correction_rate: number;
	// fluid_na: number;
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
		// 	'curr na': this.curr_na,
		// 	w_coeff: this.w_coeff,
		// 	'target na': this.target_na,
		// 	TBW: this.TBW,
		// 	'water deficit': this.water_deficit(),
		// 	'corr rate': this.na_correction_rate,
		// 	'corr fluid na': this.fluid_na,
		// 	'change na / litre': this.change_na_per_litre_fluid(),
		// 	'litre / day': this.litre_fluid_per_day(),
		// 	'infusion rate': this.infusion_rate(),
		// 	treatment_duration: this.expected_treatment_duration()
		// });
	}

	get weight(): number | null {
		return this.patient_data.weight;
	}

	get height() {
		return this.patient_data.height
	}

	get curr_na() {
		return this.patient_data.curr_na
	}

	get target_na() {
		return this.patient_data.target_na
	}

	get age() {
		if (this.patient_data.age < 12) return AgeGroupTypes.CHILD
		return this.patient_data.age < 65 ? AgeGroupTypes.ADULT : AgeGroupTypes.ELDERLY
	}

	get sex() {
		return this.patient_data.sex;
	}

	get w_coeff() {
		const w_coeff = SodiumAnalysis.WATER_COEFF[this.age][this.sex];
		return w_coeff;
	}

	get na_correction_rate() {
		return this.patient_data.na_correction_rate / 24;
	}

	get fluid_na() {
		return this.patient_data.fluid_na;
	}

	// Total body water
	get TBW(): number {
		return this.w_coeff * this.weight;
	}

	water_deficit(): number | string {
		return this.TBW * (this.curr_na / this.target_na - 1);
	}

	change_na_per_litre_fluid() {
		let change = -(this.fluid_na - this.curr_na) / (this.TBW + 1);
		return change;
	}

	litre_fluid_per_day() {
		let fluid_amount = this.na_correction_rate / this.change_na_per_litre_fluid();
		return Math.abs(Math.round(fluid_amount * 100)) / 100;
	}

	fluid_rate_hr() {
		return (1000 * this.na_correction_rate) / this.change_na_per_litre_fluid()
	}

	get_analysis() {
		let analysis = {
			water_deficit: Math.round(this.water_deficit() * 10) / 10,
			total_fluid_infusion_volume: Math.round(this.total_fluid_infusion_volume() * 10) / 10,
			fluid_rate_hr: Math.round(this.fluid_rate_hr()),
			treatment_duration: this.expected_treatment_duration()
		};
		return analysis;
	}
	total_fluid_infusion_volume() {
		return (this.curr_na - this.target_na) / this.change_na_per_litre_fluid()
	}
	expected_treatment_duration() {
		return (this.curr_na - this.target_na) / this.na_correction_rate
	}

}
