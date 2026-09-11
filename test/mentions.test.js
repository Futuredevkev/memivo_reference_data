const test = require('node:test');
const assert = require('node:assert/strict');

const mentions = require('../dist/mentions/index.js');
const common = require('../dist/common/index.js');
const validation = require('../dist/validation/index.js');

/**
 * LAS MENCIONES: la invariante, la forma y el nombre visible del que dependen.
 *
 * ── LO QUE ESTA SUITE PROTEGE ──────────────────────────────────────────────
 * Que las DOS puntas contesten lo mismo sobre la misma lista. El servidor usa
 * estas funciones para aceptar o rechazar una escritura, y la app para no
 * mandar nunca algo que el servidor vaya a rechazar. Los casos que importan son
 * los que una implementación a mano escribiría mal: el nombre con espacios en
 * los bordes (donde las dos derivaciones viejas ya divergían), el offset
 * después de un emoji (la unidad es UTF-16, no «caracteres») y el borde exacto
 * del solapamiento.
 */

test('el nombre visible recorta CADA parte antes de juntarlas', () => {
  // La forma en que el servidor lo hacía antes —juntar y recortar— daba dos
  // espacios acá, y la mención escrita por la app no coincidía.
  assert.equal(
    common.formatPersonDisplayName({ name: 'Ana ', lastName: ' López' }),
    'Ana López',
  );
});

test('el nombre visible tolera partes ausentes sin inventar respaldo', () => {
  assert.equal(common.formatPersonDisplayName({ name: 'Ana', lastName: null }), 'Ana');
  assert.equal(common.formatPersonDisplayName({ name: null, lastName: 'López' }), 'López');
  assert.equal(common.formatPersonDisplayName({}), '');
});

test('la invariante acepta el nombre exacto con el disparador adelante', () => {
  const text = 'hola @Ana López, mirá';
  assert.equal(
    mentions.mentionMatchesText(
      text,
      { start: 5, length: '@Ana López'.length },
      { name: 'Ana', lastName: 'López' },
    ),
    true,
  );
});

test('la invariante rechaza un nombre que no es el de la persona', () => {
  const text = 'hola @Ana Pérez';
  assert.equal(
    mentions.mentionMatchesText(
      text,
      { start: 5, length: '@Ana Pérez'.length },
      { name: 'Ana', lastName: 'López' },
    ),
    false,
  );
});

test('los offsets son UTF-16: un emoji antes corre el inicio DOS unidades', () => {
  const text = '🎉 @Ana López';
  // `'🎉'.length` es 2 en JavaScript: el `@` está en 3, no en 2.
  assert.equal(text.indexOf('@'), 3);
  assert.equal(
    mentions.mentionMatchesText(
      text,
      { start: 3, length: 10 },
      { name: 'Ana', lastName: 'López' },
    ),
    true,
  );
  assert.equal(mentions.findMentionAnnotationsDefect(text, [{ userId: 'u', start: 3, length: 10 }]), null);
});

test('una lista bien formada no tiene defecto, aunque repita persona o las mentions se toquen', () => {
  const text = '@Ana López@Ana López';
  assert.equal(
    mentions.findMentionAnnotationsDefect(text, [
      { userId: 'u1', start: 0, length: 10 },
      { userId: 'u1', start: 10, length: 10 },
    ]),
    null,
  );
  assert.equal(mentions.findMentionAnnotationsDefect('sin nada', []), null);
});

test('cada defecto se reconoce por su causa', () => {
  const text = 'hola @Ana y @Beto';
  const cases = [
    [[{ userId: 'u', start: 5.5, length: 4 }], 'malformed'],
    [[{ userId: 'u', start: -1, length: 4 }], 'malformed'],
    [[{ userId: 'u', start: 5, length: 1 }], 'malformed'],
    [[{ userId: 'u', start: 12, length: 99 }], 'out-of-bounds'],
    [[{ userId: 'u', start: 0, length: 4 }], 'not-on-trigger'],
    [
      [
        { userId: 'u', start: 12, length: 5 },
        { userId: 'v', start: 5, length: 4 },
      ],
      'unordered-or-overlapping',
    ],
    [
      [
        { userId: 'u', start: 5, length: 8 },
        { userId: 'v', start: 12, length: 5 },
      ],
      'unordered-or-overlapping',
    ],
  ];
  for (const [annotations, expected] of cases) {
    assert.equal(
      mentions.findMentionAnnotationsDefect(text, annotations),
      expected,
      JSON.stringify(annotations),
    );
  }
});

test('el tope se pregunta PRIMERO y sale de la constante publicada', () => {
  const max = validation.MENTIONS_MAX_ITEMS;
  assert.ok(max > 0);
  const text = '@a '.repeat(max + 1);
  const exact = Array.from({ length: max }, (_, i) => ({ userId: `u${i}`, start: i * 3, length: 2 }));
  assert.equal(mentions.findMentionAnnotationsDefect(text, exact), null, 'el límite exacto entra');

  // Uno de más, y además mal formado: gana el tope, que es lo único que la
  // persona puede resolver sola.
  const tooMany = [...exact, { userId: 'x', start: -1, length: 0 }];
  assert.equal(mentions.findMentionAnnotationsDefect(text, tooMany), 'too-many');
});

test('el trozo de una anotación es el `slice` UTF-16, con el disparador incluido', () => {
  const text = '🎉 hola @Ana López!';
  const start = text.indexOf('@');
  assert.equal(mentions.mentionTextOf(text, { start, length: 10 }), '@Ana López');
  // Un offset fuera del texto no revienta: devuelve lo que hay, y la forma la
  // rechaza `findMentionAnnotationsDefect` antes de que nadie lo use.
  assert.equal(mentions.mentionTextOf('@a', { start: 0, length: 99 }), '@a');
});

test('el disparador publicado es el que la invariante compara', () => {
  assert.equal(mentions.MENTION_TRIGGER, '@');
});

test('la consulta de una mención tiene piso y techo coherentes', () => {
  // El techo es el del término de búsqueda: la consulta viaja como `search`, y
  // arriba de ese tope el servidor la rechaza.
  assert.equal(mentions.MENTION_QUERY_MAX_LENGTH, validation.SEARCH_TERM_MAX);
  assert.ok(mentions.MENTION_QUERY_MIN_LENGTH >= 1);
  assert.ok(mentions.MENTION_QUERY_MIN_LENGTH <= mentions.MENTION_QUERY_MAX_LENGTH);
  // Nombre y apellido tienen que caber: con menos de dos palabras no se podría
  // escribir el apellido, que es la mitad de lo que se pidió.
  assert.ok(mentions.MENTION_QUERY_MAX_WORDS >= 2);
});
