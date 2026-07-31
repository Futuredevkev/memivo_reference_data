/**
 * Auditor de ENDPOINTS SIN CONSUMIDOR (bloque 42).
 *
 * Los otros tres auditores cruzan SÍMBOLOS: identidad de tipos, superficies de
 * transporte, campos de respuesta con lector. Ninguno mira RUTAS, y por eso los
 * cinco endpoints huérfanos de este bloque convivieron con los cinco gates en
 * verde. `knip` tampoco los ve: el controller SÍ se importa desde su módulo, así
 * que el símbolo está usado — lo que no existe es el llamador HTTP.
 *
 * Lo que mide: para cada `@Get/@Post/@Patch/@Put/@Delete` de los controllers del
 * api, arma el path completo (prefijo del `@Controller` + el del decorador) y
 * busca un call-site en el cliente que pueda producirlo.
 *
 * ── EL MATCHEO, Y POR QUÉ ES POR SEGMENTOS ────────────────────────────────
 * El cliente arma sus urls con template literals (`/album/${id}/folders`), así
 * que comparar strings no sirve. Se normaliza cada ruta a su ESQUELETO: los
 * segmentos dinámicos —`:albumId` del lado servidor, `${...}` del lado cliente—
 * colapsan a `*`. `/album/:id/folders` y `` `/album/${albumId}/folders` ``
 * producen el mismo esqueleto y matchean.
 *
 * ── LOS HUÉRFANOS LEGÍTIMOS SE DECLARAN, NO SE SALTEAN ────────────────────
 * Un endpoint puede no tener consumidor en la app y ser correcto igual: lo llama
 * un webhook, un orquestador o un navegador. Cada uno se declara abajo CON SU
 * MOTIVO. Una entrada sin endpoint que la respalde es una excusa en blanco —el
 * bloque 2 ya documentó ese modo de falla y el 41 lo volvió a encontrar—, así
 * que el gate también falla si una excusa dejó de corresponder a una ruta viva.
 */
const { existsSync, readFileSync, readdirSync } = require('node:fs');
const { dirname, join, relative, resolve } = require('node:path');

const packageRoot = resolve(__dirname, '..');
const workspaceRoot = dirname(packageRoot);
const roots = {
  api: process.env.MEMIVO_AUDIT_API_SRC
    ? resolve(process.env.MEMIVO_AUDIT_API_SRC)
    : resolve(workspaceRoot, 'memivo_api', 'src'),
  client: process.env.MEMIVO_AUDIT_CLIENT_SRC
    ? resolve(process.env.MEMIVO_AUDIT_CLIENT_SRC)
    : resolve(workspaceRoot, 'memivo_client', 'src'),
};
const moderationReadme = process.env.MEMIVO_AUDIT_MODERATION_README
  ? resolve(process.env.MEMIVO_AUDIT_MODERATION_README)
  : join(roots.api, 'moderation', 'README.md');

/**
 * Huérfanos LEGÍTIMOS: no los llama la app y está bien. Clave: `MÉTODO /path`
 * con el path tal como lo declara el controller.
 */
const INTENTIONAL_WITHOUT_CLIENT = {
  'GET /health': 'sonda de salud: la consumen Docker y el monitor externo.',
  'GET /health/ready':
    'readiness probe del orquestador, no de la app.',
  'GET /og/invite/:token':
    'lo pide el crawler de las redes por el desvío de nginx (decisión 7, medido en producción contra memivoco.com).',
  'GET /og/post/:id':
    'hermano del anterior: mismo desvío de nginx para el preview de un post compartido.',
  'POST /auth/oauth/apple/notifications':
    'server-to-server notifications de Apple. Lo llama Apple, no la app.',
  'POST /moderation/users/:userId/ban':
    'superficie de OPERADOR (@Auth ADMIN): la ejerce el bot de moderación, no la app.',
  'POST /moderation/users/:userId/unban':
    'idem: @Auth ADMIN, sin consumidor en la app por diseño.',
  'GET /moderation/cases':
    'idem: @Auth ADMIN, panel de moderación.',
  'GET /moderation/cases/:caseId':
    'idem: @Auth ADMIN, panel de moderación.',
};

const HTTP_DECORATOR = /@(Get|Post|Put|Patch|Delete)\s*\(\s*(?:'([^']*)'|"([^"]*)"|`([^`]*)`)?\s*\)/g;
const CONTROLLER_DECORATOR = /@Controller\s*\(\s*(?:'([^']*)'|"([^"]*)"|`([^`]*)`)?\s*\)/;

const walk = (dir, filter, out = []) => {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, filter, out);
    else if (filter(entry.name)) out.push(full);
  }
  return out;
};

/** `/album/:id/folders` → `/album/*\/folders`. */
const skeleton = (path) =>
  `/${path
    .split('/')
    .filter(Boolean)
    .map((segment) =>
      segment.startsWith(':') || segment.includes('${') ? '*' : segment,
    )
    .join('/')}`;

const collectEndpoints = () => {
  const endpoints = [];
  for (const file of walk(roots.api, (name) => name.endsWith('.controller.ts'))) {
    const source = readFileSync(file, 'utf8');
    const controller = CONTROLLER_DECORATOR.exec(source);
    if (!controller) continue;
    const base = controller[1] ?? controller[2] ?? controller[3] ?? '';

    HTTP_DECORATOR.lastIndex = 0;
    let match;
    while ((match = HTTP_DECORATOR.exec(source)) !== null) {
      const suffix = match[2] ?? match[3] ?? match[4] ?? '';
      const path = `/${[base, suffix].filter(Boolean).join('/')}`;
      endpoints.push({
        method: match[1].toUpperCase(),
        path,
        skeleton: skeleton(path),
        file: relative(workspaceRoot, file).replace(/\\/g, '/'),
      });
    }
  }
  return endpoints;
};

/**
 * Rutas operativas que el manual de moderación le entrega a quien trabaja con
 * Postman. Un typo acá no es prosa desactualizada: es una instrucción que da
 * 404 en un incidente. Se extraen únicamente líneas HTTP explícitas, se quita
 * el prefijo global de la app y se comparan método + esqueleto contra los
 * decorators reales.
 */
const collectDocumentedModerationEndpoints = () => {
  if (!existsSync(moderationReadme)) {
    return {
      missingReadme: true,
      endpoints: [],
    };
  }

  const source = readFileSync(moderationReadme, 'utf8');
  const documentedByKey = new Map();
  const routeLine = /^(GET|POST|PUT|PATCH|DELETE)\s+(\S+)/gm;
  let match;
  while ((match = routeLine.exec(source)) !== null) {
    const withoutQuery = match[2].split('?')[0];
    const path = withoutQuery.replace(/^\/api\/v1(?=\/|$)/, '') || '/';
    const endpoint = {
      method: match[1],
      path,
      skeleton: skeleton(path),
    };
    documentedByKey.set(`${endpoint.method} ${endpoint.skeleton}`, endpoint);
  }

  return {
    missingReadme: false,
    endpoints: [...documentedByKey.values()],
  };
};

/**
 * Fragmentos de ruta que el cliente puede producir.
 *
 * PERMISIVO A PROPÓSITO, y la asimetría es la razón: un falso negativo deja un
 * huérfano sin reportar (lo caza la próxima auditoría); un falso positivo hace
 * que alguien borre un endpoint VIVO. Por eso se recoge todo fragmento con
 * pinta de path, aunque no arranque la cadena —el cliente escribe
 * `` `${API_URL}/auth/refresh` `` y `'/notifications/read-chat/' + groupId`, y
 * las dos formas daban falso positivo en la primera versión de este gate—.
 */
const collectClientCalls = () => {
  const calls = new Set();
  const files = walk(
    roots.client,
    (name) => name.endsWith('.ts') || name.endsWith('.tsx'),
  );
  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    const literals = source.match(/['"`][^'"`\n]*['"`]/g) ?? [];
    for (const literal of literals) {
      const value = literal.slice(1, -1);
      // Un path puede empezar la cadena o venir después de un `${…}`.
      const path = /(\/[A-Za-z0-9_\-:${}./]*)/.exec(value)?.[1];
      if (!path || path.length < 2) continue;
      calls.add(skeleton(path.split('?')[0]));
    }
  }
  return calls;
};

/**
 * El prefijo estático de una ruta: todo lo anterior al primer segmento
 * dinámico. `/notifications/read-chat/:groupId` → `/notifications/read-chat`.
 * Sirve para el cliente que concatena (`'/x/y/' + id`), donde el esqueleto no
 * llega a formarse.
 */
const staticPrefix = (path) => {
  const segments = path.split('/').filter(Boolean);
  const kept = [];
  for (const segment of segments) {
    if (segment.startsWith(':')) break;
    kept.push(segment);
  }
  return kept.length >= 2 ? `/${kept.join('/')}` : null;
};

const endpoints = collectEndpoints();
const clientCalls = collectClientCalls();
const documentedModeration = collectDocumentedModerationEndpoints();

const orphans = [];
const clientPrefixes = [...clientCalls];
for (const endpoint of endpoints) {
  const key = `${endpoint.method} ${endpoint.path}`;
  if (key in INTENTIONAL_WITHOUT_CLIENT) continue;
  if (clientCalls.has(endpoint.skeleton)) continue;
  const prefix = staticPrefix(endpoint.path);
  if (prefix && clientPrefixes.some((call) => call.startsWith(prefix))) continue;
  orphans.push(`${key}  (${endpoint.file})`);
}

const declaredKeys = new Set(Object.keys(INTENTIONAL_WITHOUT_CLIENT));
const liveKeys = new Set(endpoints.map((e) => `${e.method} ${e.path}`));
const staleExcuses = [...declaredKeys].filter((key) => !liveKeys.has(key));
const liveSkeletonKeys = new Set(
  endpoints.map((endpoint) => `${endpoint.method} ${endpoint.skeleton}`),
);
const staleModerationDocs = documentedModeration.endpoints
  .filter(
    (endpoint) =>
      !liveSkeletonKeys.has(`${endpoint.method} ${endpoint.skeleton}`),
  )
  .map((endpoint) => `${endpoint.method} ${endpoint.path}`);

const report = {
  endpoints: endpoints.length,
  clientCallSkeletons: clientCalls.size,
  intentionalWithoutClient: declaredKeys.size,
  orphans,
  staleExcuses,
  documentedModerationEndpoints: documentedModeration.endpoints.length,
  moderationReadmeMissing: documentedModeration.missingReadme,
  staleModerationDocs,
};

if (process.argv.includes('--verbose')) {
  console.log(JSON.stringify(report, null, 2));
}

if (documentedModeration.missingReadme) {
  console.error(
    `audit:endpoints: no existe el manual de moderación esperado en ${moderationReadme}.`,
  );
  process.exitCode = 1;
} else if (staleModerationDocs.length > 0) {
  console.error(
    `audit:endpoints: ${staleModerationDocs.length} ruta(s) del manual de moderación no existen:\n  ${staleModerationDocs.join('\n  ')}\n\n` +
      'Corregí el manual o restaurá el decorator: una instrucción operativa que da 404 no puede quedar publicada.',
  );
  process.exitCode = 1;
} else if (orphans.length > 0) {
  console.error(
    `audit:endpoints: ${orphans.length} endpoint(s) sin consumidor en el cliente:\n  ${orphans.join('\n  ')}\n\n` +
      'Cada uno es superficie HTTP autenticada que hay que revisar en cada auditoría\n' +
      'sin que ningún usuario la toque. O se conecta, o se borra, o —si es legítimo\n' +
      '(webhook, health, crawler)— se declara en INTENTIONAL_WITHOUT_CLIENT con su motivo.',
  );
  process.exitCode = 1;
} else if (staleExcuses.length > 0) {
  console.error(
    `audit:endpoints: ${staleExcuses.length} excusa(s) sin endpoint que las respalde:\n  ${staleExcuses.join('\n  ')}\n\n` +
      'Una excusa que dejó de matchear no es inocua: excusa cualquier ruta futura\n' +
      'con ese nombre. Borrala.',
  );
  process.exitCode = 1;
} else {
  console.log(
    `audit:endpoints: ${endpoints.length} endpoints, todos con consumidor ` +
      `(${declaredKeys.size} huérfanos legítimos declarados); ` +
      `${documentedModeration.endpoints.length} rutas operativas de moderación verificadas.`,
  );
}
