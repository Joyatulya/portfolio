import { insulinRegimenFactory, type IPATIENT } from "./insulinAnalysis"

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
			basal_dose: 10,
			basal_time: '22:00'
			//  type : 'nph_bd',
			// basal_am_dose: 10,
			// basal_am_time: '08:00',
			// basal_pm_dose: 10,
			// basal_pm_time: '21:00',
			// basal_insulin: 'NPH / Humulin® N / Novolin® N'
		}
	}
	user['insulin_analyser'] = insulinRegimenFactory( user )
	return { user }
}
