const express = require("express");
const { createTypeQuestion, getTypeQuestion } = require("../controllers/TypeQuestion");


const router = express.Router();
router.get('/get-types', getTypeQuestion);
router.post('/create-type-question', createTypeQuestion)

module.exports = router;
