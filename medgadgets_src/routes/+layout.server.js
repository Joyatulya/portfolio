import { env } from '$env/dynamic/private';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals: { getSession, getUser } }) {
	return { analyticsId: env.VERCEL_ANALYTICS_ID, session: await getSession() };
}
