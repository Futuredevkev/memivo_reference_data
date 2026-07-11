const test = require('node:test');
const assert = require('node:assert/strict');
const { ISO_COUNTRY_CODES } = require('../dist/index.js');

test('expone exactamente 203 códigos ISO-3166 alpha-2 únicos', () => {
  assert.equal(ISO_COUNTRY_CODES.length, 203);
  assert.equal(new Set(ISO_COUNTRY_CODES).size, 203, 'sin duplicados');
});

test('todo código es 2 letras mayúsculas', () => {
  for (const code of ISO_COUNTRY_CODES) {
    assert.match(code, /^[A-Z]{2}$/, `código inválido: ${code}`);
  }
});
