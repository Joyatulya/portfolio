import {  Github, InstagramIcon, LinkedinIcon, LucideInstagram } from "lucide-svelte"
import type { SvelteComponent } from "svelte"

const year_of_birth = 1996

type social = {
	name: string
	link: string
	logo?: SvelteComponent
}

export const SOCIALS: social[] = [
	{
		name: 'LinkedIn', link: 'https://www.linkedin.com/in/abhishek-singh-9b8b211b7', logo: LinkedinIcon
	},
	{ name: 'Orcid', link: 'https://orcid.org/0000-0002-2587-6982',  },
	{ name: 'ResearchGate', link: 'https://www.researchgate.net/profile/Abhishek_Singh' },
	{ name: 'Github', link: 'https://github.com/joyatuyla', logo: Github },
	{ name: 'Instagram', link: 'insta', logo: LucideInstagram},
]
