const Question = require("../models/Question");
const { createOptionBack } = require("./Option");

const createQuestionFromForm = async (questions, form_id) => {
  try {
    await Promise.all(
      questions.map(async (item) => {
        const { type_question, options, ...restData } = item;

        const objDatos = {
          form_id,
          type_question,
          ...restData,
        };

        const question = await Question.create(objDatos);
        if (type_question == 1) {
          await Promise.all(
            options.map(async (optionItem) => {
              await createOptionBack(
                optionItem,
                question.dataValues.id_question
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
