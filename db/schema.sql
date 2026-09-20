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
