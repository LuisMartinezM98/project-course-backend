const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const TypeQuestion = require("./TypeQuestion");
const Form = require("./Form");
const QuestionOption = require("./QuestionOptions");
const Question = require("./Question");
const User = require("./User");

const syncModels = async () => {
    // Define asociaciones
    User.hasMany(Form, { foreignKey: 'user_id' });
    Form.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id_user' });

    Form.hasMany(Question, { foreignKey: 'form_id', as: 'questions' });
    Question.belongsTo(Form, { foreignKey: 'form_id' });

    Question.belongsTo(TypeQuestion, { foreignKey: 'type_question_id' });
    TypeQuestion.hasMany(Question, { foreignKey: 'type_question_id' });

    Question.hasMany(QuestionOption, { foreignKey: 'question_id' });
    QuestionOption.belongsTo(Question, { foreignKey: 'question_id' });

    // Sincronizar modelos
    try {
        await sequelize.sync({ force: true });
        console.log("Sincronización completada.");
    } catch (error) {
        console.error("Error al sincronizar:", error);
    }
};

module.exports = syncModels;

