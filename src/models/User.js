const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Form = require("./Form");
const TypeAccount = require("./TypeAccount");


const User = sequelize.define(
  "users",
  {
    id_user: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(255),
    },
    email: {
      type: DataTypes.STRING(255),
    },
    password: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    last_conection: {
      type: DataTypes.DATE,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    type_account_id: {
      type: DataTypes.UUID,
      references: {
        model: TypeAccount,
        key: "id_type_account",
      },
    },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

User.belongsTo(TypeAccount, { foreignKey: "type_account_id" });

module.exports = User;
