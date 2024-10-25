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

const setAnswers = async (req, res) => {
  const { answers } = req.body;
  const { user } = req;

  try {
    for (const item of answers) {
      if (['675aa799-c8ce-49ff-b783-2f401ae839e1', 'ee2e80d2-e1b1-42a3-bc77-812e444f5c68'].includes(item.type_question)) {
        const option = await QuestionOption.findByPk(item.answer);
        const objData = {
          question_id: item.question_id,
          user_id: user.id_user,
          option_id: item.answer,
          answer: option ? option.dataValues.option_question : 'Option not found',
        };
        await Answer.create(objData);
      } else {
        const objData = {
          question_id: item.question_id,
          user_id: user.id_user,
          answer: item.answer,
        };
        await Answer.create(objData);
      }
    }
    return res.status(200).send({ msg: 'Answers created' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: 'Error saving answers' });
  }
};




module.exports = { getAnswers, setAnswers }