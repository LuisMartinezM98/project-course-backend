const express = require("express");
const { getAnswers, setAnswers } = require("../controllers/Answer");
const { checkAuth } = require("../middleware/cheackAuth");

const router = express.Router();

router.get('/get-answers', checkAuth, getAnswers);
router.post('/submit-answers', checkAuth, setAnswers);

module.exports = router;