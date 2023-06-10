import { Router, IRequest } from 'itty-router'
import { Env } from './env'
import { searchProfessors } from './graphql'

function defaultHeaders(env: Env) {
	return {
		'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN
	}
}

const router = Router()

router.get('/professors/search', async (request: IRequest, env: Env, ctx: ExecutionContext) => {
	if (request.headers.get('Origin') !== env.ALLOWED_ORIGIN) {
		return new Response('unauthorized', { status: 401, headers: defaultHeaders(env) })
	}

	const query = request.query.query
	if (!query) {
		return new Response('bad request', { status: 400, headers: defaultHeaders(env) })
	} else if (Array.isArray(query)) {
		return new Response('only one query may be specified', { status: 400, headers: defaultHeaders(env) })
	}

	const [status, res] = await searchProfessors(query, env)
	if (status >= 400) {
		return Response.json({
			error: `Upstream request failed with status code ${status}`,
			details: res
		}, {
			status: 502,
			headers: defaultHeaders(env)
		})
	}
	return Response.json(res, { headers: defaultHeaders(env) })
})

router.all('*', (request: IRequest, env: Env, ctx: ExecutionContext) => {
	return new Response('not found', { status: 404, headers: defaultHeaders(env) })
})

export default {
	fetch: router.handle
}
