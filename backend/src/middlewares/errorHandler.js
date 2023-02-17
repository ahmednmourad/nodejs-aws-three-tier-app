import { StatusCodes } from "http-status-codes"
import { ValidationError } from "../utils/index.js"

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR
  const message = err.customMessage ?? "Something went wrong."

  const response = { message }
  if (err instanceof ValidationError) response.errors = err.errors

  return res.status(statusCode).json(response)
}
