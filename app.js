const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./src/config/db");
const routerUser = require("./src/routes/User");
const routerForm = require("./src/routes/Form");
const routerTypeQuestion = require("./src/routes/TypeQuestion");
const routerAnswer = require("./src/routes/Answer");
const routerRequeriments = require("./src/routes/Requeriments");
const syncModels = require("./src/models/Associations");
const routerTypeAccount = require("./src/routes/TypeAccount");
const axios = require("axios");

dotenv.config();

const {SF_URL, SF_USERNAME, SF_PASSWORD, SF_TOKEN, SF_CUSTOMERID, SF_CUSTOMERSECRET} = process.env;



const app = express();

// syncModels();

const corsOptions = {
  origin: function (origin, callback) {
    // if (whiteList.indexOf(origin) !== -1) {
    //   callback(null, true);
    // } else {
    //   callback(new Error("Not allowed by CORS"));
    // }
    callback(null, true);
  },
  methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Length", "X-Kuma-Revision"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use("/api/users", routerUser);
app.use("/api/form", routerForm);
app.use("/api/type-questions", routerTypeQuestion);
app.use("/api/answer", routerAnswer);
app.use("/api/type-account", routerTypeAccount);
app.use("/api/requeriments", routerRequeriments);


sequelize.authenticate().then(() => {
  console.log("Conexión establecida exitosamente");
});

const PORT = process.env.PORT_BACKEND || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});



// async function getAccessToken() {
//   try {
//       const response = await axios.post(`https://login.salesforce.com/services/oauth2/token`, null, {
//           params: {
//               grant_type: 'password',
//               client_id: SF_CUSTOMERID,
//               client_secret: SF_CUSTOMERSECRET,
//               username: SF_USERNAME,
//               password: SF_PASSWORD + SF_TOKEN,
//           },
//       });
//       return response.data.access_token; 
//   } catch (error) {
//       console.error('Error obteniendo el token:', error.response ? error.response.data : error);
//       throw error;
//   }
// }


async function createAccountAndContact(userData) {
  const { accessToken, instanceUrl } = await getAccessToken();

  try {
      // Crear una cuenta en Salesforce
      const accountResponse = await axios.post(
          `${instanceUrl}/services/data/v62.0/sobjects/Account`, // Usando la versión 62.0
          { Name: userData.accountName },
          { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      // Crear un contacto vinculado a la cuenta
      const contactResponse = await axios.post(
          `${instanceUrl}/services/data/v62.0/sobjects/Contact`, // Usando la versión 62.0
          {
              LastName: userData.lastName,
              AccountId: accountResponse.data.id, // Usa el ID de la cuenta creada
              Email: userData.email,
          },
          { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      console.log('Cuenta y contacto creados:', {
          accountId: accountResponse.data.id,
          contactId: contactResponse.data.id,
      });
  } catch (error) {
      console.error('Error creando cuenta o contacto:', error);
      throw error;
  }
}

async function testSalesforceConnection() {
  try {
      const accessToken = await getAccessToken();
      const instanceUrl = SF_URL;
      const response = await axios.get(
          `${instanceUrl}/services/oauth2/userinfo`, // Endpoint para obtener información del usuario
          {
              headers: {
                  Authorization: `Bearer ${accessToken}`,
              },
          }
      );

      console.log('Conexión exitosa con Salesforce:', response.data);
  } catch (error) {
      console.error('Error al probar la conexión con Salesforce:', error);
  }
}

// testSalesforceConnection();