const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Form = require("./Form");
const TypeQuestion = require("./TypeQuestion");
const QuestionOption = require("./QuestionOptions");

const Question = sequelize.define(
  "questions",
  {
    id_question: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    form_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    question: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type_question_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "questions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

// Definir asociaciones
// Question.belongsTo(Form, { foreignKey: "form_id" });
// Question.belongsTo(TypeQuestion, { foreignKey: "type_question_id" });
// Question.hasMany(QuestionOption, { foreignKey: "question_id" });

module.exports = Question;
