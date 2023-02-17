export default (sequelize, Sequelize) => {
  const User = sequelize.define(
    "user",
    {
      userId: { type: Sequelize.UUID, primaryKey: true },
      firstName: { type: Sequelize.STRING, allowNull: false },
      lastName: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, unique: true, allowNull: false },
      password: { type: Sequelize.STRING, allowNull: false },
      picture: { type: Sequelize.STRING },
      emailConfirmationCode: { type: Sequelize.STRING },
      emailCodeExpiresAt: { type: Sequelize.DATE },
      emailVerified: { type: Sequelize.BOOLEAN, defaultValue: false },
    },
    { timestamps: true },
  )
  return User
}
