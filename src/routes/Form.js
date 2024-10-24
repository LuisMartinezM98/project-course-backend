const express = require("express");
const { getLastForm } = require("../controllers/Form");
const { checkAuth } = require("../middleware/cheackAuth");

const router = express.Router();

router.get('/last-form', checkAuth, getLastForm);

module.exports = router;