import { Umzug, SequelizeStorage } from "umzug"
import db from "../models/index.js"
import path from "path"
import { fileURLToPath } from "url"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const umzug = new Umzug({
  migrations: { glob: ["migrations/**.{js,ts,cjs}", { cwd: path.resolve(__dirname, "../") }] },
  context: db.sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize: db.sequelize, modelName: "migration" }),
  logger: console,
})

const logUmzugEvent = (eventName) => (event) => console.log(`${event.name} ${eventName}`)
umzug.on("migrating", logUmzugEvent("migrating"))
umzug.on("migrated", logUmzugEvent("migrated"))
umzug.on("reverting", logUmzugEvent("reverting"))
umzug.on("reverted", logUmzugEvent("reverted"))

await umzug.up()
