import app from './app'
import dotenv from 'dotenv'
import { prismaConnect } from './config/prisma'
import { initializeGlobalCategories } from './services/globalCategories.services'
dotenv.config()

const PORT = Number(process.env.PORT || 3000)

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