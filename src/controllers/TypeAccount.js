const TypeAccount = require("../models/TypeAccount");



const createTypeAccount = async(req, res) => {
    const {type_account} = req.body;

    try {
        const objData = {
            type_account: type_account
        }
        await TypeAccount.create(objData);
        return res.status(200).send({msg: 'Type Account created '});
    } catch (error) {
        console.log(error);
        return res.status(500).send({error: 'Error creating type question '});
    }
}

module.exports = { createTypeAccount };