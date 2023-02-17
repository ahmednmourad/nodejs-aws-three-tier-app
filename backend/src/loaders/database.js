import db from "../models/index.js"

const testDbConnection = async () => {
  await db.sequelize.authenticate()
  logger.info("Database is up and running")
}

export { testDbConnection }
