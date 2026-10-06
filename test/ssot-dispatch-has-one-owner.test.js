const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, readdirSync } = require('node:fs');
const { join, resolve } = require('node:path');
const inventory = require('../.github/actions/checkout-workspace/repositories.json');

/**
 * Los disparadores de SSOT no pueden elegir una corrida por fecha: dos jobs
 * simultaneos podian esperar el mismo run. El dueño pide el id al dispatch y
 * espera exactamente ese id. Corpus: los workflows de todo el inventario.
 * Alcance: jobs YAML llamados ssot; no interpreta anchors ni jobs renombrados.
 * El doble HTTP verifica payload, identidad y propagacion del rojo, no
 * los permisos ni la disponibilidad de GitHub en un runner real.
 * @control-positivo en este archivo: el control distingue delegar de elegir la primera corrida reciente
 */
const ROOT = resolve(__dirname, '..');
const ACTION = 'Futuredevkev/memivo_reference_data/.github/actions/dispatch-ssot@v1.158.25';
const problems = (source) => {
  const ssot = /^ {2}ssot:\s*\n([\s\S]*?)(?=^ {2}[\w-]+:\s*$|$(?![\s\S]))/m.exec(source.replace(/\r\n/g, '\n'));
  if (!ssot) return [];
  const body = ssot[1];
  return [
    !body.includes(`uses: ${ACTION}`) && 'dispatch fuera del dueño',
    /gh (?:workflow run|run (?:list|watch))/.test(body) && 'camino manual de dispatch',
    !body.includes('token: ${{ secrets.MEMIVO_REPOS_TOKEN }}') && 'token ausente',
    !body.includes('audit-ref: ${{ github.head_ref || github.ref_name }}') && 'rama ausente',
    /\b(?:needs|continue-on-error):/.test(body) && 'gate condicionado o rojo absorbido',
  ].filter(Boolean);
};

test('los jobs SSOT delegan al dueño, sin caminos manuales ni rojo absorbido', () => {
  let measured = 0;
  for (const repo of Object.values(inventory)) {
    const directory = join(ROOT, '..', repo.path, '.github/workflows');
    for (const file of readdirSync(directory).filter((name) => /\.ya?ml$/.test(name))) {
      const source = readFileSync(join(directory, file), 'utf8');
      // El workflow de contratos ejecuta la auditoria, no la dispara.
      if (repo === inventory.contracts) continue;
      if (/^ {2}ssot:/m.test(source)) measured++;
      assert.deepEqual(problems(source), [], `${repo.path}/${file}`);
    }
  }
  assert.ok(measured > 0, 'no se encontro ningun disparador');
});

test('el control distingue delegar de elegir la primera corrida reciente', () => {
  const source = `jobs:\n  ssot:\n    steps:\n      - uses: ${ACTION}\n        with:\n          token: \${{ secrets.MEMIVO_REPOS_TOKEN }}\n          audit-ref: \${{ github.head_ref || github.ref_name }}\n`;
  assert.deepEqual(problems(source), []);
  assert.ok(problems(source.replace(ACTION, 'manual@v1')).length > 0);
  assert.ok(problems(source + '      - run: gh run list --limit 20\n').length > 0);
  assert.ok(problems(source.replace('steps:', 'continue-on-error: true\n    steps:')).length > 0);
});

test('la accion ejecuta su dueño y el workflow versionado, no main por default', () => {
  const source = readFileSync(join(ROOT, '.github/actions/dispatch-ssot/action.yml'), 'utf8');
  assert.ok(source.includes('node "$GITHUB_ACTION_PATH/dispatch.cjs"'));
  assert.ok(source.includes('WORKFLOW_REF: ${{ github.action_ref }}'));
  assert.ok(source.includes('AUDIT_REF: ${{ inputs.audit-ref }}'));
  assert.ok(source.includes('GH_TOKEN: ${{ inputs.token }}'));
  assert.ok(source.includes('"$GITHUB_ACTION_PATH/../../../.node-version"'));
  assert.ok(source.includes('node-version: ${{ steps.runtime.outputs.version }}'));
  assert.equal(source.includes('node-version-file:'), false);
  assert.ok(source.includes('[[ "$version" =~ ^[0-9]+\\.[0-9]+\\.[0-9]+$ ]]'));
  assert.ok(source.indexOf('id: runtime') < source.indexOf('uses: actions/setup-node@v4'));
  assert.ok(source.indexOf('uses: actions/setup-node@v4') < source.indexOf('node "$GITHUB_ACTION_PATH/dispatch.cjs"'));
});

const response = (payload, status = 200) => ({ status, json: async () => payload });
const options = { token: 'TOKEN-DE-PRUEBA', auditRef: 'v1.158.22', workflowRef: 'v1.158.22' };

test('cada disparo espera su propio id y no consulta una lista', async () => {
  const { dispatchSsot } = require('../.github/actions/dispatch-ssot/dispatch.cjs');
  const watched = [];
  for (const id of [123, 456]) {
    await dispatchSsot({ ...options, auditRef: 'rama con "comillas"' }, { request: async (url, request) => {
      assert.equal(url.includes('TOKEN-DE-PRUEBA'), false);
      assert.equal(request.headers.Authorization, 'Bearer TOKEN-DE-PRUEBA');
      assert.equal(request.redirect, 'error');
      assert.ok(request.signal instanceof AbortSignal);
      if (request.method === 'POST') {
        assert.equal(url, `https://api.github.com/repos/${inventory.contracts.repository}/actions/workflows/ssot.yml/dispatches`);
        assert.deepEqual(JSON.parse(request.body), { ref: 'v1.158.22', inputs: { audit_ref: 'rama con "comillas"' }, return_run_details: true });
        return response({ workflow_run_id: id });
      }
      assert.equal(request.method, 'GET');
      assert.equal(url, `https://api.github.com/repos/${inventory.contracts.repository}/actions/runs/${id}`);
      watched.push(id);
      return response({ id, status: 'completed', conclusion: 'success' });
    } });
  }
  assert.deepEqual(watched, [123, 456]);
});

test('dos disparos solapados mantienen separados sus sondeos', async () => {
  const { dispatchSsot } = require('../.github/actions/dispatch-ssot/dispatch.cjs');
  let release;
  const barrier = new Promise((resolve) => { release = resolve; });
  let waiting = 0;
  const queried = new Map();
  await Promise.all([123, 456].map((id) => dispatchSsot(options, {
    pause: async () => { if (++waiting === 2) release(); await barrier; },
    request: async (url, request) => {
      if (request.method === 'POST') return response({ workflow_run_id: id });
      assert.equal(url, `https://api.github.com/repos/${inventory.contracts.repository}/actions/runs/${id}`);
      const count = (queried.get(id) || 0) + 1;
      queried.set(id, count);
      return response({ id, status: count === 1 ? 'queued' : 'completed', conclusion: 'success' });
    },
  })));
  assert.deepEqual([...queried.entries()], [[123, 2], [456, 2]]);
});

test('dispatch sin id, autenticacion y toda conclusion no exitosa fallan fuerte', async () => {
  const { dispatchSsot } = require('../.github/actions/dispatch-ssot/dispatch.cjs');
  for (const payload of [{}, { workflow_run_id: null }, { workflow_run_id: '123' }, { workflow_run_id: 0 }]) {
    await assert.rejects(dispatchSsot(options, { request: async () => response(payload) }));
  }
  for (const status of [204, 401, 403, 404, 500]) await assert.rejects(dispatchSsot(options, { request: async () => response({}, status) }), /HTTP/);
  await assert.rejects(dispatchSsot(options, { request: async () => { throw new Error('timeout de red'); } }), /timeout/);
  for (const conclusion of ['failure', 'cancelled', 'timed_out', 'skipped', 'neutral', null]) {
    await assert.rejects(dispatchSsot(options, { request: async (_url, request) => response(request.method === 'POST' ? { workflow_run_id: 123 } : { id: 123, status: 'completed', conclusion }) }), /success/);
  }
  for (const key of Object.keys(options)) await assert.rejects(dispatchSsot({ ...options, [key]: '' }, { request: async () => assert.fail('no debe pedir HTTP') }));
});

test('el sondeo espera al propio run con cota y rechaza un id o estado ajenos', async () => {
  const { dispatchSsot } = require('../.github/actions/dispatch-ssot/dispatch.cjs');
  let clock = 0;
  let queried = 0;
  await dispatchSsot(options, {
    now: () => clock, pause: async (ms) => { clock += ms; },
    request: async (_url, request) => response(request.method === 'POST' ? { workflow_run_id: 123 } : { id: 123, status: ++queried === 1 ? 'queued' : 'completed', conclusion: 'success' }),
  });
  assert.equal(queried, 2);
  assert.equal(clock, 20000);
  clock = 0;
  await assert.rejects(dispatchSsot(options, {
    now: () => clock, pause: async () => { clock += 27 * 60 * 1000; },
    request: async (_url, request) => response(request.method === 'POST' ? { workflow_run_id: 123 } : { id: 123, status: 'queued' }),
  }), /agoto/);
  for (const run of [{ id: 456, status: 'completed', conclusion: 'success' }, { id: 123, status: 'desconocido' }]) {
    await assert.rejects(dispatchSsot(options, { request: async (_url, request) => response(request.method === 'POST' ? { workflow_run_id: 123 } : run) }));
  }
});
