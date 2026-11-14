#!/usr/bin/env node
// Crea o restablece una cuenta de superadmin (administrador de toda la plataforma).
// Es la ÚNICA forma de crear esta cuenta: no existe registro web.
//
// Uso (desde tu computadora, con la URL PÚBLICA de la base de Railway):
//   DATABASE_URL="postgresql://..." node scripts/superadmin.js <usuario>
//
// Genera una contraseña nueva, un secreto para la app autenticadora (con QR) y 10 códigos de
// respaldo. Si la cuenta ya existía, todo lo anterior deja de servir y se cierran sus sesiones.
require('dotenv').config();
const crypto = require('crypto');
const readline = require('readline/promises');
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');
const totp = require('../lib/totp');
const { generarContrasenaTemporal } = require('../lib/passwords');

const ALFABETO_RESPALDO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function codigoRespaldo() {
  let s = '';
  for (let i = 0; i < 10; i++) s += ALFABETO_RESPALDO[crypto.randomInt(ALFABETO_RESPALDO.length)];
  return s;
}

async function main() {
  const usuario = (process.argv[2] || '').trim();
  if (!/^[a-zA-Z0-9._-]{3,60}$/.test(usuario)) {
    console.error('Uso: DATABASE_URL="postgresql://..." node scripts/superadmin.js <usuario>');
    console.error('El usuario debe tener de 3 a 60 caracteres: letras, números, punto, guion o guion bajo.');
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error('Falta DATABASE_URL. En Railway: servicio Postgres → Variables → copia DATABASE_PUBLIC_URL.');
    process.exit(1);
  }
  const { pool, migrate } = require('../db/pool');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  try {
    await migrate();
    const { rows } = await pool.query('SELECT id FROM superadmins WHERE usuario = $1', [usuario]);
    const existe = Boolean(rows[0]);
    if (existe) {
      const r = await rl.question(`\nEl superadmin "${usuario}" YA EXISTE. Se reemplazarán su contraseña, su app autenticadora\ny sus códigos de respaldo, y se cerrarán sus sesiones. Escribe SI para continuar: `);
      if (r.trim() !== 'SI') { console.log('Cancelado. No se cambió nada.'); return; }
    }

    const contrasena = generarContrasenaTemporal(20);
    const secreto = totp.generarSecreto();
    const respaldos = Array.from({ length: 10 }, codigoRespaldo);
    const uri = totp.uriOtpauth(secreto, usuario);

    console.log('\n1) Abre Google Authenticator (o Microsoft Authenticator) → "+" → "Escanear código QR":\n');
    console.log(await QRCode.toString(uri, { type: 'terminal', small: true }));
    console.log('   Si no puedes escanear, elige "Ingresar clave de configuración" y escribe:');
    console.log('   Cuenta: Kaab   Clave: ' + secreto.match(/.{1,4}/g).join(' ') + '   (basada en tiempo)\n');

    // Comprobamos que la app quedó bien configurada ANTES de guardar nada, para no dejarte afuera.
    let ok = false;
    for (let i = 0; i < 5 && !ok; i++) {
      const c = (await rl.question('2) Escribe el código de 6 dígitos que muestra la app: ')).replace(/\s/g, '');
      ok = totp.verificar(secreto, c) !== null;
      if (!ok) console.log('   Código incorrecto. Revisa que la hora del teléfono sea automática e intenta de nuevo.');
    }
    if (!ok) { console.log('\nNo se pudo comprobar la app autenticadora. No se cambió nada; vuelve a ejecutar el script.'); return; }

    const hash = await bcrypt.hash(contrasena, 12);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rows: [sa] } = await client.query(
        `INSERT INTO superadmins (usuario, contrasena, totp_secreto) VALUES ($1,$2,$3)
         ON CONFLICT (usuario) DO UPDATE SET contrasena = EXCLUDED.contrasena, totp_secreto = EXCLUDED.totp_secreto,
           ultimo_paso_totp = NULL, sesion_version = superadmins.sesion_version + 1
         RETURNING id`,
        [usuario, hash, secreto]
      );
      await client.query('DELETE FROM superadmin_codigos_respaldo WHERE superadmin_id = $1', [sa.id]);
      for (const c of respaldos) {
        await client.query('INSERT INTO superadmin_codigos_respaldo (superadmin_id, hash) VALUES ($1,$2)',
          [sa.id, crypto.createHash('sha256').update(c).digest('hex')]);
      }
      await client.query('INSERT INTO plataforma_bitacora (superadmin_id, accion, detalle, ip) VALUES ($1,$2,$3,$4)',
        [sa.id, existe ? 'Cuenta restablecida' : 'Cuenta creada', 'Con scripts/superadmin.js', 'script']);
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    console.log('\n================  GUARDA ESTO EN UN LUGAR SEGURO  ================');
    console.log('  (un gestor de contraseñas; NO en el chat, el correo ni una foto)\n');
    console.log('  Usuario:     ' + usuario);
    console.log('  Contraseña:  ' + contrasena);
    console.log('\n  Códigos de respaldo (cada uno sirve UNA vez en lugar del código de la app,');
    console.log('  por si pierdes el teléfono):');
    respaldos.forEach((c, i) => console.log(`    ${String(i + 1).padStart(2)}. ${c.slice(0, 5)}-${c.slice(5)}`));
    console.log('\n  Panel: https://<tu-dominio>/plataforma');
    console.log('===================================================================\n');
  } finally {
    rl.close();
    await pool.end();
  }
}

main().catch((e) => { console.error('Error:', e.message); process.exit(1); });
