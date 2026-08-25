const test = require('node:test');
const assert = require('node:assert/strict');

const stickers = require('../dist/stickers/index.js');

/**
 * LA PUERTA de la edición en las superficies de texto-o-sticker.
 *
 * ── LO QUE ESTA SUITE PROTEGE, Y NO ES «QUE COMPARE BIEN» ─────────────────
 * Que las DOS puntas contesten lo mismo. La función es de una línea; lo que
 * vale es que exista UNA sola y que el paquete la publique, porque el servidor
 * la usa como gate de tres endpoints y la app para decidir si dibuja «Editar».
 * Mientras la regla estuvo escrita de los dos lados, la app ofrecía un botón
 * cuyo único final posible era un toast rojo.
 *
 * El caso que de verdad importa es el `undefined`: el servidor lee la columna y
 * la app la deriva de `sticker?.id`, así que una proyección incompleta de un
 * lado o un campo que no viajó del otro llegan como ausencia, no como `null`. Y
 * ahí la respuesta segura es «no se edita»: negar una edición legítima se ve y
 * se reporta; permitir una que el `CHECK` va a rechazar es un 500.
 */
test('un contenido de TEXTO se edita', () => {
  assert.equal(stickers.isStickerContentEditable(null), true);
});

test('un contenido de STICKER no se edita', () => {
  assert.equal(stickers.isStickerContentEditable('sticker-1'), false);
});

test('la ausencia NO se edita: falla cerrado', () => {
  assert.equal(stickers.isStickerContentEditable(undefined), false);
});

test('acepta la OTRA cara del mismo hecho: la referencia que le llega a la app', () => {
  // El servidor pregunta con la columna y la app con lo que viaja. Si esta
  // firma dejara de aceptar las dos, una de las puntas volvería a derivarlo
  // por su cuenta, que es lo que la puerta existe para impedir.
  assert.equal(
    stickers.isStickerContentEditable({ provider: 'GIPHY', externalId: 'a' }),
    false,
  );
});

test('la publica el barrel del paquete, que es lo que las dos puntas importan', () => {
  assert.equal(
    typeof require('../dist/index.js').isStickerContentEditable,
    'function',
  );
});
