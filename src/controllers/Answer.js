const sequelize = require("../config/db");
const Answer = require("../models/Answer");
const Question = require("../models/Question");
const QuestionOption = require("../models/QuestionOptions");
const User = require("../models/User");

const getAnswers = async(req, res) => {
    const { id_question } = req.query;

    try {
        const answers = await Answer.findAll({
            where: {
              question_id: id_question,
            },
            include: [
              {
                model: Question,
                attributes: ['id_question', 'question'],
              },
              {
                model: QuestionOption,
                attributes: ['id_option', 'option_question'],
              },
              {
                model: User,
                attributes: ['id_user', 'name'],
              },
            ],
          });
      if(answers.length === 0){
        return res.status(204).json({ msg: "No form found" });
      }
      return res.status(200).json(answers);
    } catch (error) {
        console.log(error);
        return res
      .status(500)
      .json({ message: "Error retrieving answers", error });
    }
}

module.exports = { getAnswers }