import { endpoints, type ListResponse, type PromptResponse } from '$lib/endpoints'
import type { Actions } from './$types'

type LoadResponse = {
	status: number
	body?: ListResponse
}

type SubmissionResponse = {
	status: number
	body?: PromptResponse
}

export const load = async ({ cookies }) => {
	const token = cookies.get('__Secure-next-auth.session-token')

	if (!token) {
		return {
			status: 401
		} satisfies LoadResponse
	}

	const response = await fetch(endpoints.list({ limit: 10 }), {
		headers: {
			Authorization: `Bearer ${token}`
		}
	})

	const body = await response.json()

	return {
		status: response.status,
		body
	} satisfies LoadResponse
}

export const actions = {
	default: async (event) => {
		const token = event.cookies.get('__Secure-next-auth.session-token')
		console.log(token)

		if (!token) {
			return {
				status: 401
			} satisfies SubmissionResponse
		}
		const formData = await event.request.formData()
		// TODO make a call to the prompt API
		console.log(formData.get('prompt'))

		const response = await event.fetch(endpoints.prompt(), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				prompt: formData.get('prompt')
			})
		})

		const body = await response.json()
		console.log(body)

		return {
			status: response.status,
			body
		} satisfies SubmissionResponse
	}
} satisfies Actions
