type Publication_Type = 'Original Article' | 'QI/Audit' | 'Case Report' | 'Poster' | 'Presentation'

type Publication = {
	name: string
	type: Publication_Type | Publication_Type[]
	link: string
	doi?: string
	year: number
	asset?: string
	published_place: string | string[]
}

export const PUBLICATIONS: Publication[] = [
	{
		name: 'Epidemiology and effects of sociodemographic factors on extrapulmonary tuberculosis in Ambala, India',
		type: 'Original Article',
		link: 'https://pubmed.ncbi.nlm.nih.gov/39111931/',
		doi: 'https://doi.org/10.1016/j.ijtb.2023.04.028',
		year: 2023,
		published_place: 'Indian Journal of Tuberculosis'
	},
	{
		name: 'Comparison of Imaging Severity Between Vaccinated and Unvaccinated COVID-19 Patients: Perspective of an Indian District',
		type: 'Original Article',
		link: 'https://pubmed.ncbi.nlm.nih.gov/36407251/',
		doi: 'https://doi.org/10.7759/cureus.30724',
		year: 2022,
		published_place: 'The Cureus Journal of Medical Science'
	},
	{
		name: 'Community-based baseline survey regarding prevalence of anemia among females of different age categories under Anemia Mukt Abhiyan in District Ambala, Haryana',
		type: 'Original Article',
		link: 'https://www.ijcmph.com/index.php/ijcmph/article/view/10646',
		doi: 'https://doi.org/10.18203/2394-6040.ijcmph20230226',
		year: 2023,
		published_place: 'International Journal Of Community Medicine And Public Health'
	},
	{
		name: 'Nutritional Risk: An Examination of MUST Score Calculation in Hospital Inpatients',
		type: ['QI/Audit', 'Poster'],
		link: 'https://clinicalnutritionespen.com/article/S2405-4577(23)02356-2/abstract',
		doi: 'https://doi.org/10.1016/j.clnesp.2023.12.131',
		year: 2024,
		published_place: ['BAPEN annual conference 2023, Edinburgh, UK', 'Clinical Nutrition ESPEN']
	},
	{
		name: 'Revisiting Post-thrombolysis ICH. How are we doing Post Covid? A retrospective Audit',
		type: 'QI/Audit',
		link: '/academic/Post-thrombolysis audit — SHH.pdf',
		year: 2023,
		published_place: 'Stroke Governance Meeting, Stepping Hill Hospital, Stockport, UK'
	},
	{
		name: 'Improving Surveillance of Comorbidities in Patients with Tuberculosis',
		type: 'QI/Audit',
		link: '/academic/QI -  Imroving surviellance of Comorbidities in TB final.pdf',
		year: 2021,
		published_place: 'District Governance Meeting, Ambala, India'
	},
	{
		name: 'Embracing AI : Transforming Personal and Professional Lives',
		type: 'Presentation',
		link: '/academic/AI Presentation — SHH.pdf',
		year: 2023,
		published_place: 'Local Teaching, Stepping Hill Hospital, Stockport, UK'
	},
	{
		name: 'Herpes Simplex Virus Oesophagitis in an Immunocompetent Young Female',
		type: ['Case Report', 'Poster'],
		link: '/academic/hsv oesophagitis case report.pdf',
		year: 2024,
		doi: 'http://dx.doi.org/10.13140/RG.2.2.29457.03682',
		published_place: 'Society of Acute Medicine 2024, UK'
	},
	{
		name: 'Carotid Artery Dissection in a Case of Turner\'s Syndrome',
		type: ['Case Report', 'Poster'],
		link: '/academic/poster dissecting turner.pdf',
		year: 2024,
		published_place: 'International Forum on Quality and Safety in Healthcare 2024, London, UK'
	},
	{
		name: 'Active Case Finding (ACF) & Direct Benefit Transfer (DBT) Campaigns',
		type: 'Presentation',
		link: '/academic/ACF PPT 2021.pdf',
		year: 2021,
		published_place: 'Regional NTEP Campaign, Ambala, India'
	},
	{
		name: 'Differences between Practices of Private and Public Sector in Managing TB',
		type: 'Presentation',
		link: '/academic/Regional Presentation on Private TB.pdf',
		year: 2022,
		published_place: '76th NATCON, Mullana, India'
	},
	/* {
		name: 'Marantic Endocarditis',
		type: 'Case Report',
		link: '/academic/Regional Presentation on Private TB.pdf',
		year: 2023,
		published_place: '76th NATCON, Mullana, India'
	},
	{
		name: 'Differences between Practices of Private and Public Sector in Managing TB',
		type: 'Presentation',
		link: '/academic/Regional Presentation on Private TB.pdf',
		year: 2022,
		published_place: '76th NATCON, Mullana, India'
	},
	{
		name: 'Differences between Practices of Private and Public Sector in Managing TB',
		type: 'Presentation',
		link: '/academic/Regional Presentation on Private TB.pdf',
		year: 2022,
		published_place: '76th NATCON, Mullana, India'
	}, */
]

//TODO: Stroke wala qip, esophagitis case report, stroke wala poster (marantic
//shit wala, 
//TODO : Pending hai yeh - cancer seeding case report, another tb article, dka
//Case report
