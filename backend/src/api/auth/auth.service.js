import {
  CustomError,
  addToCurrentDate,
  isDateInThePast,
  sendEmail,
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  generateOTP,
} from "../../utils/index.js"
import { StatusCodes } from "http-status-codes"
import config from "../../config/index.js"
import db from "../../models/index.js"
import bcrypt from "bcrypt"
import crypto from "crypto"

const { User, Token, sequelize } = db

export const verifyEmail = async (email, code) => {
  const user = await User.findOne({
    where: { email },
    attributes: ["emailVerified", "emailConfirmationCode", "emailCodeExpiresAt"],
    raw: true,
  })
  if (!user) throw new CustomError(StatusCodes.UNAUTHORIZED, "Email not found.")

  if (user.emailVerified) throw new CustomError(StatusCodes.BAD_REQUEST, "Email already verified")

  const isValidCode = user.emailConfirmationCode === code
  if (!isValidCode) throw new CustomError(StatusCodes.BAD_REQUEST, "Invalid code")

  const isCodeExpired = isDateInThePast(user.emailCodeExpiresAt)
  if (isCodeExpired) throw new CustomError(StatusCodes.BAD_REQUEST, "Code expired")

  await User.update(
    { emailVerified: true, emailConfirmationCode: null, emailCodeExpiresAt: null },
    { where: { email } },
  )
  logger.info("Email verified successfully")
}

export const login = async (email, password) => {
  const user = await User.findOne({
    where: { email },
    attributes: [["userId", "id"], "password"],
    raw: true,
  })
  if (!user) throw new CustomError(StatusCodes.UNAUTHORIZED, "Email not found.")

  const isValidPassword = await bcrypt.compare(password, user.password)
  if (!isValidPassword)
    throw new CustomError(StatusCodes.UNAUTHORIZED, "Incorrect email or password")

  const accessToken = generateAccessToken({ userId: user.id })
  const refreshToken = generateRefreshToken()

  await Token.create({
    userId: user.id,
    token: refreshToken,
    type: config.constants.tokenTypes.REFRESH,
    expiresAt: addToCurrentDate(config.auth.refreshTokenExpiration, "seconds"),
  })

  return {
    accessToken,
    refreshToken,
    expiresIn: config.auth.accessTokenExpiration,
  }
}

export const forgotPassword = async (email) => {
  const user = await User.findOne({
    where: { email },
    attributes: [["userId", "id"], "firstName"],
    raw: true,
  })
  if (!user) throw new CustomError(StatusCodes.BAD_REQUEST, "Email not found.")

  const resetToken = generateResetToken()
  const hashedResetToken = crypto.createHash("md5").update(resetToken).digest("hex")

  const tokenPayload = {
    userId: user.id,
    token: hashedResetToken,
    type: config.constants.tokenTypes.RESET,
    expiresAt: addToCurrentDate(config.auth.resetTokenExpiration, "seconds"),
  }

  // only one reset password link can be active at a time
  const token = await Token.findOne({
    where: { userId: user.id, type: config.constants.tokenTypes.RESET },
    raw: true,
  })

  if (!token) {
    await Token.create(tokenPayload)
  } else {
    await Token.update(tokenPayload, {
      where: { userId: user.id, type: config.constants.tokenTypes.RESET },
    })
  }

  await sendForgotPasswordEmail(email, {
    name: user.firstName,
    link: `${config.server.host}/reset-password?token=${resetToken}`,
  })
}

const sendForgotPasswordEmail = async (email, payload) => {
  try {
    await sendEmail({
      email,
      subject: "Password Reset",
      payload,
      templateName: "forgotPassword",
    })
  } catch (err) {
    logger.error("Failed to send forgot password email", { err })
  }
}

export const resetPassword = async (token, password) => {
  const hashedToken = crypto.createHash("md5").update(token).digest("hex")
  const passwordResetToken = await Token.findOne({
    where: { token: hashedToken, type: config.constants.tokenTypes.RESET },
    attributes: ["userId", "token"],
    raw: true,
  })
  if (!passwordResetToken) throw new CustomError(StatusCodes.BAD_REQUEST, "Invalid token.")

  const hashedPassword = await bcrypt.hash(password, 10)

  await sequelize.transaction(async (transaction) => {
    await User.update(
      { password: hashedPassword },
      { where: { userId: passwordResetToken.userId }, transaction },
    )

    await Token.destroy({
      where: { token: hashedToken, type: config.constants.tokenTypes.RESET },
      transaction,
    })
  })
  logger.info("Password changed successfully")

  const user = await User.findOne({
    where: { userId: passwordResetToken.userId },
    attributes: ["email", "firstName"],
    raw: true,
  })
  await sendResetPasswordEmail(user.email, { name: user.firstName })
}

const sendResetPasswordEmail = async (email, payload) => {
  try {
    await sendEmail({
      email,
      subject: "Your password was reset",
      payload,
      templateName: "resetPassword",
    })
    logger.info("Password reset email sent successfully")
  } catch (err) {
    logger.error("Failed to send password reset email", { err })
  }
}

export const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findOne({
    where: { userId },
    attributes: ["password", "email", "firstName"],
    raw: true,
  })

  const isValidPassword = await bcrypt.compare(oldPassword, user.password)
  if (!isValidPassword) throw new CustomError(StatusCodes.BAD_REQUEST, "Incorrect password.")

  if (newPassword === oldPassword)
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      "New password cannot be the same as your old password.",
    )

  const hashedPassword = await bcrypt.hash(newPassword, 10)
  await User.update({ password: hashedPassword }, { where: { userId } })

  await sendPasswordChangedEmail(user.email, { name: user.firstName })
}

const sendPasswordChangedEmail = async (email, payload) => {
  try {
    await sendEmail({
      email,
      subject: "Your password changed",
      payload,
      templateName: "changedPassword",
    })
    logger.info("Changed Password email sent successfully")
  } catch (err) {
    logger.error("Failed to send changed password email", { err })
  }
}

export const refreshToken = async (token) => {
  const refreshToken = await Token.findOne({
    where: { token, type: config.constants.tokenTypes.REFRESH },
    attributes: ["userId", "expiresAt"],
    raw: true,
  })
  if (!refreshToken) throw new CustomError(StatusCodes.BAD_REQUEST, "Invalid refresh token.")

  const isTokenExpired = isDateInThePast(refreshToken.expiresAt)
  if (isTokenExpired) {
    await Token.destroy({ where: { token, type: config.constants.tokenTypes.REFRESH } })
    throw new CustomError(StatusCodes.UNAUTHORIZED, "This token has expired.")
  }

  const accessToken = generateAccessToken({ userId: refreshToken.userId })

  return {
    accessToken,
    expiresIn: config.auth.accessTokenExpiration,
  }
}

export const otp = async (email) => {
  const user = await User.findOne({
    where: { email },
    attributes: [["userId", "id"], "email", "firstName"],
    raw: true,
  })
  if (!user) throw new CustomError(StatusCodes.BAD_REQUEST, "Email not found.")

  const otp = generateOTP()
  const hashedOtp = await bcrypt.hash(otp, 10)
  const tokenPayload = {
    userId: user.id,
    token: hashedOtp,
    type: config.constants.tokenTypes.PASSWORDLESS,
    expiresAt: addToCurrentDate(config.auth.otpExpiration, "seconds"),
  }

  const token = await Token.findOne({
    where: { userId: user.id, type: config.constants.tokenTypes.PASSWORDLESS },
  })

  if (!token) {
    await Token.create(tokenPayload)
  } else {
    await Token.update(tokenPayload, {
      where: { userId: user.id, type: config.constants.tokenTypes.PASSWORDLESS },
    })
  }

  await sendOTPEmail(user.email, {
    name: user.firstName,
    link: `${config.server.host}/passwordless-login?otp=${otp}`,
  })
}

const sendOTPEmail = async (email, payload) => {
  try {
    await sendEmail({
      email,
      subject: "You Magic Link",
      payload,
      templateName: "passwordlessLogin",
    })
    logger.info("OTP email sent successfully")
  } catch (err) {
    logger.error("Failed to send otp email", { err })
  }
}

export const passwordlessLogin = async (email, otp) => {
  const user = await User.findOne({
    where: { email },
    attributes: [["userId", "id"]],
    raw: true,
  })
  if (!user) throw new CustomError(StatusCodes.UNAUTHORIZED, "Email not found.")

  const token = await Token.findOne({
    where: { userId: user.id, type: config.constants.tokenTypes.PASSWORDLESS },
  })
  if (!token) throw new CustomError(StatusCodes.UNAUTHORIZED, "Incorrect email or password")

  const isValidOtp = await bcrypt.compare(otp, token.token)
  if (!isValidOtp) throw new CustomError(StatusCodes.UNAUTHORIZED, "Incorrect email or password")

  const accessToken = generateAccessToken({ userId: user.id })
  const refreshToken = generateRefreshToken()

  await sequelize.transaction(async (transaction) => {
    await Token.destroy({
      where: { userId: user.id, type: config.constants.tokenTypes.PASSWORDLESS },
      transaction,
    })

    await Token.create(
      {
        userId: user.id,
        token: refreshToken,
        type: config.constants.tokenTypes.REFRESH,
        expiresAt: addToCurrentDate(config.auth.refreshTokenExpiration, "seconds"),
      },
      { transaction },
    )
  })

  return {
    accessToken,
    refreshToken,
    expiresIn: config.auth.accessTokenExpiration,
  }
}
