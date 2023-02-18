import app from "./app.js"
import http from "http"
import config from "./config/index.js"
import { testDbConnection } from "./loaders/database.js"

await testDbConnection()

const server = http.createServer(app)

server.listen(config.server.port, () => {
  logger.info(`Server running on http://${config.server.host}:${config.server.port}`)
})

process.on("unhandledRejection", (err, _) => {
  logger.error("Unhandled Rejection", { err })
})

process.on("uncaughtException", (err) => {
  logger.error("Unhandled Exception", { err })
})
