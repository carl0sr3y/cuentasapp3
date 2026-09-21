-- Cuentas-App: esquema de base de datos (PostgreSQL)
-- Este archivo se ejecuta en cada arranque. Los CREATE TABLE usan IF NOT EXISTS
-- y las columnas nuevas usan ADD COLUMN IF NOT EXISTS para no romper una base ya existente.

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  usuario TEXT UNIQUE NOT NULL,
  contrasena TEXT NOT NULL,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;

CREATE TABLE IF NOT EXISTS cuentas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  nombre TEXT NOT NULL,
  favorito BOOLEAN NOT NULL DEFAULT false,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS movimientos_cuentas (
  id SERIAL PRIMARY KEY,
  cuenta_id INTEGER NOT NULL REFERENCES cuentas(id) ON DELETE CASCADE,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('abono','cargo')),
  descripcion TEXT,
  monto NUMERIC(12,2) NOT NULL,
  saldo_resultante NUMERIC(12,2) NOT NULL,
  fecha TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE movimientos_cuentas ADD COLUMN IF NOT EXISTS usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS movimientos_tienda (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('entrada','salida')),
  descripcion TEXT,
  monto NUMERIC(12,2) NOT NULL,
  saldo_resultante NUMERIC(12,2) NOT NULL,
  fecha TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE movimientos_tienda ADD COLUMN IF NOT EXISTS foto TEXT;

CREATE TABLE IF NOT EXISTS historial_general (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  accion TEXT NOT NULL,
  tipo TEXT,
  detalle TEXT,
  monto NUMERIC(12,2),
  referencia_id INTEGER,
  fecha TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Copias de seguridad generales (semanales): cuentas + movimientos_cuentas + historial_general
CREATE TABLE IF NOT EXISTS backups (
  id SERIAL PRIMARY KEY,
  data JSONB NOT NULL,
  size_bytes INTEGER NOT NULL,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE backups ADD COLUMN IF NOT EXISTS tipo TEXT NOT NULL DEFAULT 'general';
ALTER TABLE backups ADD COLUMN IF NOT EXISTS nombre TEXT;

-- Copias de seguridad de tienda (mensuales, con fotos y resumen)
CREATE TABLE IF NOT EXISTS backups_tienda (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  data JSONB NOT NULL,
  size_bytes INTEGER NOT NULL,
  descargado BOOLEAN NOT NULL DEFAULT false,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Suscripciones a notificaciones push (una fila por dispositivo/navegador que las active)
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  client_id TEXT,
  endpoint TEXT UNIQUE NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Codigos de 4 digitos para restablecer contrasena por correo
CREATE TABLE IF NOT EXISTS password_resets (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  expira_en TIMESTAMPTZ NOT NULL,
  usado BOOLEAN NOT NULL DEFAULT false,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_movcuentas_cuenta_fecha ON movimientos_cuentas(cuenta_id, fecha);
CREATE INDEX IF NOT EXISTS idx_movtienda_fecha ON movimientos_tienda(fecha);
CREATE INDEX IF NOT EXISTS idx_historial_fecha ON historial_general(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_cuentas_nombre ON cuentas(nombre);
CREATE INDEX IF NOT EXISTS idx_backups_fecha ON backups(fecha_creacion);
CREATE INDEX IF NOT EXISTS idx_password_resets_usuario ON password_resets(usuario_id);

-- Fecha del último cambio de contraseña (para forzar rotación cada 6 meses)
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS contrasena_actualizada_en TIMESTAMPTZ NOT NULL DEFAULT now();

-- Credenciales de huella/Face ID (WebAuthn) registradas por dispositivo
CREATE TABLE IF NOT EXISTS webauthn_credentials (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  credential_id TEXT UNIQUE NOT NULL,
  public_key TEXT NOT NULL,
  counter BIGINT NOT NULL DEFAULT 0,
  transports TEXT,
  device_name TEXT,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_webauthn_usuario ON webauthn_credentials(usuario_id);

-- ============================================================
-- MULTIEMPRESA: cada negocio es una "empresa" con sus propios
-- usuarios y datos, completamente separados de las demás.
-- ============================================================

CREATE TABLE IF NOT EXISTS empresas (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  codigo TEXT UNIQUE NOT NULL,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- usuarios: ahora pertenece a una empresa y tiene un rol ('admin' o 'usuario')
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS empresa_id INTEGER REFERENCES empresas(id) ON DELETE CASCADE;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS rol TEXT NOT NULL DEFAULT 'usuario';
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'usuarios_rol_check') THEN
    ALTER TABLE usuarios ADD CONSTRAINT usuarios_rol_check CHECK (rol IN ('admin','usuario'));
  END IF;
END $$;

-- Migración de datos existentes (de antes de multiempresa): se crea una empresa
-- "de arranque" y se le asignan todos los datos que no tengan empresa todavía.
INSERT INTO empresas (nombre, codigo)
SELECT 'Mi Negocio', 'EMPRESA1'
WHERE NOT EXISTS (SELECT 1 FROM empresas) AND EXISTS (SELECT 1 FROM usuarios);

UPDATE usuarios SET empresa_id = (SELECT id FROM empresas ORDER BY id LIMIT 1) WHERE empresa_id IS NULL;

-- Si una empresa se quedó sin ningún admin, se asciende a su usuario más antiguo.
UPDATE usuarios SET rol = 'admin'
WHERE id IN (
  SELECT DISTINCT ON (empresa_id) id FROM usuarios WHERE empresa_id IS NOT NULL ORDER BY empresa_id, fecha_creacion ASC
)
AND empresa_id NOT IN (SELECT empresa_id FROM usuarios WHERE rol = 'admin');

ALTER TABLE usuarios ALTER COLUMN empresa_id SET NOT NULL;

-- Los usuarios/correos ya no son únicos en toda la plataforma, solo dentro de su empresa.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'usuarios_usuario_key') THEN
    ALTER TABLE usuarios DROP CONSTRAINT usuarios_usuario_key;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'usuarios_email_key') THEN
    ALTER TABLE usuarios DROP CONSTRAINT usuarios_email_key;
  END IF;
END $$;
CREATE UNIQUE INDEX IF NOT EXISTS uq_usuarios_empresa_usuario ON usuarios(empresa_id, usuario);
CREATE UNIQUE INDEX IF NOT EXISTS uq_usuarios_empresa_email ON usuarios(empresa_id, email) WHERE email IS NOT NULL;

-- El resto de los datos también quedan separados por empresa.
ALTER TABLE cuentas ADD COLUMN IF NOT EXISTS empresa_id INTEGER REFERENCES empresas(id) ON DELETE CASCADE;
ALTER TABLE movimientos_tienda ADD COLUMN IF NOT EXISTS empresa_id INTEGER REFERENCES empresas(id) ON DELETE CASCADE;
ALTER TABLE historial_general ADD COLUMN IF NOT EXISTS empresa_id INTEGER REFERENCES empresas(id) ON DELETE CASCADE;
ALTER TABLE backups ADD COLUMN IF NOT EXISTS empresa_id INTEGER REFERENCES empresas(id) ON DELETE CASCADE;
ALTER TABLE backups_tienda ADD COLUMN IF NOT EXISTS empresa_id INTEGER REFERENCES empresas(id) ON DELETE CASCADE;
ALTER TABLE push_subscriptions ADD COLUMN IF NOT EXISTS empresa_id INTEGER REFERENCES empresas(id) ON DELETE CASCADE;

UPDATE cuentas SET empresa_id = (SELECT id FROM empresas ORDER BY id LIMIT 1) WHERE empresa_id IS NULL;
UPDATE movimientos_tienda SET empresa_id = (SELECT id FROM empresas ORDER BY id LIMIT 1) WHERE empresa_id IS NULL;
UPDATE historial_general SET empresa_id = (SELECT id FROM empresas ORDER BY id LIMIT 1) WHERE empresa_id IS NULL;
UPDATE backups SET empresa_id = (SELECT id FROM empresas ORDER BY id LIMIT 1) WHERE empresa_id IS NULL;
UPDATE backups_tienda SET empresa_id = (SELECT id FROM empresas ORDER BY id LIMIT 1) WHERE empresa_id IS NULL;
UPDATE push_subscriptions ps SET empresa_id = (SELECT u.empresa_id FROM usuarios u WHERE u.id = ps.usuario_id) WHERE empresa_id IS NULL;

ALTER TABLE cuentas ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE movimientos_tienda ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE historial_general ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE backups ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE backups_tienda ALTER COLUMN empresa_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_cuentas_empresa ON cuentas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_movtienda_empresa ON movimientos_tienda(empresa_id);
CREATE INDEX IF NOT EXISTS idx_historial_empresa ON historial_general(empresa_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_empresa ON usuarios(empresa_id);
