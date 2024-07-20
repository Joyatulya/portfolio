type Publication_Type = 'Original Article' | 'QI' | 'Case Report' | 'Poster'

type Publication = {
  name: string
  type: Publication_Type
  link: string
	doi: string
  year: number
}

export const PUBLICATIONS : Publication[] = []
