import Fastify from 'fastify'
import routes from './routes'
import type { FastifyInstance } from 'fastify'
import { env } from './config/env'

const app: FastifyInstance = Fastify(
    { logger: {
        level: env.NODE_ENV === 'dev' ? 'info' : 'error',
    } }
)

app.register(routes,{prefix: '/api'})//tem que colocar prefix para que as rotas funcionem

export default app