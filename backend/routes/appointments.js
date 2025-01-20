const express = require("express");
const db = require("../db"); // Conexão ao banco de dados
const router = express.Router();

/**
 * Rotas para a tabela sys_user_service
 */

// Listar todos os registros de user-service
router.get("/user-services", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT us.iduser_service, us.iduser, us.idservice, us.date, us.ativo, 
             u.name AS user_name, 
             s.description AS service_name, 
             s.duration AS service_duration
      FROM sys_user_service us
      JOIN sys_user u ON u.iduser = us.iduser
      JOIN sys_service s ON s.idservice = us.idservice
      WHERE us.ativo = TRUE
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar registros: " + err.message });
  }
});

// Criar um registro na tabela user-service
router.post("/user-services", async (req, res) => {
  const { iduser, idservice, date, idavailable_times } = req.body;

  if (!iduser || !idservice || !date) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
  }

  try {
    const result = await db.query(
      "INSERT INTO sys_user_service (iduser, idservice, date, idavailable_times) VALUES ($1, $2, $3, $4) RETURNING *",
      [iduser, idservice, date, idavailable_times]
    );
    res.status(201).json({ message: "Registro criado com sucesso!", record: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar registro: " + err.message });
  }
});

// Atualizar um registro da tabela user-service
router.put("/user-services/:id", async (req, res) => {
  const { id } = req.params;
  const { iduser, idservice, date, ativo } = req.body;

  if (!iduser || !idservice || !date) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
  }

  try {
    const result = await db.query(
      "UPDATE sys_user_service SET iduser = $1, idservice = $2, date = $3, ativo = $4 WHERE iduser_service = $5 RETURNING *",
      [iduser, idservice, date, ativo ?? true, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Registro não encontrado!" });
    }

    res.status(200).json({ message: "Registro atualizado com sucesso!", record: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar registro: " + err.message });
  }
});

// Exclusão lógica na tabela user-service
router.delete("/user-services/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "UPDATE sys_user_service SET ativo = FALSE WHERE iduser_service = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Registro não encontrado!" });
    }

    res.status(200).json({ message: "Registro excluído com sucesso!", record: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir registro: " + err.message });
  }
});

router.get("/block-times", async (req, res) => {
    try {
      const { idservice, date } = req.query;
  
      if (!idservice || !date) {
        return res.status(400).json({ error: "Parâmetros idservice e date são obrigatórios." });
      }
  
      const query = `
        SELECT TO_CHAR(sat.horario, 'HH24:MI') AS horario
        FROM sys_available_times sat
        LEFT JOIN sys_user_service sus
        ON sat.idavailable_times = sus.idavailable_times
            AND sus.date = $1
            AND sus.ativo = TRUE
        WHERE sat.idservice = $2
            AND sat.ativo = TRUE
            AND sus.idavailable_times IS NOT NULL
        ORDER BY sat.horario;
      `;
  
      const result = await db.query(query, [date, idservice]);
  
      res.status(200).json(result.rows);
    } catch (err) {
      res.status(500).json({ error: "Erro ao listar registros: " + err.message });
    }
  });
  

/**
 * Rotas para a tabela sys_available_times
 */

// Listar horários disponíveis para um serviço
router.get("/available-times/:idservice", async (req, res) => {
  const { idservice } = req.params;

  try {
    const result = await db.query(`
      SELECT idavailable_times, idservice, TO_CHAR(horario, 'HH24:MI') AS horario, ativo 
      FROM sys_available_times 
      WHERE idservice = $1 AND ativo = TRUE
    `, [idservice]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar horários disponíveis: " + err.message });
  }
});

// Criar horário disponível para um serviço
router.post("/available-times", async (req, res) => {
  const { idservice, horario } = req.body;

  if (!idservice || !horario) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
  }

  try {
    const result = await db.query(
      "INSERT INTO sys_available_times (idservice, horario) VALUES ($1, $2) RETURNING *",
      [idservice, horario]
    );
    res.status(201).json({ message: "Horário criado com sucesso!", record: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar horário: " + err.message });
  }
});

// Atualizar horário disponível
router.put("/available-times/:id", async (req, res) => {
  const { id } = req.params;
  const { idservice, horario, ativo } = req.body;

  if (!idservice || !horario) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
  }

  try {
    const result = await db.query(
      "UPDATE sys_available_times SET idservice = $1, horario = $2, ativo = $3 WHERE idavailable_times = $4 RETURNING *",
      [idservice, horario, ativo ?? true, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Horário não encontrado!" });
    }

    res.status(200).json({ message: "Horário atualizado com sucesso!", record: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar horário: " + err.message });
  }
});

// Exclusão lógica de horário disponível
router.delete("/available-times/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "UPDATE sys_available_times SET ativo = FALSE WHERE idavailable_times = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Horário não encontrado!" });
    }

    res.status(200).json({ message: "Horário excluído com sucesso!", record: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir horário: " + err.message });
  }
});

module.exports = router;
