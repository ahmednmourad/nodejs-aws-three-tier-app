import app from "./app.js"
import http from "http"
import config from "./config/index.js"
import { testDbConnection } from "./loaders/database.js"

await testDbConnection()

const server = http.createServer(app)

server.listen(config.app.port, () => {
  logger.info(`Server running on http://${config.app.host}:${config.app.port}`)
})

process.on("unhandledRejection", (err, _) => {
  logger.error("Unhandled Rejection", { err })
})

process.on("uncaughtException", (err) => {
  logger.error("Unhandled Exception", { err })
})
