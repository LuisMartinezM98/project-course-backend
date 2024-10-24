const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Question = require("./Question");
const User = require("./User");
const QuestionOption = require("./QuestionOptions");

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

Answer.belongsTo(Question, { foreignKey: 'question_id' });
Answer.belongsTo(QuestionOption, { foreignKey: 'option_id' });
Answer.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Answer;
