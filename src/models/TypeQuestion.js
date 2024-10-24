const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Question = require("./Question");

const TypeQuestion = sequelize.define(
  'type_questions', {
    id_type_question: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    type_question: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: 'type_questions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true
  }
);

// TypeQuestion.hasMany(Question, { foreignKey: 'type_question_id' });

module.exports = TypeQuestion;
