import { db } from '$lib/db.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({locals : {supabase}}) {
    
    const {data : patient, error} = await db.from('Patient').select()
    console.log(patient)
    return {patient : patient};
};