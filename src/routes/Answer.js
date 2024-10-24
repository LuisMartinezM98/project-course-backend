const express = require("express");
const { getAnswers } = require("../controllers/Answer");
const { checkAuth } = require("../middleware/cheackAuth");

const router = express.Router();

router.get('/get-answers', checkAuth, getAnswers);

module.exports = router;