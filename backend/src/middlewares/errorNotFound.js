import { NotFoundError } from "../utils/errors.js"

export const errorNotFound = (req, res, next) => next(new NotFoundError(req.path))
