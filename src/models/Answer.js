const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Answer = sequelize.define(
  'answers', {
    id_answer: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    question_id: {
      type: DataTypes.UUID,
    },
    option_id: {
      type: DataTypes.UUID
    },
    user_id: {
      type: DataTypes.UUID
    },
    answer: {
      type: DataTypes.STRING(255),
    }
  },
  {
    tableName: 'answers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true
  }
);

module.exports = Answer;
