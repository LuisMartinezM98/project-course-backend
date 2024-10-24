const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Question = require("./Question");

const QuestionOption = sequelize.define('question_options', {
  id_option: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  option_question: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  question_id: {
    type: DataTypes.UUID,
  },
}, {
  tableName: 'question_options',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true
});

// QuestionOption.belongsTo(Question, { foreignKey: 'question_id' });

module.exports = QuestionOption;
