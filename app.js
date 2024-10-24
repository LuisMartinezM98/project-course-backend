const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./src/config/db");
const routerUser = require("./src/routes/User");
const routerForm = require("./src/routes/Form");
const routerTypeQuestion = require("./src/routes/TypeQuestion");
const syncModels = require("./src/models/Associations")

dotenv.config();

const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: process.env.FRONTEND_URL,
//         methods: ["GET", "POST", "PUT"],
//     },
// });

// io.on('connection', (socket ) => {
//     console.log('Usuario conectado: ', socket.id);

//     //Escuchar un evento personalizado desde el cliente
//     socket.on('mensaje_cliente', (mensaje) => {
//         console.log('Mensaje recibido del cliente: ', mensaje);

//         //Emitir una respuesta al cliente
//         socket.emit('mensaje_servidor', 'Mensaje recibido en el servidor');
//     });

//     socket.on('disconnect', () => {
//         console.log('Usuario desconectado: ', socket.id);
//     });
// });

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


sequelize.authenticate().then(() => {
  console.log("Conexión establecida exitosamente");
});

const PORT = process.env.PORT_BACKEND || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
// server.listen(PORT, () => {
//     console.log(`Servidor ejecutandosé en el puerto ${PORT}`)
// })
