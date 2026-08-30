const assert = require('node:assert/strict');
const test = require('node:test');

const {
  normalizeStickerQuery,
  STICKER_QUERY_MAX_LENGTH,
} = require('../dist/stickers/index.js');

/**
 * La identidad de una búsqueda tiene que ser igual en las dos cachés.
 *
 * Estos casos ejercitan cada operación por separado: si el helper se redujera
 * otra vez a `trim`, el contrato seguiría compilando y el defecto reaparecería
 * sólo como requests duplicadas.
 */
test('la búsqueda de stickers tiene una sola normalización compartida', () => {
  assert.equal(normalizeStickerQuery(' GATO   negro '), 'gato negro');
  assert.equal(normalizeStickerQuery('Año Nuevo'), 'año nuevo');
  assert.equal(normalizeStickerQuery('\t gato\nnegro \r'), 'gato negro');
  assert.equal(normalizeStickerQuery('I'), 'i');
});

test('el normalizador y el borde comparten el mismo tope', () => {
  const overLimit = 'a'.repeat(STICKER_QUERY_MAX_LENGTH + 1);

  assert.equal(normalizeStickerQuery(overLimit).length, STICKER_QUERY_MAX_LENGTH);
});
