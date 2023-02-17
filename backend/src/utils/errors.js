import { StatusCodes } from "http-status-codes"

export class CustomError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.name = this.constructor.name // Ensure the name of this error is the same as the class name

    this.statusCode = statusCode
    this.customMessage = message
  }
}

export class ValidationError extends CustomError {
  constructor(errors) {
    super(StatusCodes.BAD_REQUEST, "Validation error")
    this.errors = errors
  }
}

export class NotFoundError extends CustomError {
  constructor(path) {
    super(StatusCodes.NOT_FOUND, `The requested path ${path} not found!`)
  }
}
