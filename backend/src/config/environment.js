import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import { logger } from "../loaders/logger.js"

process.env.NODE_ENV = process.env.NODE_ENV || "local"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envFilename = process.env.NODE_ENV === "local" ? ".env" : `.env.${process.env.NODE_ENV}`
const envPath = path.resolve(`${__dirname}/../../${envFilename}`)

const envFile = dotenv.config({ path: envPath })
if (envFile.error) {
  logger.error(`Missing environment file: ${envFilename}`)
  process.exit(1)
}
