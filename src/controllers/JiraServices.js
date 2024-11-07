const dotenv = require("dotenv");
const axios = require("axios");
const Ticket = require("../models/Ticket");
dotenv.config();

const { JIRA_API_BASE, JIRA_EMAIL, JIRA_API_TOKEN, JIRA_PROJECT_KEY } =
  process.env;

  async function createJiraTicket({ summary, priority, reporterEmail, templateTitle }) {
    // Usuario genérico (reemplaza con un ID de cuenta de un usuario existente con permisos)
    const genericReporterId = '712020:f929d7ae-1956-4ad7-a5c3-5eca82687ce8';
    const ticketData = {
      "fields": {
        "project": {
          key: JIRA_PROJECT_KEY, // Usamos la clave del proyecto de Jira configurada en .env
        },
        "summary": summary,
        "description":{
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: `Template: ${templateTitle}`
                }
              ]
            }
          ]
        },
        "issuetype": {
          name: "Story", // Tipo de incidencia
        },
        reporter: {
          id: genericReporterId, // Usamos un accountId genérico
        },
      },
    };
    try {
      const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");
      const response = await axios.post(`${JIRA_API_BASE}/issue`, ticketData, {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating Jira ticket:", error.response ? error.response.data : error.message);
      throw new Error("Failed to create Jira ticket.");
    }
  }
  
  async function createTicket(req, res){
    const { summary, priority, templateTitle } = req.body;
    const { user } = req;
    const userId = user.id_user;
    
    try {
      const jiraResponse = await createJiraTicket({
        summary, 
        priority,
        templateTitle,
      });
      const newTicket = await Ticket.create({
        userId,
        jiraTicketId: jiraResponse.id,
        summary,
        priority,
        status: "Opened",
        jiraUrl: `https://luiizmartinez.atlassian.net/browse/${jiraResponse.key}`,
      });
      res.status(200).send({ msg:`Ticket id: ${jiraResponse.id}`});
    } catch (error) {
      res.status(500).json({ error: "Failed to create ticket in Jira" });
    }
  }
  
  module.exports = {
    createTicket
  };
  