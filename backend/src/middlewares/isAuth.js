import jwt from "jsonwebtoken"
import config from "../config/index.js"
import { CustomError } from "../utils/index.js"
import { StatusCodes } from "http-status-codes"

export const isAuth = (req, res, next) => {
  const authHeader = req.header("Authorization")
  if (!authHeader) throw new CustomError(StatusCodes.UNAUTHORIZED, "No authorization header found.")

  const token = authHeader.split("Bearer ")[1] ?? authHeader

  try {
    const decodedToken = jwt.verify(token, config.auth.accessTokenSecretKey)
    if (!decodedToken) throw new CustomError(StatusCodes.UNAUTHORIZED, "Unauthorized")

    req.userId = decodedToken.userId
  } catch (err) {
    logger.error("Authorization error", { err })

    if (err.name === "TokenExpiredError")
      return next(new CustomError(StatusCodes.UNAUTHORIZED, "Token expired"))
    else return next(new CustomError(StatusCodes.UNAUTHORIZED, "Unauthorized"))
  }

  next()
}
