const express = require("express");
const { createTypeAccount } = require("../controllers/TypeAccount");

const router = express.Router();
router.post('/create-type-account', createTypeAccount);

module.exports = router;
