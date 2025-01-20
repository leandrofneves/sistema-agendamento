const express = require("express");
const db = require("../db"); 
const authenticateToken = require("../middleware/auth");
const router = express.Router();

// Listar todos os serviços
router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM sys_service WHERE ativo = TRUE");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar serviços: " + err.message });
  }
});

// Adicionar um novo serviço
router.post("/", async (req, res) => {
  const { description, duration } = req.body;

  if (!description || !duration) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
  }

  try {
    const result = await db.query(
      "INSERT INTO sys_service (description, duration) VALUES ($1, $2) RETURNING *",
      [description, duration]
    );
    res.status(201).json({ message: "Serviço adicionado com sucesso!", service: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Erro ao adicionar serviço: " + err.message });
  }
});

module.exports = router;
