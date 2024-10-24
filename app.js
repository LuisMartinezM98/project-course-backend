const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./src/config/db");
const routerUser = require("./src/routes/User");
const routerForm = require("./src/routes/Form");
const routerTypeQuestion = require("./src/routes/TypeQuestion");
const routerAnswer = require("./src/routes/Answer");
const syncModels = require("./src/models/Associations")

dotenv.config();

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


sequelize.authenticate().then(() => {
  console.log("Conexión establecida exitosamente");
});

const PORT = process.env.PORT_BACKEND || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
