import express from "express"
import "express-async-errors"
import cors from "cors"
import apiRoutes from "./loaders/routes.js"
import { errorLogger, errorHandler, errorNotFound, httpLogger } from "./middlewares/index.js"
import rTracer from "cls-rtracer"
import "./config/index.js"
import "./loaders/logger.js"

const app = express()

app.use(express.json())

app.use(rTracer.expressMiddleware())

app.use(cors())

app.use(httpLogger)

app.use("/api", apiRoutes)

app.use(errorNotFound, errorLogger, errorHandler)

export default app
