import "./environment.js"
export default {
  app: {
    port: process.env.PORT ?? 3000,
    host: process.env.HOST ?? "localhost",
  },
  db: {
    host: process.env.DB_HOSTNAME,
    username: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: "3306",
    dialect: "mysql",
    dialectOptions: { flags: "FOUND_ROWS" },
  },
}
