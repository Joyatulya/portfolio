export const TECH_STACK = [
	'Web Development',
	'Node.js',
	'Python',
	'JavaScript',
	'TypeScript',
	'Svelte / SvelteKit',
	'SQL',
	'Full Stack',
]

type TGITHUB_REPO = {
	name: string
	url: string
	description: string
	highlight?: string
}

//TODO: Mention about the random games that you have also made
//TODO: The description and highlight should be written in a better way
export const GITHUB_REPOS: TGITHUB_REPO[] = [
	{
		name: 'Reserach Code',
		url: 'https://github.com/Joyatulya/Reserach_Code',
		description: 'Research and Analysis of my published research using Python',
	},
	{
		name: 'Medicine Calculators',
		url: 'https://github.com/Joyatulya/medicine_calculators',
		description: 'Web app with authentication written with svelte, that helps calculate fluid deficit in patients with hypernatremia.',
		highlight: 'https://github.com/Joyatulya/medicine_calculators/blob/main/src/routes/hypernatremia/SodiumAnalysis.ts'
	},
	{
		name: 'FeatureXR',
		url: 'https://github.com/Joyatulya/FeatureXR',
		description: 'A hybrid approach to computer vision and deep learning for medical imaging (Chest Xray). It uses semantic segmentation for feature extraction of the lung fields and uses these featurs along with the chest xray for detection of pathologies',
		highlight: 'https://github.com/Joyatulya/FeatureXR/blob/main/cxr_feature_extraction.py'
	},
	{
		name: 'Portfolio',
		url: 'https://github.com/Joyatulya/portfolio',
		description: 'Source code for this website as currently deployed on Vercel.',
	},
	{
		name: 'Machine & Deep Learning Utilities',
		url: 'https://github.com/Joyatulya/utils',
		description: 'Data Science related utilities for machine learning and deep learning. Includes image processing , data cleaning, feature extraction, etc.',
	},
	{
		name: 'Web Crawler',
		url : 'na',
		description: 'Made a web crawler to get data from a website to make my own natural language processing model.'
	},
	{
		name: 'Logbook App',
		url : 'na',
		description: 'An app to help trainees track their progress for their portfolio.'
	},
	{
		name: 'JoyfulMeds',
		url : 'na',
		description: 'App for steroid misuse'
	},
]
