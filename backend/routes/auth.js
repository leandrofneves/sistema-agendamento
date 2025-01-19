const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
  }

  try {
    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      "INSERT INTO sys_user (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "Usuário registrado com sucesso!", user: result.rows[0] });
  } catch (err) {
    res.status(400).json({ error: "Erro ao registrar o usuário: " + err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
  }

  try {
    // Verificar se o usuário existe no banco de dados
    const result = await db.query("SELECT * FROM sys_user WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: "Credenciais inválidas!" });
    }

    // Verificar se a senha está correta
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Credenciais inválidas!" });
    }

    // Gerar o token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login bem-sucedido!", token });
  } catch (err) {
    res.status(400).json({ error: "Erro ao realizar login: " + err.message });
  }
});

module.exports = router;
