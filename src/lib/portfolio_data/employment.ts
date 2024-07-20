type Portfolio_Reference = {
	name : string
	phone? : string
	email?: string
	place : Employment_Place
	position : string
	relation? : string // Like ES, CS etc
}

type Employment_Place = {
	name : string
	phone? : string
	email? : string
	city : string
	country: string
}
