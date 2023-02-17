export default (sequelize, Sequelize) => {
  const Token = sequelize.define("token", {
    token: { type: Sequelize.STRING },
    type: { type: Sequelize.STRING },
    userId: {
      type: Sequelize.UUID,
      references: { model: "User", key: "userId" },
      allowNull: false,
      onDelete: "CASCADE",
    },
    expiresAt: { type: Sequelize.DATE, allowNull: false },
  })
  return Token
}
