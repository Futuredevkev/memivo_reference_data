const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const {
  PROFILE_REPORT_CONTENT_REQUIREMENT_BY_REASON,
  ProfileReportContentRequirement,
  ProfileReportReason,
} = require('../dist/reports');

/**
 * CADA RAZÓN DE DENUNCIA CONTESTÓ, A CONCIENCIA, SI SEÑALA UNA PIEZA.
 *
 * ── EL DEFECTO QUE CIERRA, Y POR QUÉ EL `Record` TOTAL NO ALCANZA ──────────
 * El `Record` total ya obliga a que una razón nueva TENGA fila: sin ella, el
 * paquete no compila. Lo que `tsc` no puede exigir es que la fila sea una
 * DECISIÓN. La salida barata frente a un compilador en rojo es copiar la línea
 * de arriba, y la línea de arriba dice `FORBIDDEN` cuatro veces seguidas: la
 * razón nueva entraría negando la evidencia sin que nadie lo haya pensado, que
 * es exactamente el resultado que el `Record` existe para impedir. Es ORDEN §6
 * un paso más allá — la exhaustividad la da el tipo, la deliberación no.
 *
 * ── QUÉ EXIGE ──────────────────────────────────────────────────────────────
 * Que cada fila del `Record` lleve, escrito arriba, el motivo por el que su
 * razón exige, admite o rechaza la pieza. Un comentario no prueba que se haya
 * pensado, pero obliga a escribir una frase que otro puede leer y refutar —y
 * hace que copiar la línea de arriba deje de ser gratis, que es todo el punto.
 *
 * ── ALCANCE DECLARADO ──────────────────────────────────────────────────────
 * · Lee el FUENTE del archivo de la constante, no el `dist`: los comentarios no
 *   sobreviven a `tsc`.
 * · Es sintáctico. NO verifica que el motivo escrito sea verdad ni que
 *   corresponda a la fila que tiene debajo — comparar prosa contra conducta no
 *   es mecánico, y está dicho acá en vez de vendido de más.
 * · El piso mide la salud del recorrido (que el archivo se lea y que las filas
 *   se encuentren), nunca el tamaño de la deuda.
 */

const FUENTE = resolve(
  __dirname,
  '..',
  'src',
  'reports',
  'constants',
  'profile-report-content-requirement-by-reason.constant.ts',
);

/** Las líneas del archivo, ya sin el bloque de docblock de la constante. */
const lineas = () => readFileSync(FUENTE, 'utf8').split('\n');

/**
 * Por cada razón, el índice de la línea donde su fila abre. La fila puede
 * seguir en la línea de abajo cuando prettier la parte, así que se busca la
 * clave y no el valor.
 */
const lineaDeLaFila = (razon) => {
  const clave = `[ProfileReportReason.${razon}]:`;
  return lineas().findIndex((linea) => linea.trim().startsWith(clave));
};

/** El bloque de comentario que precede a una línea, hacia arriba. */
const comentarioSobre = (indice) => {
  const todas = lineas();
  const partes = [];
  for (let i = indice - 1; i >= 0; i -= 1) {
    const linea = todas[i].trim();
    if (!linea.startsWith('//')) break;
    partes.unshift(linea.slice(2).trim());
  }
  return partes.join(' ');
};

const razones = Object.keys(ProfileReportReason).map(
  (clave) => ProfileReportReason[clave],
);

/** El nombre del miembro del enum, que es como se escribe la clave del Record. */
const nombresDeRazon = Object.keys(ProfileReportReason);

test('mide algo: el archivo se lee y toda razón tiene su fila localizable', () => {
  // Sin esto, un archivo movido o una clave escrita de otra forma dejarían a
  // las dos reglas de abajo recorriendo conjunto vacío y dando verde.
  assert.ok(lineas().length > 20, 'el fuente de la constante no se leyó');
  assert.ok(nombresDeRazon.length >= 8, 'el enum de razones llegó vacío');

  const perdidas = nombresDeRazon.filter((razon) => lineaDeLaFila(razon) === -1);
  assert.deepEqual(
    perdidas,
    [],
    'hay razones cuya fila este gate no encuentra en el fuente: si la forma de ' +
      'la constante cambió, el roto es el gate y no la tabla.',
  );
});

test('la tabla es exactamente el enum de razones, sin sobras ni faltantes', () => {
  assert.deepEqual(
    Object.keys(PROFILE_REPORT_CONTENT_REQUIREMENT_BY_REASON).sort(),
    [...razones].sort(),
  );
});

test('cada fila lleva escrito por qué su razón exige, admite o rechaza la pieza', () => {
  const mudas = nombresDeRazon.filter(
    (razon) => comentarioSobre(lineaDeLaFila(razon)).length < 40,
  );

  assert.deepEqual(
    mudas,
    [],
    'estas razones tienen fila pero nadie escribió por qué. La pregunta es «¿bajar ' +
      'esa pieza resuelve el reclamo, o el sujeto es la conducta?»: contestala arriba ' +
      'de la fila, en una línea de comentario.',
  );
});

test('las tres clases tienen sujetos: la tabla clasifica, no niega en bloque', () => {
  // Una tabla que contestara lo mismo en las ocho filas no estaría decidiendo
  // nada, y el eje de tres estados sería un booleano disfrazado.
  const usados = new Set(
    Object.values(PROFILE_REPORT_CONTENT_REQUIREMENT_BY_REASON),
  );

  assert.deepEqual(
    [...usados].sort(),
    [
      ProfileReportContentRequirement.FORBIDDEN,
      ProfileReportContentRequirement.OPTIONAL,
      ProfileReportContentRequirement.REQUIRED,
    ].sort(),
  );
});
