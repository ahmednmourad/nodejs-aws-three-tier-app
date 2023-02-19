import * as User from "./user.service.js"
import { buildUserResponseDTO } from "./user.mapper.js"

export const create = async (req, res) => {
  const { body } = req

  const user = await User.create(body)

  return res.status(201).json({ message: "User created.", data: buildUserResponseDTO(user) })
}

export const getCurrentUser = async (req, res) => {
  const { userId } = req

  const user = await User.getById(userId)

  return res.status(200).json({ message: "User found.", data: buildUserResponseDTO(user) })
}

export const getById = async (req, res) => {
  const { userId } = req.params

  const user = await User.getById(userId)

  return res.status(200).json({ message: "User found.", data: buildUserResponseDTO(user) })
}

export const update = async (req, res) => {
  const { userId, body } = req

  const user = await User.update(userId, body)

  return res.status(200).json({ message: "User updated.", data: buildUserResponseDTO(user) })
}

export const remove = async (req, res) => {
  const { userId } = req

  await User.remove(userId)

  return res.status(200).json({ message: "User removed." })
}
