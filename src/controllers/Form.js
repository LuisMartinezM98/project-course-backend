const sequelize = require("../config/db");
const Form = require("../models/Form");
const Question = require("../models/Question");
const { createQuestionFromForm } = require("./Question");

const createForm = async (req, res) => {
  // const { form } = req.body;
  const { user } = req;

  const { topic, title, description, newQuestions, numberUsers } = req.body;

  try {
    const objData = {
      topic,
      limit_users: numberUsers,
      user_id: user.id_user,
      title,
      description,
    };
    const formCreated = await Form.create(objData);
    await createQuestionFromForm(newQuestions, formCreated.dataValues.id_form);
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
      SELECT 
    f.*, 
    u.*, 
    COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'id_question', q.id_question,
                'question_text', q.question,
                'type_question', jsonb_build_object(
                    'id_type_question', tq.id_type_question,
                    'type_name', tq.type_question
                ),
                'options', COALESCE(
                    (
                        SELECT jsonb_agg(
                            jsonb_build_object(
                                'id_option', qo.id_option,
                                'option_text', qo.option_question
                            )
                        )
                        FROM question_options AS qo
                        WHERE qo.question_id = q.id_question
                    ), '[]'
                )
            )
        ) FILTER (WHERE q.id_question IS NOT NULL), '[]'
    ) AS questions
      FROM 
          forms AS f
      JOIN 
          users AS u ON f.user_id = u.id_user
      LEFT JOIN 
          questions AS q ON f.id_form = q.form_id
      LEFT JOIN 
          type_questions AS tq ON q.type_question_id = tq.id_type_question
      WHERE 
          f.user_id = :userId
      GROUP BY 
          f.id_form, u.id_user
      ORDER BY 
          f.created_at DESC
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

const getLastForms = async(req, res) => {
  try {
    const lastForms = await sequelize.query(
      `
      SELECT 
        f.id_form,
        f.title,
        f.created_at,
        u.id_user,
        u.name,
        u.email,
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'id_question', q.id_question,
                    'question_text', q.question,
                    'type_question', jsonb_build_object(
                        'id_type_question', tq.id_type_question,
                        'type_name', tq.type_question
                    ),
                    'options', COALESCE(
                        (
                            SELECT jsonb_agg(
                                jsonb_build_object(
                                    'id_option', qo.id_option,
                                    'option_text', qo.option_question
                                )
                            )
                            FROM question_options AS qo
                            WHERE qo.question_id = q.id_question
                        ), '[]'
                    )
                )
            ) FILTER (WHERE q.id_question IS NOT NULL), '[]'
        ) AS questions
      FROM 
          forms AS f
      JOIN 
          users AS u ON f.user_id = u.id_user
      LEFT JOIN 
          questions AS q ON f.id_form = q.form_id
      LEFT JOIN 
          type_questions AS tq ON q.type_question_id = tq.id_type_question
      GROUP BY 
          f.id_form, u.id_user
      ORDER BY 
          f.created_at DESC
      LIMIT 10
      `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    
    if (lastForms.length === 0) {
      return res.status(204).json({ msg: "No form found" });
    }
    return res.status(200).json(lastForms);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error retrieving the last form", error });
  }
}

Form.hasMany(Question, { foreignKey: "form_id", as: "questions" });

module.exports = { getLastForm, createForm, getLastForms };
