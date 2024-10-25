const express = require("express");
const { getLastForm, createForm, getLastForms, getSpecificForm, getMyForms } = require("../controllers/Form");
const { checkAuth } = require("../middleware/cheackAuth");

const router = express.Router();

router.post('/create-form', checkAuth, createForm);
router.get('/last-form', checkAuth, getLastForm);
router.get("/last-forms", checkAuth, getLastForms);
router.get('/get-form', checkAuth, getSpecificForm);
router.get("/my-forms", checkAuth, getMyForms);

module.exports = router;