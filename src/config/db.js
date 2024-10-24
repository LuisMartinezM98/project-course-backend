const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(process.env.DB_URL);

sequelize.sync({alter: true});

module.exports = sequelize;