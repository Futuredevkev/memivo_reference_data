const { spawnSync } = require('node:child_process');
const { existsSync, appendFileSync } = require('node:fs');
const { resolve, dirname } = require('node:path');
const repositories = require('./repositories.json');

function foreignGitEnvironment(base = process.env, execute = spawnSync) {
  const result = execute('git', ['rev-parse', '--local-env-vars'], { env: base, encoding: 'utf8', timeout: 15000 });
  if (result.error || result.status !== 0 || !result.stdout.trim()) throw new Error('No se pudo aislar el entorno local de Git');
  const env = { ...base };
  for (const name of result.stdout.trim().split(/\r?\n/)) delete env[name];
  for (const name of Object.keys(env)) if (/^GIT_CONFIG_(KEY|VALUE)_\d+$/.test(name)) delete env[name];
  return env;
}

/**
 * Inventario y alineacion compartidos por los jobs de Actions. Sus checkouts
 * nativos son dueños de las credenciales y de su limpieza. Solo exit 2 significa
 * rama ausente; un fallo de autenticacion o red no habilita el fallback. Nunca
 * cambia el SHA del checkout que disparo la corrida ni adquiere repos a mano.
 */
function prepareWorkspace(options, execute = spawnSync) {
  const { candidate, sourceRepository } = options;
  if (!options.workspace || !candidate || !sourceRepository) throw new Error('Faltan workspace, candidate o sourceRepository');
  const workspace = resolve(options.workspace);
  const env = { ...foreignGitEnvironment(process.env, execute), GIT_TERMINAL_PROMPT: '0' };
  // Las trazas de curl pueden volcar cabeceras de autenticacion.
  for (const key of Object.keys(env)) if (key.startsWith('GIT_TRACE')) delete env[key];
  delete env.GIT_CURL_VERBOSE;
  const git = (args, accepted = [0]) => {
    const result = execute('git', args, { env, encoding: 'utf8', timeout: 120000 });
    if (result.error || !accepted.includes(result.status)) throw new Error(`Git fallo (${result.status ?? 'sin exit code'}) al ejecutar ${args.includes('ls-remote') ? 'ls-remote' : args[0]}`);
    return result;
  };
  git(['check-ref-format', '--branch', candidate]);
  const canonicalRepository = (remote) => {
    const value = remote.trim().replace(/^git@github\.com:/, 'https://github.com/');
    const url = new URL(value);
    if (url.hostname !== 'github.com' || url.protocol !== 'https:') throw new Error('El checkout propio no es de GitHub HTTPS/SSH');
    return url.pathname.replace(/^\//, '').replace(/\.git$/, '').toLowerCase();
  };
  const ownRepository = sourceRepository.toLowerCase();
  const ownEntry = Object.values(repositories).find((repo) => repo.repository.toLowerCase() === ownRepository);
  if (!ownEntry) throw new Error('El checkout propio no pertenece al inventario');
  for (const repo of Object.values(repositories)) {
    const own = repo.repository.toLowerCase() === ownRepository;
    const directory = resolve(workspace, repo.path);
    if (dirname(directory) !== workspace) throw new Error(`Path fuera del workspace: ${repo.path}`);
    if (!existsSync(resolve(directory, '.git'))) {
      throw new Error(`Falta el checkout esperado: ${repo.path}`);
    }
    const origin = canonicalRepository(git(['-C', directory, 'remote', 'get-url', 'origin']).stdout);
    if (origin !== repo.repository.toLowerCase()) throw new Error(`Origin desviado: ${repo.path}`);
    if (own) continue;
    const branch = git(['-C', directory, 'ls-remote', '--exit-code', '--heads', 'origin', `refs/heads/${candidate}`], [0, 2]);
    if (branch.status === 2) {
      console.log(`::notice::${repo.path} no tiene ${candidate}; se audita su rama por default`);
    }
    git(['-C', directory, 'fetch', '--depth=1', 'origin', branch.status === 2 ? 'HEAD' : `refs/heads/${candidate}`]);
    git(['-C', directory, 'checkout', '--detach', 'FETCH_HEAD']);
  }
}

if (require.main === module) {
  try {
    if (process.argv[2] === 'metadata') {
      if (!process.env.GITHUB_OUTPUT) throw new Error('Falta GITHUB_OUTPUT');
      appendFileSync(process.env.GITHUB_OUTPUT, `repositories=${JSON.stringify(repositories)}\n`);
    } else if (process.argv[2] === 'align') {
      prepareWorkspace({
        workspace: process.env.MEMIVO_WORKSPACE,
        candidate: process.env.CANDIDATE,
        sourceRepository: process.env.SOURCE_REPOSITORY,
      });
    } else throw new Error('Comando esperado: metadata o align');
  } catch (error) {
    console.error(`::error::${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { prepareWorkspace, foreignGitEnvironment };
