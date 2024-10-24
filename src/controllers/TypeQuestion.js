const TypeQuestion = require("../models/TypeQuestion");


const createTypeQuestion = async(req, res) => {
    const { type_question } = req.body;

    try {
        const objData = {
            type_question: type_question
        }
        await TypeQuestion.create(objData);
        return res.status(200).send({msg: 'Type Question created'});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Error creating Type question" });
    }
}


const getTypeQuestion = async(req, res) => {
    try {
        const TypeQuestions = await TypeQuestion.findAll();
        return res.status(200).send(TypeQuestions);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Error getting Type question" });
    }
}

module.exports = { createTypeQuestion, getTypeQuestion }