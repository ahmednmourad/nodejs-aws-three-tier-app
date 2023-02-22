import crypto from "crypto"
import jwt from "jsonwebtoken"
import config from "../config/index.js"
import { nanoid, customAlphabet } from "nanoid"
import { alphanumeric } from "nanoid-dictionary"

/**
 * Will generate a random number of specific length
 * e.g. if length is 4 it will give a number between 1000 to 9999 (inclusive)
 * @param {number} length - length of the generated numbers
 * @returns {number}
 */
export const generateRandomNumber = (length) => {
  // This function will ignore numbers less than the min value
  const min = Math.pow(10, length - 1)
  const max = min * 9
  return Math.floor(min + Math.random() * max)
}

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.auth.accessTokenSecretKey, {
    expiresIn: config.auth.accessTokenExpiration,
  })
}

export const generateRefreshToken = () => nanoid(48)

export const generateResetToken = () => customAlphabet(alphanumeric, 32)()

export const generateOTP = () => crypto.randomBytes(32).toString("hex")
