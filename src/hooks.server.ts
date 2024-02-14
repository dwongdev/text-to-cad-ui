import { error, redirect } from '@sveltejs/kit'
import { AUTH_COOKIE_NAME } from '$lib/cookies'
import { users, Client } from '@kittycad/lib'
import { SIGN_OUT_PARAM } from '$lib/paths'
import { PLAYWRIGHT_MOCKING_HEADER } from '$lib/consts'
import { hooksUserMocks, isUserMock } from '$lib/mocks'
const unProtectedRoutes = ['/']

const domain = import.meta.env.DEV ? 'localhost' : '.zoo.dev'

export const handle = async ({ event, resolve }) => {
	const mock = event.request.headers.get(PLAYWRIGHT_MOCKING_HEADER)
	const token = event.cookies.get(AUTH_COOKIE_NAME)
	if (!token && !unProtectedRoutes.includes(event.url.pathname)) {
		throw redirect(303, '/')
	} else if (!token) {
		return resolve(event)
	}

	// We need to tell the client to use the right base URL
	if (import.meta.env.MODE !== 'production') {
		// Set the env variable BASE_URL to import.meta.env.VITE_API_BASE_URL.
		// This will be used by the client to make requests to the API.
		process.env.BASE_URL = import.meta.env.VITE_API_BASE_URL + '/'
	}
	const client = new Client(token)
	const currentUser = await users.get_user_self({ client }).catch((e) => {
		throw error(500, e)
	})

	if (!currentUser) {
		event.locals.user = undefined
		if (!unProtectedRoutes.includes(event.url.pathname)) throw redirect(303, '/')
	} else {
		if ('error_code' in currentUser) throw error(500, currentUser)

		event.locals.user = currentUser
		if (mock !== null) {
			const userMock = isUserMock(mock)
			event.locals.user = userMock ? hooksUserMocks[userMock](currentUser) : currentUser
		}
	}

	const query = event.url.searchParams.get(SIGN_OUT_PARAM)

	if (Boolean(query) == true) {
		event.cookies.delete(AUTH_COOKIE_NAME, { domain, path: '/' })
		event.url.searchParams.delete(SIGN_OUT_PARAM)
		throw redirect(303, '/')
	}
	return resolve(event)
}
