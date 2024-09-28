type Portfolio_Reference = {
	name: string
	phone?: string
	email?: string
	place: Employment_Place
	position: string
	relation?: string // Like ES, CS etc
}

type Employment_Place = {
	name: string
	year: string
}

export const EMPLYOYMENT = [
	{
		place: 'All India Institute of Medical Sciences, Rishikesh, India',
		year: '2019',
		position : 'Medical Student'
	},
	{
		place: 'All India Institute of Medical Sciences, Rishikesh, India',
		year: '2014-2018',
		position : 'Internship / Foundation Year 1 (FY1)'
	},
	{
		place: 'Opioid Substitution Therapy, Ambala, India',
		year: '2020-2021',
		position : 'Medical Officer'
	},
	{
		place: 'District Hospital, Ambala, India',
		year: '2020',
		position : 'Volunteer Medical Officer'
	},
	{
		place: 'Chest & Tuberculosis Hospital, Ambala, India',
		year: '2020-2022',
		position : 'Nodal Officer'
	},
	{
		place: 'Stepping Hill Hospital (NHS), Stockport, UK',
		year: '2022-2023',
		position : 'Junior Clinical Fellow'
	},
	{
		place: 'Sheffield Teaching Hospital (NHS), UK',
		year: '2023-Present',
		position : 'Internal Medicine Trainee (IMT)'
	},
] as const

