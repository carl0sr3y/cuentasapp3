// Plazos de Movimientos tienda, siempre con la fecha de Guatemala (mejoras/TIENDA.md #9).
// Ejemplo con hoy = 18 de noviembre:
//   - se ven en la pestaña los movimientos desde el 18 de septiembre (mismo día, 2 meses atrás);
//   - se pueden borrar solo los del 19 de octubre en adelante (después del mismo día del mes pasado);
//   - el respaldo de cada mes se crea el día 1 del mes siguiente y se guarda 5 meses.
// Cada función recibe el alias de la tabla movimientos_tienda en la consulta (p. ej. 'm').

const ZONA = "'America/Guatemala'";
const HOY = `(now() AT TIME ZONE ${ZONA})::date`;
const MES_ACTUAL = `date_trunc('month', now() AT TIME ZONE ${ZONA})::date`;
const MESES_RESPALDO = 5;

const col = (a) => (a ? `${a}.fecha` : 'fecha');
const dia = (a) => `(${col(a)} AT TIME ZONE ${ZONA})::date`;
const mes = (a) => `date_trunc('month', ${col(a)} AT TIME ZONE ${ZONA})::date`;
const visible = (a) => `${dia(a)} >= ${HOY} - interval '2 months'`;
const editable = (a) => `${dia(a)} > ${HOY} - interval '1 month'`;

// Mes del respaldo que se borra el día 1 del mes que viene (hoy noviembre → junio).
const MES_POR_BORRAR = `(${MES_ACTUAL} - interval '${MESES_RESPALDO} months')::date`;

module.exports = { ZONA, HOY, MES_ACTUAL, MESES_RESPALDO, MES_POR_BORRAR, dia, mes, visible, editable };
