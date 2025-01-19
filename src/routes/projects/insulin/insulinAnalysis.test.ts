import { advanced_between, ComparisonOutcome, type BM } from "./insulinAnalysis";

const normalGlucoseData: BM[] = [
	{ date: '2025-01-18T06:00', value: 92, type: 'fasting' },
	{ date: '2025-01-18T08:00', value: 90, type: 'pre-breakfast' },
	{ date: '2025-01-18T12:00', value: 98, type: 'pre-lunch' },
	{ date: '2025-01-18T14:00', value: 95, type: 'post-lunch' },
	{ date: '2025-01-18T16:00', value: 96, type: 'afternoon' },
	{ date: '2025-01-18T18:00', value: 100, type: 'pre-dinner' },
	{ date: '2025-01-18T20:00', value: 98, type: 'pre-dinner' },
	{ date: '2025-01-19T06:00', value: 92, type: 'fasting' },
	{ date: '2025-01-19T08:00', value: 93, type: 'pre-breakfast' }
];
const hypoglycemiaData: BM[] = [
	{ date: '2025-01-18T06:00', value: 48, type: 'fasting' },
	{ date: '2025-01-18T08:00', value: 45, type: 'pre-breakfast' },
	{ date: '2025-01-18T12:00', value: 50, type: 'pre-lunch' },
	{ date: '2025-01-18T14:00', value: 48, type: 'post-lunch' },
	{ date: '2025-01-18T16:00', value: 47, type: 'afternoon' },
	{ date: '2025-01-18T18:00', value: 52, type: 'pre-dinner' },
	{ date: '2025-01-18T20:00', value: 49, type: 'post-dinner' },
	{ date: '2025-01-19T06:00', value: 46, type: 'fasting' },
	{ date: '2025-01-19T08:00', value: 50, type: 'pre-breakfast' }
];
const hyperglycemiaData: BM[] = [
	{ date: '2025-01-18T06:00', value: 195, type: 'fasting' },
	{ date: '2025-01-18T08:00', value: 190, type: 'pre-breakfast' },
	{ date: '2025-01-18T12:00', value: 210, type: 'pre-lunch' },
	{ date: '2025-01-18T14:00', value: 205, type: 'post-lunch' },
	{ date: '2025-01-18T16:00', value: 180, type: 'afternoon' },
	{ date: '2025-01-18T18:00', value: 215, type: 'pre-dinner' },
	{ date: '2025-01-18T20:00', value: 220, type: 'post-dinner' },
	{ date: '2025-01-19T06:00', value: 200, type: 'fasting' },
	{ date: '2025-01-19T08:00', value: 210, type: 'pre-breakfast' }
];

describe('Advanced Between Function', () => {
	it('Identifies data within range', () => {
		const mock1 = [0, 100]
		const value = 15
		const outcome = advanced_between(value, ...mock1)
		expect(outcome).toEqual(ComparisonOutcome.BETWEEN)
	}
	)
	it('Identifies data outside range', () => {
		const mock1 = [0, 100]
		const value = 155
		const outcome = advanced_between(value, ...mock1)
		expect(outcome).toBeTruthy()
	}
	)
})
