const { Sequelize } = require("sequelize")

exports.up = async ({ context: queryInterface }) => {
  await queryInterface.createTable("user", {
    userId: { type: Sequelize.UUID, primaryKey: true },
    firstName: { type: Sequelize.STRING, allowNull: false },
    lastName: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, unique: true, allowNull: false },
    password: { type: Sequelize.STRING, allowNull: false },
    picture: { type: Sequelize.STRING },
    emailConfirmationCode: { type: Sequelize.STRING },
    emailCodeExpiresAt: { type: Sequelize.DATE },
    emailVerified: { type: Sequelize.BOOLEAN, defaultValue: false },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
    },
  })

  await queryInterface.createTable("token", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
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
}

exports.down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("token")
  await queryInterface.dropTable("user")
}
