const sequelize = require("../config/db");
const Form = require("../models/Form");
const Question = require("../models/Question");
const QuestionOption = require("../models/QuestionOptions");
const TypeQuestion = require("../models/TypeQuestion");
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

const getLastForms = async (req, res) => {
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
};

const getSpecificForm = async (req, res) => {
  const { id_form } = req.query;

  try {
    const form = await sequelize.query(
      `
      SELECT 
        f.id_form,
        f.title,
        f.created_at,
        f.topic,
        f.description,
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
      WHERE 
          f.id_form = :id_form
      GROUP BY 
          f.id_form, u.id_user
      ORDER BY 
          f.created_at DESC
      LIMIT 1
      `,
      {
        replacements: { id_form },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return res.status(200).send(form[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something was wrong");
  }
};

const getMyForms = async (req, res) => {
  const { user } = req;
  const { id_user, type_account } = user;
  try {
    if (type_account.type_account == "admin") {
      const myforms = await sequelize.query(
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
        GROUP BY 
            f.id_form, u.id_user
        ORDER BY 
            f.created_at DESC
        `,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );
      if (myforms.length === 0) {
        return res.status(204).json({ msg: "No form found" });
      }
      return res.status(200).send(myforms);
    }
    const myforms = await sequelize.query(
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
      `,
      {
        replacements: { userId: id_user },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (myforms.length === 0) {
      return res.status(204).json({ msg: "No form found" });
    }
    return res.status(200).send(myforms);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving the last form", error });
  }
};

async function getFormsUser(req, res) {
  try {
    const forms = await Form.findAll({
      where: { user_id: req.params.userId },
    });

    // Itera sobre cada formulario para cargar preguntas y opciones
    const formsData = await Promise.all(
      forms.map(async (form) => {
        // Obtener preguntas para el formulario actual
        const questions = await Question.findAll({
          where: { form_id: form.id_form },
        });

        // Procesar cada pregunta y obtener detalles del tipo de pregunta y opciones
        const questionsData = await Promise.all(
          questions.map(async (question) => {
            const typeQuestion = await TypeQuestion.findOne({
              where: { id_type_question: question.type_question_id },
            });

            const questionOptions = await QuestionOption.findAll({
              where: { question_id: question.id_question },
            });

            return {
              question_text: question.question,
              question_type: typeQuestion ? typeQuestion.type_question : null,
              options: questionOptions.map((option) => option.option_text), // Asumiendo que QuestionOption tiene un campo "option_text"
            };
          })
        );

        return {
          id_form: form.id_form,
          topic: form.topic,
          title: form.title,
          description: form.description,
          is_open: form.is_open,
          limit_users: form.limit_users,
          questions: questionsData,
        };
      })
    );

    res.json(formsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch forms data." });
  }
}

Form.hasMany(Question, { foreignKey: "form_id", as: "questions" });

module.exports = {
  getLastForm,
  createForm,
  getLastForms,
  getSpecificForm,
  getMyForms,
  getFormsUser,
};
