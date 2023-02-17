import { Sequelize } from "sequelize"
import config from "../config/index.js"

const dbOptions = {
  port: config.db.port,
  host: config.db.host,
  dialect: config.db.dialect,
  dialectOptions: config.db.dialectOptions,
  define: { freezeTableName: true, timestamps: false },
  logging: true,
}
const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  dbOptions,
)

const db = {
  sequelize,
  Sequelize,
}

export default db
