import "./environment.js"
export default {
  server: {
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
  auth: {
    accessTokenSecretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
    accessTokenExpiration: 1800, // 30 min
    refreshTokenExpiration: 31536000, // 1 year
    resetTokenExpiration: 3600, // 1 hour
    otpExpiration: 3600, // 1 hour
    emailCodeExpirationInSeconds: 3600, // 1 hour
  },
  constants: {
    tokenTypes: {
      REFRESH: "REFRESH",
      PASSWORDLESS: "PASSWORDLESS",
      RESET: "RESET",
    },
  },
  emails: {
    apiKey: process.env.SENDINBLUE_API_KEY,
    fromName: process.env.MAIL_FROM_NAME,
    fromEmail: process.env.MAIL_FROM_EMAIL,
  },
}
