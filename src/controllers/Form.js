const sequelize = require("../config/db");
const Form = require("../models/Form");
const Question = require("../models/Question");
const { createQuestionFromForm } = require("./Question");

const createForm = async (req, res) => {
  const { topic, limit_users, questions } = req.body;
  const { user } = req;

  try {
    const objData = {
      topic,
      limit_users,
      user_id: user.id_user,
    };

    const formCreated = await Form.create(objData);
    await createQuestionFromForm(questions, formCreated.dataValues.id_form);
    return res.status(201).send({ msg: "Form created" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Error creating form" });
  }
};

const getLastForm = async (req, res) => {
  try {
    const { user } = req;
    const { id_user } = user;

    const lastForm = await sequelize.query(
      `
      SELECT f.*, u.*, q.*, tq.*, qo.*
      FROM forms AS f
      JOIN users AS u ON f.user_id = u.id_user
      LEFT JOIN questions AS q ON f.id_form = q.form_id
      LEFT JOIN type_questions AS tq ON q.type_question_id = tq.id_type_question
      LEFT JOIN question_options AS qo ON q.id_question = qo.question_id
      WHERE f.user_id = :userId
      ORDER BY f.created_at DESC
      LIMIT 1
      `,
      {
        replacements: { userId: id_user },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (lastForm.length === 0) {
      return res.status(204).json({ msg: "No form found" });
    }
    
    return res.status(200).json(lastForm[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving the last form", error });
  }
};


Form.hasMany(Question, { foreignKey: 'form_id', as: 'questions' });

module.exports = { getLastForm, createForm };
