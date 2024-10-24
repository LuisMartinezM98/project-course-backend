const QuestionOption = require("../models/QuestionOptions")

const createOptionBack = async(option, question) => {
    try {
        const objData = {
            option,
            question_id: question
        }
        await QuestionOption.create(objData);
        return true
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Something went wrong" });
    }
}

const createOption = async(req, res) => {
    const { question_id, option } = req.body;

    try {
        const objData = {
            question_id,
            option
        }
        await QuestionOption.create(objData);
        return res.status(200).send({msg: 'Option created'});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Something went wrong" });
    }
}

const deleteOption = async(req, res) => {
    const { id_option } = req.body;

    try {
        const option = await QuestionOption.findOne({
            where: {
                id_option: id_option
            }
        });
        await option.destroy();
        return res.status(200).send({msg: 'Option deleted successfull'});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Something went wrong" });
    }
}

module.exports = { createOptionBack, createOption, deleteOption }