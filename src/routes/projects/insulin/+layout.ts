import { insulinRegimenFactory } from "./insulinAnalysis"
import type { IPATIENT } from "./insulinAnalysis.types"

export async function load() {

	const user: Omit<IPATIENT, 'insulin_analyser'> = {
		age: 50,
		height: 160,
		weight: 60,
		hba1c: 6.5,
		isMale: true,
		fasting_targets: [80, 100],
		insulinRegimen: {
			type: 'basal',
			basal_insulin: 'Semglee® (insulin glargine)',
			basal_dose: 20,
			basal_time: '22:00'

			//  type : 'nph_bd',
			// basal_am_dose: 10,
			// basal_am_time: '08:00',
			// basal_pm_dose: 10,
			// basal_pm_time: '21:00',
			// basal_insulin: 'NPH / Humulin® N / Novolin® N'
			//
			// type: 'basal_bolus',
			// basal_dose: 10,
			// basal_time: '21:00',
			// basal_insulin: 'NPH / Humulin® N / Novolin® N',
			// bolus_dinner_dose: 10,
			// bolus_dinner_time: '19:00',
			// bolus_lunch_dose: 10,
			// bolus_lunch_time: '12:00',
			// bolus_night_dose: 10,
			// bolus_night_time: '22:00'
		}
	}
	user['insulin_analyser'] = insulinRegimenFactory(user)
	return { user }
}
