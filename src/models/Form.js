const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Form = sequelize.define(
  'forms', {
    id_form: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    topic: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
    },
    is_open: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    limit_users: {
      type: DataTypes.INTEGER,
    }
  },
  {
    tableName: 'forms',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true
  },
);

module.exports = Form;
