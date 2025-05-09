import app from './app'
import dotenv from 'dotenv'
dotenv.config()

const PORT = Number(process.env.PORT || 3000)

const startServer = async () => {
  try {
    await app.listen({ port: PORT }).then(() => {
      console.log(`Server listening on port ${PORT}`)
    })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
startServer()