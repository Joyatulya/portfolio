import type { BM } from "./insulinAnalysis";

export const dummyBM: BM[] =
	[
		{ "date": "2025-01-15T07:00:00Z", "value": 62, "type": "fasting" },
		{ "date": "2025-01-15T12:00:00Z", "value": 180, "type": "post-lunch" },
		{ "date": "2025-01-15T22:00:00Z", "value": 145, "type": "night" },

		{ "date": "2025-01-16T08:00:00Z", "value": 105, "type": "pre-breakfast" },
		{ "date": "2025-01-16T14:00:00Z", "value": 215, "type": "post-lunch" },
		{ "date": "2025-01-16T19:30:00Z", "value": 100, "type": "pre-dinner" },

		{ "date": "2025-01-17T07:15:00Z", "value": 68, "type": "fasting" },
		{ "date": "2025-01-17T13:30:00Z", "value": 195, "type": "post-lunch" },
		{ "date": "2025-01-17T21:45:00Z", "value": 135, "type": "night" },

		{ "date": "2025-01-18T07:00:00Z", "value": 60, "type": "fasting" },
		{ "date": "2025-01-18T12:45:00Z", "value": 175, "type": "post-lunch" },
		{ "date": "2025-01-18T20:00:00Z", "value": 140, "type": "night" },

		{ "date": "2025-01-19T08:00:00Z", "value": 95, "type": "pre-breakfast" },
		{ "date": "2025-01-19T13:15:00Z", "value": 210, "type": "post-lunch" },
		{ "date": "2025-01-19T22:30:00Z", "value": 160, "type": "night" }
	]
