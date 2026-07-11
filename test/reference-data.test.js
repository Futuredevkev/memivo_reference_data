const test = require('node:test');
const assert = require('node:assert/strict');
const { ISO_COUNTRY_CODES, isCountryCode } = require('../dist/index.js');

test('expone exactamente 203 códigos ISO-3166 alpha-2 únicos', () => {
  assert.equal(ISO_COUNTRY_CODES.length, 203);
  assert.equal(new Set(ISO_COUNTRY_CODES).size, 203, 'sin duplicados');
});

test('todo código es 2 letras mayúsculas', () => {
  for (const code of ISO_COUNTRY_CODES) {
    assert.match(code, /^[A-Z]{2}$/, `código inválido: ${code}`);
  }
});

test('isCountryCode valida pertenencia', () => {
  assert.ok(isCountryCode('UY'));
  assert.ok(isCountryCode('DE'));
  assert.ok(!isCountryCode('XX'));
  assert.ok(!isCountryCode('uy'), 'case-sensitive: los códigos son mayúsculas');
});
