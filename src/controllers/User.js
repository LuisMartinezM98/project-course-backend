const { Op } = require("sequelize");
const { generarJWT } = require("../helpers/generateJWT");
const User = require("../models/User");
const crypto = require("crypto");

function verifyPassword(password, storedPassword) {
    const hash = crypto.createHash("sha256").update(password).digest("hex");
  
    return hash === storedPassword;
}


const singUp = async (req, res) => {
    const { email, password } = req.body;
    const emailUsed = await User.findOne({
      where: {
        email: email,
        deleted_at: null,
      },
    });

    if (emailUsed) {
      const err = new Error("This email has already been used");
      return res.status(400).json({ msg: err.message });
    }
    try {
      const hash = await crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");
      req.body.password = hash;
      await User.create(req.body);
      return res.status(200).send({ msg: "User created" });
    } catch (error) {
      console.log(error);
      const err = new Error("Something was wrong");
      return res.status(400).send({ msg: err.message });
    }
  };

  const logIn = async (req, res) => {
    const { email, password } = req.body;
    const usuario = await User.findOne({
      where: {
        email: email,
        deleted_at: null,
      },
    });
    if (!usuario) {
      const err = new Error("Email not found");
      return res.status(404).send({ msg: err.message });
    }
    const isMatch = verifyPassword(password, usuario.password);
    if (!isMatch) {
      const err = new Error("Password incorrect");
      return res.status(400).send({ msg: err.message });
    }
    usuario.last_conection = new Date();
    await usuario.save();
    const {
      password: passwordDataValues,
      created_at,
      updated_at,
      deleted_at,
      ...restData
    } = usuario.dataValues;
    const token = generarJWT(restData);
    return res.status(200).send({
      token,
      user: restData
    });
  };


  module.exports = {
    singUp,
    logIn
  }