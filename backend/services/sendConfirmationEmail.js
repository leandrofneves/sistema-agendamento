const nodemailer = require("nodemailer");

const sendConfirmationEmail = async (to, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("E-mail de confirmação enviado!");
  } catch (error) {
    console.error("Erro ao enviar o e-mail:", error);
    throw error;
  }
};

module.exports = sendConfirmationEmail;