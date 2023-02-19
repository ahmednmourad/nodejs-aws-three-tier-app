export const buildUserResponseDTO = (user) => ({
  id: user.userId,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  emailVerified: Boolean(user.emailVerified),
  picture: user.picture,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
})
