import * as Health from "./health.service.js"

export const healthCheck = (req, res) => {
  const health = Health.check()

  return res.status(200).json(health)
}
