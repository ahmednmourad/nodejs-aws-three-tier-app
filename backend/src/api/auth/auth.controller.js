import * as Auth from "./auth.service.js"

export const verifyEmail = async (req, res) => {
  const { email, code } = req.body

  await Auth.verifyEmail(email, code)

  return res.status(200).json({ message: "Email verified successfully" })
}

export const login = async (req, res) => {
  const { email, password } = req.body

  const result = await Auth.login(email, password)

  return res.status(200).json({ message: "Login successful", data: result })
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body

  await Auth.forgotPassword(email)

  return res.status(200).json({ message: "password reset link sent to your email account" })
}

export const resetPassword = async (req, res) => {
  const { token, password } = req.body

  await Auth.resetPassword(token, password)

  return res.status(200).json({ message: "Password reset successfully" })
}

export const changePassword = async (req, res) => {
  const { userId } = req
  const { oldPassword, newPassword } = req.body

  await Auth.changePassword(userId, oldPassword, newPassword)

  return res.status(200).json({ message: "Password changed successfully" })
}

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body

  const payload = await Auth.refreshToken(refreshToken)

  return res.status(200).json({ message: "Success", data: payload })
}

export const otp = async (req, res) => {
  const { email } = req.query
  const decodedEmail = decodeURIComponent(email)

  await Auth.otp(decodedEmail)

  return res.status(200).json({ message: "Passwordless Login verification link sent successfully" })
}

export const passwordlessLogin = async (req, res) => {
  const { email, otp } = req.body

  const result = await Auth.passwordlessLogin(email, otp)

  return res.status(200).json({ message: "Passwordless Login successful", data: result })
}
