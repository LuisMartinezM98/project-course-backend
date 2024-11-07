const express = require("express");
const { createAccountAndContact, getContacts } = require("../controllers/Requeriments");
const { createTicket } = require("../controllers/JiraServices");
const { checkAuth } = require("../middleware/cheackAuth");

const router = express.Router();

router.post('/create-contact', checkAuth, createAccountAndContact);
router.get('/get-contacts', checkAuth, getContacts);
router.post('/create-ticket', checkAuth, createTicket);

module.exports= router;