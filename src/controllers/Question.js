const Question = require("../models/Question");
const { createOptionBack } = require("./Option");

const createQuestionFromForm = async (questions, form_id) => {
  try {
    await Promise.all(
      questions.map(async (item) => {
        const { type_question, options, question } = item;

        const objDatos = {
          form_id,
          type_question_id: type_question,
          question
        };

        const questionData = await Question.create(objDatos);
        if (["675aa799-c8ce-49ff-b783-2f401ae839e1", "ee2e80d2-e1b1-42a3-bc77-812e444f5c68"].includes(type_question)) {
          await Promise.all(
            options.map(async (optionItem) => {
              await createOptionBack(
                optionItem,
                questionData.dataValues.id_question
              );
            })
          );
        }
      })
    );
    return true;
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

const createQuestionWhitouthOptions = async(req, res) => {

  const { form_id, question, type_question } = req.body;
  try {

    const objData = {
      form_id,
      question,
      type_question
    }
    await Question.create(objData);
    return res.status(200).send({msg: 'Question created'});
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Something went wrong" });
  }
}

module.exports = { createQuestionFromForm, createQuestionWhitouthOptions };
