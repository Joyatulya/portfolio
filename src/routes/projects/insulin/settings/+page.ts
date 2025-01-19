import type { IPATIENT } from "../insulinAnalysis"

export async function load(){
	const patient : IPATIENT = {
		age: 50,
		height: 160,
		weight: 60,
		hba1c: 6.5,
		isMale: true
	}

	return {patient}
}
