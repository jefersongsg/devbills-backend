import type { FastifyInstance } from 'fastify'
import categoryRoutes from './category.routes';
import transactionRoutes from './transaction.routes';

async function routes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/', async () => {
    return { hello: 'world' }
  });

  fastify.register(categoryRoutes, { prefix: '/categories' })
  fastify.register(transactionRoutes, { prefix: '/transactions' })

}

export default routes