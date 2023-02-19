import {
  CustomError,
  generateRandomNumber,
  addToCurrentDate,
  sendEmail,
} from "../../utils/index.js"
import { StatusCodes } from "http-status-codes"
import db from "../../models/index.js"
import config from "../../config/index.js"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcrypt"

const { User } = db

export const create = async (user) => {
  const doesEmailExist = await User.findOne({ where: { email: user.email }, attributes: ["email"] })
  if (doesEmailExist) throw new CustomError(StatusCodes.BAD_REQUEST, "Email already exists")

  const payload = {
    userId: uuidv4(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: await bcrypt.hash(user.password, 10),
    emailConfirmationCode: generateRandomNumber(6),
    emailCodeExpiresAt: addToCurrentDate(config.auth.emailCodeExpirationInSeconds, "seconds"),
  }
  const result = await User.create(payload)
  logger.info(`User ${payload.userId} created successfully`)

  await sendConfirmationCodeEmail(user.email, {
    confirmationCode: payload.emailConfirmationCode,
    codeExpirationInMinutes: config.auth.emailCodeExpirationInSeconds / 60,
  })

  return result
}

const sendConfirmationCodeEmail = async (email, payload) => {
  try {
    await sendEmail({ email, subject: "Email Confirmation", payload, templateName: "confirmEmail" })
    logger.info("Confirmation email sent successfully")
  } catch (err) {
    logger.info("Failed to send confirmation email", { err })
  }
}

export const getById = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: [
      "userId",
      "firstName",
      "lastName",
      "email",
      "picture",
      "emailVerified",
      "createdAt",
      "updatedAt",
    ],
  })
  if (!user) throw new CustomError(404, "User not found")
  return user
}

export const update = async (userId, user) => {
  const payload = {
    firstName: user.firstName,
    lastName: user.lastName,
    picture: user.picture,
  }

  if (user.email) {
    const doesEmailExist = await User.findOne({
      where: { email: user.email },
      attributes: ["email"],
    })
    if (doesEmailExist) throw new CustomError(StatusCodes.BAD_REQUEST, "Email already exists")

    payload.email = user.email
    payload.emailVerified = false
    payload.emailConfirmationCode = generateRandomNumber(6)
    payload.emailCodeExpiresAt = addToCurrentDate(
      config.auth.emailCodeExpirationInSeconds,
      "seconds",
    )
  }

  const [updatedRows] = await User.update(payload, { where: { userId } })
  if (updatedRows === 0) throw new CustomError(StatusCodes.NOT_FOUND, "User not found")
  logger.info(`User ${userId} updated successfully`)

  if (user.email) {
    await sendConfirmationCodeEmail(user.email, {
      confirmationCode: payload.emailConfirmationCode,
      codeExpirationInMinutes: config.auth.emailCodeExpirationInSeconds / 60,
    })
  }

  return await getById(userId)
}

export const remove = async (userId) => {
  logger.info(`Deleting user ${userId}`)
  const result = await User.destroy({ where: { userId } })
  if (!result) throw new CustomError(StatusCodes.NOT_FOUND, "User not found")
  logger.info(`User ${userId} deleted successfully`)
}
