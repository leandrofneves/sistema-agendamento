const express = require("express");
const db = require("../db"); // Certifique-se de que sua conexão com o banco está configurada
const router = express.Router();

// Listar todos os serviços
router.get("/", async (req, res) => {
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

// Atualizar um serviço
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { description, duration, ativo } = req.body;

  if (!description || !duration || ativo === undefined) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
  }

  try {
    const result = await db.query(
      "UPDATE sys_service SET description = $1, duration = $2, ativo = $3 WHERE idservice = $4 RETURNING *",
      [description, duration, ativo, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Serviço não encontrado!" });
    }

    res.status(200).json({ message: "Serviço atualizado com sucesso!", service: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar serviço: " + err.message });
  }
});

// Excluir (desativar) um serviço
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "UPDATE sys_service SET ativo = FALSE WHERE idservice = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Serviço não encontrado!" });
    }

    res.status(200).json({ message: "Serviço desativado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao desativar serviço: " + err.message });
  }
});

module.exports = router;
