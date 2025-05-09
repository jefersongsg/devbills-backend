import type { FastifyInstance } from 'fastify'

async function routes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/', async () => {
    return { hello: 'world' }
  })
}
export default routes