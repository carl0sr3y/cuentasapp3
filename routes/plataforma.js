// API del panel de plataforma (superadmin). Puede ver empresas y usuarios, crear empresas,
// suspenderlas y restablecer contraseñas. A propósito NO tiene acceso a cuentas, saldos ni
// movimientos de las empresas.
const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { pool } = require('../db/pool');
const totp = require('../lib/totp');
const limites = require('../lib/rateLimits');
const { texto, textoOpcional, paramId } = require('../lib/validate');
const { compararContrasena, generarContrasenaTemporal } = require('../lib/passwords');
const { generarCodigoUnico } = require('../lib/empresas');
const { requirePlataforma, exigirCabecera, emitirCookie, borrarCookie, registrarBitacora } = require('../middleware/plataforma');

const router = express.Router();
router.use(exigirCabecera);
router.param('id', paramId);

const MSG_LOGIN = 'Usuario, contraseña o código incorrectos';

function hashRespaldo(codigo) {
  return crypto.createHash('sha256').update(codigo).digest('hex');
}

// ---------- Inicio y cierre de sesión ----------
router.post('/login', limites.plataformaLoginIp, limites.plataformaLoginGlobal, async (req, res) => {
  const body = req.body || {};
  const usuario = texto(body.usuario, 60);
  const contrasena = typeof body.contrasena === 'string' && body.contrasena.length <= 200 ? body.contrasena : null;
  const codigo = texto(body.codigo, 40);
  if (!usuario || !contrasena || !codigo) return res.status(400).json({ error: 'Completa usuario, contraseña y código' });

  const { rows } = await pool.query('SELECT * FROM superadmins WHERE usuario = $1', [usuario]);
  const sa = rows[0];
  const passOk = await compararContrasena(contrasena, sa && sa.contrasena);

  let segundoOk = false;
  let conRespaldo = false;
  if (passOk) {
    const limpio = codigo.replace(/[\s-]/g, '').toUpperCase();
    if (/^\d{6}$/.test(limpio)) {
      const paso = totp.verificar(sa.totp_secreto, limpio);
      if (paso !== null) {
        // Un mismo código de 6 dígitos solo se acepta una vez (aunque siga dentro de sus 30 s).
        const r = await pool.query(
          'UPDATE superadmins SET ultimo_paso_totp = $1 WHERE id = $2 AND (ultimo_paso_totp IS NULL OR ultimo_paso_totp < $1)',
          [paso, sa.id]
        );
        segundoOk = r.rowCount === 1;
      }
    } else if (/^[A-Z0-9]{10}$/.test(limpio)) {
      const r = await pool.query(
        'UPDATE superadmin_codigos_respaldo SET usado = true, usado_en = now() WHERE superadmin_id = $1 AND hash = $2 AND usado = false',
        [sa.id, hashRespaldo(limpio)]
      );
      segundoOk = r.rowCount === 1;
      conRespaldo = segundoOk;
    }
  }

  if (!passOk || !segundoOk) {
    await registrarBitacora(req, passOk ? sa.id : null, 'Inicio de sesión fallido',
      `Usuario "${usuario}"` + (passOk ? ' — la CONTRASEÑA ERA CORRECTA pero el código no; si no fuiste tú, cámbiala con el script' : ''));
    return res.status(401).json({ error: MSG_LOGIN });
  }

  emitirCookie(res, { sid: sa.id, sv: sa.sesion_version, ini: Date.now() });
  const { rows: rest } = await pool.query(
    'SELECT COUNT(*)::int AS n FROM superadmin_codigos_respaldo WHERE superadmin_id = $1 AND usado = false', [sa.id]
  );
  await registrarBitacora(req, sa.id, 'Inicio de sesión', conRespaldo ? `Con código de respaldo (quedan ${rest[0].n})` : 'Con app autenticadora');
  res.json({ usuario: sa.usuario, respaldosRestantes: rest[0].n });
});

router.post('/logout', requirePlataforma, async (req, res) => {
  // Subir la versión invalida esta sesión y cualquier otra abierta en otro dispositivo.
  await pool.query('UPDATE superadmins SET sesion_version = sesion_version + 1 WHERE id = $1', [req.superadmin.id]);
  borrarCookie(res);
  await registrarBitacora(req, req.superadmin.id, 'Cierre de sesión', null);
  res.json({ ok: true });
});

router.get('/me', requirePlataforma, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT COUNT(*)::int AS n FROM superadmin_codigos_respaldo WHERE superadmin_id = $1 AND usado = false', [req.superadmin.id]
  );
  res.json({ usuario: req.superadmin.usuario, respaldosRestantes: rows[0].n });
});

// Todo lo de abajo exige sesión de plataforma.
router.use(requirePlataforma);

// ---------- Empresas ----------
router.get('/empresas', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT e.id, e.nombre, e.codigo, e.activa, e.fecha_creacion,
           COUNT(u.id)::int AS usuarios,
           COUNT(u.id) FILTER (WHERE u.rol = 'admin')::int AS admins
    FROM empresas e LEFT JOIN usuarios u ON u.empresa_id = e.id
    GROUP BY e.id
    ORDER BY e.nombre ASC
  `);
  res.json(rows);
});

router.post('/empresas', async (req, res) => {
  const body = req.body || {};
  const nombreEmpresa = texto(body.nombreEmpresa, 100);
  const nombre = texto(body.nombre, 100);
  const usuario = texto(body.usuario, 60);
  const email = textoOpcional(body.email, 254);
  if (!nombreEmpresa || !nombre || !usuario || email === null) {
    return res.status(400).json({ error: 'Completa el nombre de la empresa, el nombre y el usuario del administrador' });
  }

  const codigoEmpresa = await generarCodigoUnico(nombreEmpresa);
  const temporal = generarContrasenaTemporal();
  const hash = await bcrypt.hash(temporal, 10);
  const client = await pool.connect();
  let empresa;
  try {
    await client.query('BEGIN');
    ({ rows: [empresa] } = await client.query(
      'INSERT INTO empresas (nombre, codigo) VALUES ($1,$2) RETURNING id, nombre, codigo, activa, fecha_creacion',
      [nombreEmpresa, codigoEmpresa]
    ));
    await client.query(
      `INSERT INTO usuarios (empresa_id, nombre, usuario, email, contrasena, rol, debe_cambiar_contrasena, es_principal)
       VALUES ($1,$2,$3,$4,$5,'admin',true,true)`,
      [empresa.id, nombre, usuario, email || null, hash]
    );
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
  await registrarBitacora(req, req.superadmin.id, 'Crear empresa', `"${empresa.nombre}" (${empresa.codigo}), admin "${usuario}"`);
  res.json({ empresa, admin: { nombre, usuario }, contrasenaTemporal: temporal });
});

router.post('/empresas/:id/estado', async (req, res) => {
  const activa = (req.body || {}).activa;
  if (typeof activa !== 'boolean') return res.status(400).json({ error: 'Indica si la empresa queda activa o suspendida' });
  const { rows } = await pool.query(
    'UPDATE empresas SET activa = $1 WHERE id = $2 RETURNING id, nombre, codigo, activa',
    [activa, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Empresa no encontrada' });
  await registrarBitacora(req, req.superadmin.id, activa ? 'Reactivar empresa' : 'Suspender empresa', `"${rows[0].nombre}" (${rows[0].codigo})`);
  res.json(rows[0]);
});

// Cuánto se borraría al eliminar la empresa (para mostrarlo antes de confirmar).
router.get('/empresas/:id/resumen', async (req, res) => {
  const { rows: [r] } = await pool.query(
    `SELECT e.id, e.nombre, e.codigo, e.activa,
       (SELECT COUNT(*)::int FROM usuarios WHERE empresa_id = e.id) AS usuarios,
       (SELECT COUNT(*)::int FROM cuentas WHERE empresa_id = e.id) AS cuentas,
       (SELECT COUNT(*)::int FROM movimientos_cuentas m JOIN cuentas c ON c.id = m.cuenta_id WHERE c.empresa_id = e.id) AS movimientos_cuentas,
       (SELECT COUNT(*)::int FROM movimientos_tienda WHERE empresa_id = e.id) AS movimientos_tienda
     FROM empresas e WHERE e.id = $1`, [req.params.id]);
  if (!r) return res.status(404).json({ error: 'Empresa no encontrada' });
  res.json(r);
});

// Elimina una empresa con TODOS sus datos (usuarios, cuentas, movimientos, tienda, historial,
// respaldos, huellas y notificaciones: todo cuelga de empresas con ON DELETE CASCADE).
// Seguros: la empresa debe estar suspendida antes, hay que escribir su código exacto y dar un
// código nuevo de la app autenticadora (un código ya usado no sirve). Queda en la bitácora.
router.post('/empresas/:id/eliminar', async (req, res) => {
  const body = req.body || {};
  const confirmacion = texto(body.confirmacion, 40);
  const codigoTotp = String(body.codigoTotp || '').replace(/\s/g, '');
  const { rows: [emp] } = await pool.query('SELECT id, nombre, codigo, activa FROM empresas WHERE id = $1', [req.params.id]);
  if (!emp) return res.status(404).json({ error: 'Empresa no encontrada' });
  if (emp.activa) return res.status(409).json({ error: 'Primero suspende la empresa. Solo se pueden eliminar empresas suspendidas.' });
  if (!confirmacion || confirmacion.trim().toUpperCase() !== emp.codigo) {
    return res.status(400).json({ error: 'El código de empresa escrito no coincide.' });
  }
  const { rows: [sa] } = await pool.query('SELECT id, totp_secreto FROM superadmins WHERE id = $1', [req.superadmin.id]);
  const paso = sa ? totp.verificar(sa.totp_secreto, codigoTotp) : null;
  let totpOk = false;
  if (paso !== null) {
    const r = await pool.query(
      'UPDATE superadmins SET ultimo_paso_totp = $1 WHERE id = $2 AND (ultimo_paso_totp IS NULL OR ultimo_paso_totp < $1)',
      [paso, sa.id]
    );
    totpOk = r.rowCount === 1;
  }
  if (!totpOk) {
    await registrarBitacora(req, req.superadmin.id, 'Eliminar empresa (rechazado)', `"${emp.nombre}" (${emp.codigo}): código de la app incorrecto o ya usado`);
    // 400 (no 401): un 401 haría que el panel crea que la sesión venció y te saque.
    return res.status(400).json({ error: 'Código de la app autenticadora incorrecto o ya usado. Espera el siguiente e intenta de nuevo.' });
  }
  const { rows: [cuenta] } = await pool.query(
    `SELECT (SELECT COUNT(*)::int FROM usuarios WHERE empresa_id = $1) AS usuarios,
            (SELECT COUNT(*)::int FROM cuentas WHERE empresa_id = $1) AS cuentas`, [emp.id]);
  await pool.query('DELETE FROM empresas WHERE id = $1 AND activa = false', [emp.id]);
  await registrarBitacora(req, req.superadmin.id, 'Eliminar empresa',
    `"${emp.nombre}" (${emp.codigo}) eliminada con todos sus datos: ${cuenta.usuarios} usuario(s), ${cuenta.cuentas} cuenta(s)`);
  res.json({ ok: true });
});

router.get('/empresas/:id/usuarios', async (req, res) => {
  const { rows: emp } = await pool.query('SELECT id, nombre, codigo, activa FROM empresas WHERE id = $1', [req.params.id]);
  if (!emp[0]) return res.status(404).json({ error: 'Empresa no encontrada' });
  const { rows } = await pool.query(
    `SELECT id, nombre, usuario, email, rol, es_principal, fecha_creacion, debe_cambiar_contrasena
     FROM usuarios WHERE empresa_id = $1 ORDER BY es_principal DESC, (rol = 'admin') DESC, nombre ASC`,
    [req.params.id]
  );
  res.json({ empresa: emp[0], usuarios: rows });
});

// ---------- Restablecer la contraseña de cualquier usuario (incluidos los admins) ----------
router.post('/usuarios/:id/restablecer', async (req, res) => {
  const temporal = generarContrasenaTemporal();
  const hash = await bcrypt.hash(temporal, 10);
  const client = await pool.connect();
  let u;
  try {
    await client.query('BEGIN');
    ({ rows: [u] } = await client.query(
      `UPDATE usuarios SET contrasena = $1, contrasena_actualizada_en = now(), debe_cambiar_contrasena = true,
         sesion_version = sesion_version + 1
       WHERE id = $2
       RETURNING id, nombre, usuario, rol, empresa_id`,
      [hash, req.params.id]
    ));
    if (!u) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Usuario no encontrado' }); }
    // Fuera también las huellas: si la cuenta estaba comprometida, el intruso pudo registrar la suya.
    await client.query('DELETE FROM webauthn_credentials WHERE usuario_id = $1', [u.id]);
    // Queda constancia también en el historial de la empresa (su admin lo puede ver).
    await client.query(
      'INSERT INTO historial_general (empresa_id, usuario_id, accion, detalle) VALUES ($1,NULL,$2,$3)',
      [u.empresa_id, 'Cambiar contraseña', `Contraseña de "${u.nombre}" restablecida por el administrador de la plataforma`]
    );
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
  const { rows: emp } = await pool.query('SELECT nombre, codigo FROM empresas WHERE id = $1', [u.empresa_id]);
  await registrarBitacora(req, req.superadmin.id, 'Restablecer contraseña',
    `"${u.usuario}" (${u.rol}) de "${emp[0].nombre}" (${emp[0].codigo}); sesiones y huellas revocadas`);
  res.json({ usuario: u.usuario, nombre: u.nombre, codigoEmpresa: emp[0].codigo, contrasenaTemporal: temporal });
});

// ---------- Bitácora ----------
router.get('/bitacora', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT b.id, b.accion, b.detalle, b.ip, b.fecha, s.usuario
    FROM plataforma_bitacora b LEFT JOIN superadmins s ON s.id = b.superadmin_id
    ORDER BY b.fecha DESC, b.id DESC
    LIMIT 300
  `);
  res.json(rows);
});

module.exports = router;
