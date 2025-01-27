import type { BM, enumBMType } from "./insulinAnalysis";
import { faker } from '@faker-js/faker'

function get_dummy_date(days_ago: number, value: number, time: `${enumBMType}`) {
	const today = new Date()
	today.setDate(today.getDate() - days_ago)
	const times: Record<`${enumBMType}`, number> = {
		fasting: 7,
		pre_lunch: 12,
		pre_dinner: 19,
		night: 22
	}
	today.setHours(times[time])
	return { "date": today.toJSON(), value, "type": time }
}

function random_array_element(arr: any[]) {
	return arr[Math.floor(Math.random() * arr.length)]
}

const improvingHypoglycaemia: BM[] = [

	get_dummy_date(6, 68, 'fasting'),
	get_dummy_date(6, 150, 'pre_lunch'),
	get_dummy_date(6, 110, 'pre_dinner'),

	get_dummy_date(5, 58, 'fasting'),
	get_dummy_date(5, 105, 'pre_lunch'),
	get_dummy_date(5, 140, 'pre_dinner'),

	get_dummy_date(4, 75, 'fasting'),
	get_dummy_date(4, 150, 'pre_lunch'),
	get_dummy_date(4, 110, 'pre_dinner'),

	get_dummy_date(3, 68, 'fasting'),
	get_dummy_date(3, 140, 'pre_lunch'),
	get_dummy_date(3, 115, 'pre_dinner'),

	get_dummy_date(2, 95, 'fasting'),
	get_dummy_date(2, 160, 'pre_lunch'),
	get_dummy_date(2, 110, 'pre_dinner'),

	get_dummy_date(1, 90, 'fasting'),
	get_dummy_date(1, 150, 'pre_lunch'),
	get_dummy_date(1, 170, 'pre_dinner'),

	get_dummy_date(0, 100, 'fasting'),
	get_dummy_date(0, 100, 'pre_lunch'),
	get_dummy_date(0, 140, 'pre_dinner'),
]

const normalBM: BM[] = [

	get_dummy_date(6, 98, 'fasting'),
	get_dummy_date(6, 150, 'pre_lunch'),
	get_dummy_date(6, 110, 'pre_dinner'),

	get_dummy_date(5, 88, 'fasting'),
	get_dummy_date(5, 105, 'pre_lunch'),
	get_dummy_date(5, 140, 'pre_dinner'),

	get_dummy_date(4, 105, 'fasting'),
	get_dummy_date(4, 150, 'pre_lunch'),
	get_dummy_date(4, 110, 'pre_dinner'),

	get_dummy_date(3, 98, 'fasting'),
	get_dummy_date(3, 140, 'pre_lunch'),
	get_dummy_date(3, 115, 'pre_dinner'),

	get_dummy_date(2, 85, 'fasting'),
	get_dummy_date(2, 160, 'pre_lunch'),
	get_dummy_date(2, 110, 'pre_dinner'),

	get_dummy_date(1, 95, 'fasting'),
	get_dummy_date(1, 150, 'pre_lunch'),
	get_dummy_date(1, 170, 'pre_dinner'),

	get_dummy_date(0, 80, 'fasting'),
	get_dummy_date(0, 100, 'pre_lunch'),
	get_dummy_date(0, 140, 'pre_dinner'),
]

const really_bad_hyper_bm: BM[] = [

	get_dummy_date(6, 278, 'fasting'),
	get_dummy_date(6, 350, 'pre_lunch'),
	get_dummy_date(6, 410, 'pre_dinner'),

	get_dummy_date(5, 378, 'fasting'),
	get_dummy_date(5, 450, 'pre_lunch'),
	get_dummy_date(5, 510, 'pre_dinner'),

	get_dummy_date(4, 378, 'fasting'),
	get_dummy_date(4, 450, 'pre_lunch'),
	get_dummy_date(4, 510, 'pre_dinner'),

	get_dummy_date(3, 378, 'fasting'),
	get_dummy_date(3, 450, 'pre_lunch'),
	get_dummy_date(3, 510, 'pre_dinner'),

	get_dummy_date(2, 365, 'fasting'),
	get_dummy_date(2, 500, 'pre_lunch'),
	get_dummy_date(2, 510, 'pre_dinner'),

	get_dummy_date(1, 395, 'fasting'),
	get_dummy_date(1, 550, 'pre_lunch'),
	get_dummy_date(1, 400, 'pre_dinner'),

	get_dummy_date(0, 350, 'fasting'),
	get_dummy_date(0, 460, 'pre_lunch'),
	get_dummy_date(0, 410, 'pre_dinner'),
]


const hyper_bm: BM[] = [

	get_dummy_date(6, 178, 'fasting'),
	get_dummy_date(6, 250, 'pre_lunch'),
	get_dummy_date(6, 310, 'pre_dinner'),

	get_dummy_date(5, 178, 'fasting'),
	get_dummy_date(5, 250, 'pre_lunch'),
	get_dummy_date(5, 310, 'pre_dinner'),

	get_dummy_date(4, 178, 'fasting'),
	get_dummy_date(4, 250, 'pre_lunch'),
	get_dummy_date(4, 310, 'pre_dinner'),

	get_dummy_date(3, 178, 'fasting'),
	get_dummy_date(3, 250, 'pre_lunch'),
	get_dummy_date(3, 310, 'pre_dinner'),

	get_dummy_date(2, 165, 'fasting'),
	get_dummy_date(2, 300, 'pre_lunch'),
	get_dummy_date(2, 310, 'pre_dinner'),

	get_dummy_date(1, 195, 'fasting'),
	get_dummy_date(1, 350, 'pre_lunch'),
	get_dummy_date(1, 200, 'pre_dinner'),

	get_dummy_date(0, 150, 'fasting'),
	get_dummy_date(0, 260, 'pre_lunch'),
	get_dummy_date(0, 210, 'pre_dinner'),
]

const hypo_bm: BM[] = [

	get_dummy_date(6, 178, 'fasting'),
	get_dummy_date(6, 250, 'pre_lunch'),
	get_dummy_date(6, 310, 'pre_dinner'),
	get_dummy_date(6, 110, 'night'),

	get_dummy_date(5, 178, 'fasting'),
	get_dummy_date(5, 250, 'pre_lunch'),
	get_dummy_date(5, 310, 'pre_dinner'),
	get_dummy_date(5, 110, 'night'),

	get_dummy_date(4, 178, 'fasting'),
	get_dummy_date(4, 250, 'pre_lunch'),
	get_dummy_date(4, 310, 'pre_dinner'),
	get_dummy_date(4, 110, 'night'),


	get_dummy_date(3, 85, 'fasting'),
	get_dummy_date(3, 200, 'pre_lunch'),
	get_dummy_date(3, 110, 'pre_dinner'),
	get_dummy_date(3, 110, 'night'),

	get_dummy_date(2, 65, 'fasting'),
	get_dummy_date(2, 150, 'pre_lunch'),
	get_dummy_date(2, 110, 'pre_dinner'),
	get_dummy_date(2, 110, 'night'),

	get_dummy_date(1, 65, 'fasting'),
	get_dummy_date(1, 150, 'pre_lunch'),
	get_dummy_date(1, 110, 'pre_dinner'),
	get_dummy_date(1, 110, 'night'),

	get_dummy_date(0, 65, 'fasting'),
	get_dummy_date(0, 160, 'pre_lunch'),
	get_dummy_date(0, 110, 'pre_dinner'),
	get_dummy_date(0, 110, 'night'),
]

// export const dummyBM = faker.helpers.arrayElements([hyper_bm, hypo_bm])
export const dataSets = {
	'Hyperglycaemia': hyper_bm,
	'Hypoglycaemia': hypo_bm,
	'Improving Hypoglycaemia': improvingHypoglycaemia,
	'Normal': normalBM,
	'Severe Hyperglyceamia': really_bad_hyper_bm
}


export const dummyBM = random_array_element(Object.values(dataSets))
