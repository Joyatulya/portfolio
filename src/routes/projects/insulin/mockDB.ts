import type { BM, bmType } from "./insulinAnalysis";
import {faker} from '@faker-js/faker'

function get_dummy_date(days_ago: number, value: number, time: `${bmType}`) {
	const today = new Date()
	today.setDate(today.getDate() - days_ago)
	const times: Record<`${bmType}`, number> = {
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

const hyper_bm: BM[] = [
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
	get_dummy_date(3, 65, 'fasting'),
	get_dummy_date(3, 150, 'pre_lunch'),
	get_dummy_date(3, 110, 'pre_dinner'),

	get_dummy_date(2, 65, 'fasting'),
	get_dummy_date(2, 150, 'pre_lunch'),
	get_dummy_date(2, 110, 'pre_dinner'),

	get_dummy_date(1, 65, 'fasting'),
	get_dummy_date(1, 150, 'pre_lunch'),
	get_dummy_date(1, 110, 'pre_dinner'),

	get_dummy_date(0, 65, 'fasting'),
	get_dummy_date(0, 160, 'pre_lunch'),
	get_dummy_date(0, 110, 'pre_dinner'),
]

// export const dummyBM = faker.helpers.arrayElements([hyper_bm, hypo_bm])
export const dummyBM = random_array_element([hyper_bm, hypo_bm])
