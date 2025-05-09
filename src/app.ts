import Fastify from 'fastify'
import routes from './routes'
import type { FastifyInstance } from 'fastify'

const app: FastifyInstance = Fastify(
    { logger: true }
)

app.register(routes)

export default app