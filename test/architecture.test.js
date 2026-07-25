const test = require('node:test');
const assert = require('node:assert/strict');
const { existsSync, readdirSync, statSync } = require('node:fs');
const { resolve } = require('node:path');

const root = resolve(__dirname, '..', 'src');
const expectedDomains = [
  'album',
  'auth',
  'chat',
  'common',
  'downloads',
  'errors',
  'highlights',
  'media',
  'notifications',
  'polls',
  'reactions',
  'reference-data',
  'reports',
  'sockets',
  'social',
  'stories',
  'validation',
];

test('todos los dominios tienen un barrel explícito', () => {
  for (const domain of expectedDomains) {
    assert.ok(existsSync(resolve(root, domain, 'index.ts')), `${domain}/index.ts`);
  }
});

test('el root no acumula contratos sueltos', () => {
  const looseTypeScriptFiles = readdirSync(root).filter((entry) => {
    const path = resolve(root, entry);
    return statSync(path).isFile() && entry.endsWith('.ts') && entry !== 'index.ts';
  });

  assert.deepEqual(looseTypeScriptFiles, []);
});
