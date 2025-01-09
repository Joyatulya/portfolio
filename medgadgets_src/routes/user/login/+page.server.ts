import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export const actions = {
  login: async (event) => {
    throw redirect(302, '/')
  },
  register: async (event) => {
    const data = await event.request.formData()
    console.log(data.get('name'))
  }
  // default: async (event) => {
  //  console.log('this ran', event) 
  // },
}