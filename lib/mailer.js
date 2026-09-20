const nodemailer = require('nodemailer');

const SMTP_LOGIN = process.env.BREVO_SMTP_LOGIN;
const SMTP_KEY = process.env.BREVO_SMTP_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
const configured = Boolean(SMTP_LOGIN && SMTP_KEY && SENDER_EMAIL);

let transporter = null;
if (configured) {
  transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: { user: SMTP_LOGIN, pass: SMTP_KEY },
  });
} else {
  console.warn('BREVO_SMTP_LOGIN / BREVO_SMTP_KEY / BREVO_SENDER_EMAIL no configuradas: el envío de correos está desactivado.');
}

async function sendMail({ to, subject, html }) {
  if (!configured) throw new Error('El envío de correos no está configurado en el servidor');
  await transporter.sendMail({ from: `Cuentas-App <${SENDER_EMAIL}>`, to, subject, html });
}

module.exports = { sendMail, mailerConfigured: configured };
