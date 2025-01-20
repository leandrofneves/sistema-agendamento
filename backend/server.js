require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const authRoutes = require("./routes/auth");
const serviceRoutes = require("./routes/services");
const appointmentRoutes = require("./routes/appointments");

const db = require("./db");

const app = express();
app.use(bodyParser.json());
app.use(cors());


// Testando conexão com o banco de dados
db.connect()
  .then(() => console.log("PostgreSQL conectado!"))
  .catch((err) => console.error("Erro ao conectar ao PostgreSQL:", err));

// Rotas
app.use("/auth", authRoutes);
app.use("/services", serviceRoutes);
app.use("/appointments", appointmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));