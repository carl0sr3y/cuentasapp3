const nodemailer = require('nodemailer');

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const configured = Boolean(GMAIL_USER && GMAIL_APP_PASSWORD);

let transporter = null;
if (configured) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });
} else {
  console.warn('GMAIL_USER / GMAIL_APP_PASSWORD no configuradas: el envío de correos está desactivado.');
}

async function sendMail({ to, subject, html }) {
  if (!configured) throw new Error('El envío de correos no está configurado en el servidor');
  await transporter.sendMail({ from: `Cuentas-App <${GMAIL_USER}>`, to, subject, html });
}

module.exports = { sendMail, mailerConfigured: configured };
