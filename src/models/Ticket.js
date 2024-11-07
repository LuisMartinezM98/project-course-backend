const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Ticket = sequelize.define("Ticket", {
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  jiraTicketId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  summary: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  priority: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Opened",
  },
  jiraUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Ticket;
