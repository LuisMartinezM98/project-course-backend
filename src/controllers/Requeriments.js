//SalesForce
const dotenv = require("dotenv");
const axios = require("axios")
dotenv.config();

const {SF_URL, SF_USERNAME, SF_PASSWORD, SF_TOKEN, SF_CUSTOMERID, SF_CUSTOMERSECRET} = process.env;


async function getAccessToken() {
  try {
    const response = await axios.post(
      `https://login.salesforce.com/services/oauth2/token`,
      null,
      {
        params: {
          grant_type: "password",
          client_id: SF_CUSTOMERID,
          client_secret: SF_CUSTOMERSECRET,
          username: SF_USERNAME,
          password: SF_PASSWORD + SF_TOKEN,
        },
      }
    );
    return {
      accessToken: response.data.access_token,
      instanceUrl: response.data.instance_url
    };
  } catch (error) {
    console.error(
      "Error obteniendo el token:",
      error.response ? error.response.data : error
    );
    throw error;
  }
}


async function createAccountAndContact(req, res) {
  const { accountName, lastName, email, firstName } = req.body;
  const { accessToken, instanceUrl } = await getAccessToken();

  try {
    const accountResponse = await axios.post(
      `${instanceUrl}/services/data/v62.0/sobjects/Account`,
      { Name: accountName },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const contactResponse = await axios.post(
      `${instanceUrl}/services/data/v62.0/sobjects/Contact`,
      {
        LastName: lastName,
        FirstName: firstName,
        AccountId: accountResponse.data.id,
        Email: email,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    console.log("Cuenta y contacto creados:", {
      accountId: accountResponse.data.id,
      contactId: contactResponse.data.id,
    });
    return res.status(200).send({ msg: 'User created' });
  } catch (error) {
    console.error("Error creando cuenta o contacto:", error);
    res.status(500).send("Error creating account or contact");
  }
}

async function getContacts(req, res) {
  try {
    const { accessToken, instanceUrl } = await getAccessToken();
    const response = await axios.get(
      `${instanceUrl}/services/data/v62.0/query`,
      {
        params: {
          q: "SELECT Id, FirstName, LastName, Email FROM Contact"
        },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    res.status(200).json(response.data.records);
  } catch (error) {
    console.error("Error obteniendo contactos:", error);
    res.status(500).send("Error al obtener contactos");
  }
}

async function templateOdoo(req, res){
  
}


module.exports = {createAccountAndContact, getContacts}