export const errorLogger = (err, req, res, next) => {
  logger.error(err)
  next(err)
}
