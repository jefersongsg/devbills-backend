import app from './app'
import { env } from './config/env'
import { prismaConnect } from './config/prisma'
import { initializeGlobalCategories } from './services/globalCategories.services'

const PORT = env.PORT

const startServer = async () => {
  try {
    await prismaConnect();

    await initializeGlobalCategories();

    await app.listen({ port: PORT }).then(() => {
      console.log(`Server listening on port ${PORT}`)
    })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
startServer()