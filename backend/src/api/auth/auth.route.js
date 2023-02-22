import { Router } from "express"
import { isAuth, validateSchema } from "../../middlewares/index.js"
import * as controllers from "./auth.controller.js"
import * as validations from "./auth.validation.js"

const router = Router()

router
  .post("/email/verify", validateSchema(validations.verifyEmail.body), controllers.verifyEmail)
  .post("/login", validateSchema(validations.login.body), controllers.login)
  .post(
    "/forgot-password",
    validateSchema(validations.forgotPassword.body),
    controllers.forgotPassword,
  )
  .post(
    "/reset-password",
    validateSchema(validations.resetPassword.body),
    controllers.resetPassword,
  )
  .post(
    "/change-password",
    isAuth,
    validateSchema(validations.changePassword.body),
    controllers.changePassword,
  )
  .post("/refresh-token", validateSchema(validations.refreshToken.body), controllers.refreshToken)
  .get("/otp", validateSchema(validations.otp.query, "query"), controllers.otp)
  .post(
    "/passwordless-login",
    validateSchema(validations.passwordlessLogin.body),
    controllers.passwordlessLogin,
  )

export default router
