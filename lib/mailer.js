// Se usa la API HTTP de Brevo (no SMTP) porque Railway bloquea las conexiones
// SMTP salientes (puertos 25/465/587) en el plan Hobby. La API funciona por
// HTTPS normal, que sí está permitido.
const API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
const configured = Boolean(API_KEY && SENDER_EMAIL);

if (!configured) {
  console.warn('BREVO_API_KEY / BREVO_SENDER_EMAIL no configuradas: el envío de correos está desactivado.');
}

async function sendMail({ to, subject, html }) {
  if (!configured) throw new Error('El envío de correos no está configurado en el servidor');
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Cuentas-App', email: SENDER_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Brevo API error ${res.status}: ${text}`);
  }
}

module.exports = { sendMail, mailerConfigured: configured };
