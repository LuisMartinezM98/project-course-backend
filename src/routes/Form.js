const express = require("express");
const { getLastForm, createForm, getLastForms } = require("../controllers/Form");
const { checkAuth } = require("../middleware/cheackAuth");

const router = express.Router();

router.post('/create-form', checkAuth, createForm);
router.get('/last-form', checkAuth, getLastForm);
router.get("/last-forms", checkAuth, getLastForms);

module.exports = router;