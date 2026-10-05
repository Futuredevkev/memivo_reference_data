const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, readdirSync, mkdtempSync, mkdirSync, rmSync } = require('node:fs');
const { join, resolve, dirname, basename } = require('node:path');
const { tmpdir } = require('node:os');
const { spawnSync } = require('node:child_process');
const { prepareWorkspace } = require('../.github/actions/checkout-workspace/workspace.cjs');
const inventory = require('../.github/actions/checkout-workspace/repositories.json');

/**
 * Los jobs que corren los gates preparan el mismo workspace, sin clones
 * privados por consumidor. El corpus de repos sale del gate cross-repo.
 * Se siguen los checkouts de la accion y se ejecuta su CLI con un Git doble
 * para probar rama presente, ausente y fallo de transporte por separado.
 * Alcance: YAML en bloque y comandos npm escritos en el job; no interpreta
 * anchors, workflows reutilizables ni scripts que escondan una invocacion.
 * Los permisos reales del token y actions/checkout se prueban en GitHub.
 * @control-positivo en este archivo: caza la accion ausente y los paths desviados
 */
const ROOT = resolve(__dirname, '..');
const WORKSPACE = dirname(ROOT);
const ACTION_PATH = join(ROOT, '.github/actions/checkout-workspace/action.yml');
const RUNS_GATES = /^\s*(?:(?:-\s*)?run:\s*)?npm (?:run (?:quality|mutants|test(?::[\w:-]+)?)|test)(?:\s|$)/;
const action = () => readFileSync(ACTION_PATH, 'utf8').replace(/\r\n/g, '\n');
const repositories = () => [...readFileSync(join(__dirname, 'gate-corpus-control-positive-ratio.test.js'), 'utf8').matchAll(/repo:\s*'([^']+)'/g)].map((match) => match[1]);

const verifyRuntime = (runtime, installed) => {
  assert.match(runtime, /^\d+\.\d+\.\d+$/, 'el runtime debe estar pineado, no flotar por major');
  assert.equal(installed, runtime, 'quality debe usar el mismo runtime que los consumidores de CI');
};

const jobs = (source) => {
  const result = [];
  let current;
  let inJobs = false;
  for (const line of source.replace(/\r\n/g, '\n').split('\n')) {
    if (/^[A-Za-z]/.test(line)) {
      inJobs = /^jobs:\s*$/.test(line);
      current = undefined;
    }
    if (!inJobs) continue;
    const name = /^ {2}([\w-]+):\s*$/.exec(line);
    if (name) {
      current = { name: name[1], lines: [] };
      result.push(current);
    } else if (current) current.lines.push(line);
  }
  return result;
};

const infrastructureProblems = (source, repository) => {
  const found = [];
  for (const step of source.replace(/\r\n/g, '\n').split(/^      - /m)) {
    if (/uses: actions\/setup-node@/.test(step)) {
      if (!/^          node-version-file: memivo-reference-data\/\.node-version\s*$/m.test(step) || /^\s*node-version:/m.test(step)) found.push('Node fuera del dueño');
    }
    if (/uses: actions\/upload-artifact@/.test(step)) {
      if (!new RegExp(`^          path: ${repository}/[^\\n]+$`, 'm').test(step)) found.push('artefacto fuera del checkout');
    }
    if (/uses: reactivecircus\/android-emulator-runner@/.test(step)) {
      if (!step.includes(`          working-directory: ${repository}\n`)) found.push('emulador fuera del checkout');
    }
  }
  return found;
};

const problems = (source, repository) => jobs(source).flatMap((job) => {
  const firstTest = job.lines.findIndex((line) => RUNS_GATES.test(line));
  if (firstTest === -1) return [];
  const found = [];
  const checkout = job.lines.findIndex((line) => /^\s*- uses: Futuredevkev\/memivo_reference_data\/\.github\/actions\/checkout-workspace@v[\d.]+\s*$/.test(line));
  if (checkout === -1 || checkout >= firstTest) found.push('checkout ausente o tardio');
  if (!job.lines.some((line) => line === `        working-directory: ${repository}`)) found.push('directorio de ejecucion desviado');
  if (checkout >= 0) {
    const remainder = job.lines.slice(checkout + 1);
    const end = remainder.findIndex((line) => /^      - /.test(line));
    const step = remainder.slice(0, end === -1 ? undefined : end).join('\n');
    if (!/^          token: \$\{\{ secrets\.MEMIVO_REPOS_TOKEN \}\}\s*$/m.test(step)) found.push('token ausente');
    if (!/^          candidate: \$\{\{ .+ \}\}\s*$/m.test(step)) found.push('rama ausente');
    if (/^\s*(?:if|continue-on-error):/m.test(step)) found.push('checkout condicional o fallo absorbido');
  }
  if (job.lines.some((line) => /^\s*cache: npm\s*$/.test(line)) && !job.lines.some((line) => line.trim() === `cache-dependency-path: ${repository}/package-lock.json`)) found.push('cache sin lock del checkout');
  return found.map((problem) => `${repository}/${job.name}: ${problem}`);
});

test('todos los jobs de gates usan el dueño antes de correr y con el layout correcto', () => {
  const repos = repositories();
  assert.ok(repos.length >= 4);
  let measured = 0;
  const references = new Set();
  for (const repo of repos) {
    const workflowRoot = join(WORKSPACE, repo, '.github/workflows');
    const files = readdirSync(workflowRoot).filter((file) => /\.ya?ml$/.test(file));
    assert.ok(files.length > 0, `sin workflows: ${repo}`);
    let repoJobs = 0;
    for (const file of files) {
      const source = readFileSync(join(workflowRoot, file), 'utf8');
      assert.deepEqual(problems(source, repo), [], file);
      assert.deepEqual(infrastructureProblems(source, repo), [], file);
      for (const job of jobs(source)) {
        if (job.lines.some((line) => RUNS_GATES.test(line))) repoJobs++;
      }
      for (const match of source.matchAll(/^\s*- uses: (Futuredevkev\/memivo_reference_data\/\.github\/actions\/checkout-workspace@v[\d.]+)\s*$/gm)) references.add(match[1]);
    }
    assert.ok(repoJobs > 0, `el corpus perdio los jobs de ${repo}`);
    measured += repoJobs;
  }
  assert.ok(measured >= 5);
  assert.equal(references.size, 1, 'los consumidores apuntan a versiones distintas del dueño');
  verifyRuntime(readFileSync(join(ROOT, '.node-version'), 'utf8').trim(), process.versions.node);
});

test('el control del runtime rechaza un major flotante y una version distinta', () => {
  const runtime = readFileSync(join(ROOT, '.node-version'), 'utf8').trim();
  verifyRuntime(runtime, runtime);
  assert.throws(() => verifyRuntime(runtime.split('.')[0], runtime), /pineado/);
  assert.throws(() => verifyRuntime(runtime, `${runtime}.otro`), /mismo runtime/);
});

test('la accion trae exactamente el corpus y conserva el SHA del checkout propio', () => {
  const steps = action().split(/^    - /m).filter((step) => /^      uses: actions\/checkout@v4\s*$/m.test(step));
  assert.equal(steps.length, Object.keys(inventory).length);
  assert.deepEqual(Object.values(inventory).map((repo) => repo.path).sort(), repositories().sort());
  assert.ok(action().includes('workspace.cjs" metadata'));
  assert.ok(action().includes('id: inventory'));
  assert.ok(action().indexOf('workspace.cjs" metadata') < action().indexOf('uses: actions/checkout@v4'));
  assert.ok(action().includes('workspace.cjs" align'));
  for (const key of Object.keys(inventory)) {
    const step = steps.find((entry) => entry.includes(`path: \${{ fromJSON(steps.inventory.outputs.repositories).${key}.path }}`));
    assert.ok(step, key);
    assert.ok(step.includes(`repository: \${{ fromJSON(steps.inventory.outputs.repositories).${key}.repository }}`));
    assert.ok(step.includes(`ref: \${{ github.repository == fromJSON(steps.inventory.outputs.repositories).${key}.repository && github.sha || '' }}`));
    assert.ok(step.includes('token: \${{ inputs.token }}'));
  }
});

test('caza la accion ausente y los paths desviados', () => {
  const source = readFileSync(join(WORKSPACE, 'memivo_client/.github/workflows/quality.yml'), 'utf8');
  assert.deepEqual(problems(source, 'memivo_client'), []);
  assert.ok(problems(source.replace(/- uses: Futuredevkev\/memivo_reference_data\/\.github\/actions\/checkout-workspace@v[\d.]+/, '- uses: actions/checkout@v4'), 'memivo_client').length > 0);
  assert.ok(problems(source.replace('working-directory: memivo_client', 'working-directory: other'), 'memivo_client').length > 0);
  assert.ok(problems(source.replace('cache-dependency-path: memivo_client/package-lock.json', 'cache-dependency-path: package-lock.json'), 'memivo_client').length > 0);
  assert.ok(problems(source.replace('token: ${{ secrets.MEMIVO_REPOS_TOKEN }}', 'token: ${{ github.token }}'), 'memivo_client').length > 0);
  assert.ok(infrastructureProblems(source.replace('node-version-file: memivo-reference-data/.node-version', 'node-version: 20'), 'memivo_client').length > 0);
  assert.ok(infrastructureProblems(source.replace('path: memivo_client/build/', 'path: build/'), 'memivo_client').length > 0);
  const android = readFileSync(join(WORKSPACE, 'memivo_client/.github/workflows/android-e2e.yml'), 'utf8');
  assert.deepEqual(infrastructureProblems(android, 'memivo_client'), []);
  assert.ok(infrastructureProblems(android.replace('          working-directory: memivo_client', '          working-directory: other'), 'memivo_client').length > 0);
});

const runAlignment = (status, sourceRemote) => {
  const directory = mkdtempSync(join(tmpdir(), 'memivo-checkout-'));
  const calls = [];
  try {
    for (const repo of Object.values(inventory)) mkdirSync(join(directory, repo.path, '.git'), { recursive: true });
    prepareWorkspace({
      workspace: directory, candidate: 'v1.158.22', sourceRepository: inventory.client.repository,
    }, (command, args, options) => {
      assert.equal(command, 'git');
      assert.equal(args.some((arg) => arg.includes('TOKEN-DE-PRUEBA')), false);
      calls.push({ args, env: options.env });
      assert.notEqual(args[0], 'clone', 'la adquisicion pertenece a actions/checkout');
      if (args.includes('remote')) {
        const path = basename(args[1]);
        const repo = Object.values(inventory).find((entry) => entry.path === path);
        return { status: 0, stdout: repo === inventory.client && sourceRemote ? sourceRemote : `https://github.com/${repo.repository}.git\n` };
      }
      return { status: args.includes('ls-remote') ? status : 0, stdout: '' };
    });
    return calls;
  } finally {
    assert.equal(dirname(resolve(directory)), resolve(tmpdir()));
    assert.ok(basename(directory).startsWith('memivo-checkout-'));
    rmSync(directory, { recursive: true, force: true });
  }
};

test('rama existente: alinea hermanos sin reemplazar el SHA propio', () => {
  const calls = runAlignment(0);
  const fetches = calls.filter((call) => call.args.includes('fetch'));
  assert.equal(fetches.length, repositories().length - 1);
  assert.ok(fetches.every((call) => basename(call.args[1]) !== inventory.client.path));
  assert.ok(fetches.every((call) => call.args.at(-1) === 'refs/heads/v1.158.22'));
});

test('rama ausente: solo exit 2 habilita el fallback a HEAD remoto', () => {
  const calls = runAlignment(2);
  const fetches = calls.filter((call) => call.args.includes('fetch'));
  assert.equal(fetches.length, repositories().length - 1);
  assert.ok(fetches.every((call) => call.args.at(-1) === 'HEAD'));
});

test('autenticacion o red fallan fuerte, sin fallback', () => {
  assert.throws(() => runAlignment(128), /Git fallo \(128\)/);
});

test('un checkout ausente o un repositorio propio ajeno no habilitan clonados manuales', () => {
  const directory = mkdtempSync(join(tmpdir(), 'memivo-checkout-'));
  try {
    const options = { workspace: directory, candidate: 'v1.158.22', sourceRepository: inventory.client.repository };
    const execute = (_command, args) => {
      assert.notEqual(args[0], 'clone');
      return { status: 0, stdout: '' };
    };
    assert.throws(() => prepareWorkspace(options, execute), /Falta el checkout esperado/);
    assert.throws(() => prepareWorkspace({ ...options, sourceRepository: 'otro/repo' }, execute), /no pertenece al inventario/);
  } finally {
    assert.equal(dirname(resolve(directory)), resolve(tmpdir()));
    assert.ok(basename(directory).startsWith('memivo-checkout-'));
    rmSync(directory, { recursive: true, force: true });
  }
});

test('el origin SSH y diferencias de mayusculas identifican el mismo checkout propio', () => {
  assert.equal(runAlignment(0, 'git@github.com:futuredevkev/MEMIVO_CLIENT.git\n').filter((call) => call.args.includes('fetch')).length, repositories().length - 1);
  assert.throws(() => runAlignment(0, 'https://github.com/otro/cliente.git\n'), /Origin desviado/);
});

test('Git real: rama presente y ausente conservan el SHA propio sin clonados manuales', () => {
  const root = mkdtempSync(join(tmpdir(), 'memivo-checkout-'));
  try {
    const remotes = join(root, 'remotes');
    const workspace = join(root, 'workspace');
    const seed = join(root, 'seed');
    mkdirSync(workspace);
    const git = (args, options = {}) => {
      const result = spawnSync('git', args, { encoding: 'utf8', timeout: 15000, ...options });
      assert.equal(result.status, 0, result.stderr);
      return result.stdout.trim();
    };
    git(['init', '--initial-branch=main', seed]);
    const commit = (message) => git(['-C', seed, '-c', 'user.name=Prueba CI', '-c', 'user.email=ci@example.test', '-c', 'commit.gpgsign=false', 'commit', '--allow-empty', '-m', message]);
    commit('base');
    const base = git(['-C', seed, 'rev-parse', 'HEAD']);
    git(['-C', seed, 'checkout', '-b', 'v1.158.22']);
    commit('candidato');
    const candidate = git(['-C', seed, 'rev-parse', 'HEAD']);
    git(['-C', seed, 'checkout', 'main']);
    for (const repo of Object.values(inventory)) {
      const remote = join(remotes, `${repo.repository}.git`);
      mkdirSync(dirname(remote), { recursive: true });
      git(['clone', '--bare', seed, remote]);
    }
    const rewrite = `url.${remotes.replace(/\\/g, '/')}/.insteadOf`;
    const env = { ...process.env, GIT_CONFIG_COUNT: '1', GIT_CONFIG_KEY_0: rewrite, GIT_CONFIG_VALUE_0: 'https://github.com/' };
    const source = join(workspace, inventory.client.path);
    for (const repo of Object.values(inventory)) {
      git(['clone', `https://github.com/${repo.repository}.git`, join(workspace, repo.path)], { env });
    }
    const execute = (command, args, options) => spawnSync(command, args, {
      ...options,
      env: args.includes('remote') ? options.env : { ...options.env, GIT_CONFIG_COUNT: '1', GIT_CONFIG_KEY_0: rewrite, GIT_CONFIG_VALUE_0: 'https://github.com/' },
    });
    const options = { workspace, sourceRepository: inventory.client.repository, candidate: 'v1.158.22' };
    prepareWorkspace(options, execute);
    assert.equal(git(['-C', source, 'rev-parse', 'HEAD']), base);
    for (const repo of Object.values(inventory).filter((entry) => entry !== inventory.client)) {
      const directory = join(workspace, repo.path);
      assert.equal(git(['-C', directory, 'rev-parse', 'HEAD']), candidate);
      const config = readFileSync(join(directory, '.git/config'), 'utf8');
      assert.equal(config.includes('TOKEN-DE-PRUEBA'), false);
      assert.equal(config.includes('extraheader'), false);
    }
    prepareWorkspace({ ...options, candidate: 'rama-ausente' }, execute);
    for (const repo of Object.values(inventory).filter((entry) => entry !== inventory.client)) {
      assert.equal(git(['-C', join(workspace, repo.path), 'rev-parse', 'HEAD']), base);
    }
    const output = join(root, 'outputs');
    const result = spawnSync(process.execPath, [join(dirname(ACTION_PATH), 'workspace.cjs'), 'metadata'], { env: { ...process.env, GITHUB_OUTPUT: output }, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(JSON.parse(readFileSync(output, 'utf8').trim().slice('repositories='.length)), inventory);
  } finally {
    assert.equal(dirname(resolve(root)), resolve(tmpdir()));
    assert.ok(basename(root).startsWith('memivo-checkout-'));
    rmSync(root, { recursive: true, force: true });
  }
});
