const express = require("express");
const {logIn, singUp} = require("../controllers/User")
const { validatorLogIn, validatorSingUp } = require("../validators/User");

const router = express.Router();

router.post('/sign-up', validatorSingUp, singUp);

router.post('/log-in', validatorLogIn, logIn);

module.exports = router;