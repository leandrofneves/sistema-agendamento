const express = require("express");
const db = require("../db"); 
const authenticateToken = require("../middleware/auth");
const router = express.Router();
const sendConfirmationEmail = require('../services/sendConfirmationEmail');

router.post("/user-services", authenticateToken, async (req, res) => {
  const { iduser, idservice, date, formattedDate, idavailable_times } = req.body;

  if (!iduser || !idservice || !date || !idavailable_times) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
  }

  try {
    const serviceResult = await db.query("SELECT description FROM sys_service WHERE idservice = $1", [idservice]);
    const service = serviceResult.rows[0];

    if (!service) {
      return res.status(404).json({ error: "Serviço não encontrado!" });
    }

    const timeResult = await db.query("SELECT TO_CHAR(horario, 'HH24:MI') AS horario FROM sys_available_times WHERE idavailable_times = $1", [idavailable_times]);
    const time = timeResult.rows[0];

    if (!time) {
      return res.status(404).json({ error: "Horário não encontrado!" });
    }

    const userResult = await db.query("SELECT email FROM sys_user WHERE iduser = $1", [iduser]);
    const email = userResult.rows[0].email;

    if (!email) {
      return res.status(404).json({ error: "Email não encontrado!" });
    }

    const formattedTimeString = time.horario;

    const result = await db.query(
      "INSERT INTO sys_user_service (iduser, idservice, date, idavailable_times) VALUES ($1, $2, $3, $4) RETURNING *",
      [iduser, idservice, date, idavailable_times]
    );

    // Enviar e-mail de confirmação
    const subject = 'Confirmação de Agendamento';
    const message = `
      Seu agendamento foi realizado com sucesso!

      Detalhes:
      Serviço: ${service.description}
      Dia: ${formattedDate}
      Horário: ${formattedTimeString}
    `;

    await sendConfirmationEmail(email, subject, message);

    res.status(201).json({ message: "Registro criado com sucesso!", record: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar registro: " + err.message });
  }
});

router.get("/block-times", authenticateToken, async (req, res) => {
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

router.get("/available-times/:idservice", authenticateToken, async (req, res) => {
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

module.exports = router;