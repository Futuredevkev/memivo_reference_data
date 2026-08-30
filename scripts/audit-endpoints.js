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
 *
 * ── EL MÉTODO SE COMPARA CUANDO SE LO PUEDE LEER ──────────────────────────
 * Acá decía que el método NO se comparaba, y era la consecuencia medida: un
 * `GET /x` del api quedaba avalado por un `POST /x` del cliente. Se cerró por
 * la mitad que tiene firma: cuando el path es el PRIMER argumento literal de la
 * llamada —`api.get('/x')`, `` client.post<T>(`/x/${id}`) ``— el verbo está al
 * lado y se lee. Cuando el path viaja en una constante o por variable, no hay
 * verbo que leer y ese esqueleto sigue avalando cualquiera.
 *
 * La regla de composición mantiene la asimetría del archivo: basta que UNA
 * aparición del esqueleto venga sin verbo para que se lo trate como
 * desconocido. Así el ensanche sólo puede DESTAPAR huérfanos que ya lo eran, y
 * nunca inventar uno por no haber sabido leer la llamada — que es el único
 * error que este auditor no puede cometer, porque termina en alguien borrando
 * una ruta viva.
 *
 * ── LO QUE ESTE AUDITOR SIGUE SIN MEDIR ───────────────────────────────────
 * El verbo de los call-sites que arman la url aparte. Del lado del cliente eso
 * es el path guardado en una constante o compuesto en un helper, y la única
 * forma de seguirlo sería resolver la expresión, no leer el string. Sigue
 * siendo un falso NEGATIVO —deja pasar un huérfano, nunca hace borrar una ruta
 * viva—, y la cuenta de cuántos esqueletos SÍ se comparan por método viaja en
 * el reporte para que la distancia sea medible y no una impresión.
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
  'POST /reports/profile/:reportId/ban-reported-user':
    'superficie de OPERADOR (@RoleProtected ADMIN): la ejerce el admin desde Postman, documentada en moderation/README.md. Pasaba por el fallback de prefijo —el `POST /reports/profile` con que la app CREA la denuncia la avalaba— y por eso el titular decía «todos con consumidor» sobre una ruta que ninguna pantalla llama.',
  'POST /reports/profile/:reportId/status':
    'idem: @RoleProtected ADMIN para cerrar el reporte sin banear, misma clase que sus hermanas de /moderation/*.',
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
 * Una llamada HTTP del cliente cuyo path es el PRIMER argumento literal:
 * `api.get('/x')`, `` client.post<T>(`/x/${id}`) ``, `http.delete("/x")`.
 *
 * El verbo se lee acá y en ningún otro lado: es lo único que separa un
 * `GET /x` de un `POST /x`, y sin él el auditor avalaba uno con el otro.
 * Los genéricos entran en el medio (`.get<Poll | null>(`) y por eso el tramo
 * opcional excluye paréntesis: sin ese corte, un `.get(` cualquiera más
 * adelante en el archivo podía quedar pegado a un literal ajeno.
 */
const VERB_ANCHORED_CALL =
  /\.(get|post|put|patch|delete)\s*(?:<[^()]*>)?\s*\(\s*(['"`])([^'"`\n]*)\2/g;

/** El path que hay adentro de un literal, o `null` si el literal no es uno. */
const pathInLiteral = (value) => {
  // Un path puede empezar la cadena o venir después de un `${…}`.
  const path = /(\/[A-Za-z0-9_\-:${}./]*)/.exec(value)?.[1];
  if (!path || path.length < 2) return null;
  return path.split('?')[0];
};

/**
 * Los call-sites del cliente, y el VERBO de cada uno cuando se lo pudo leer.
 *
 * ── FRAGMENTOS DE RUTA: PERMISIVO A PROPÓSITO ─────────────────────────────
 * La asimetría es la razón: un falso negativo deja un huérfano sin reportar (lo
 * caza la próxima auditoría); un falso positivo hace que alguien borre un
 * endpoint VIVO. Por eso se recoge todo fragmento con pinta de path, aunque no
 * arranque la cadena —el cliente escribe `` `${API_URL}/auth/refresh` `` y
 * `'/notifications/read-chat/' + groupId`, y las dos formas daban falso
 * positivo en la primera versión de este gate—.
 *
 * ── POR QUÉ DOS PASADAS Y NO UNA ──────────────────────────────────────────
 * La pasada anclada al verbo reconoce la forma normal —el path como primer
 * argumento de `.get/.post/…`— y es la que permite comparar el método. La
 * pasada de literales SUELTOS es la que ya existía y sigue haciendo falta: el
 * cliente también arma urls en constantes, las pasa por variable o las escribe
 * en un helper, y ahí el verbo no está al lado.
 *
 * La regla de composición es la asimetría con la que este archivo entero está
 * escrito: **un esqueleto se compara por método sólo si TODAS sus apariciones
 * en el cliente traen verbo**. Basta un literal suelto con ese esqueleto para
 * que vuelva a avalar cualquier verbo. Así el ensanche sólo puede DESTAPAR
 * huérfanos que ya lo eran, nunca inventar uno por no haber sabido leer la
 * llamada.
 */
const collectClientCalls = () => {
  const calls = new Set();
  /** Esqueleto → set de verbos leídos al lado. */
  const methodsBySkeleton = new Map();
  /** Esqueletos que aparecieron en un literal sin verbo a la vista. */
  const withoutMethod = new Set();
  // Los fragmentos que el cliente dejó ABIERTOS: un literal cortado en `/`
  // porque lo que sigue se concatena. Son los únicos que pueden avalar a una
  // ruta hija — ver `orphans`, más abajo.
  const concatenated = new Set();
  const files = walk(
    roots.client,
    (name) => name.endsWith('.ts') || name.endsWith('.tsx'),
  );
  for (const file of files) {
    const source = readFileSync(file, 'utf8');

    /** Los literales que ya quedaron atribuidos a un verbo, por offset. */
    const anchored = new Set();
    VERB_ANCHORED_CALL.lastIndex = 0;
    let anchoredMatch;
    while ((anchoredMatch = VERB_ANCHORED_CALL.exec(source)) !== null) {
      const path = pathInLiteral(anchoredMatch[3]);
      if (!path) continue;
      const key = skeleton(path);
      const method = anchoredMatch[1].toUpperCase();
      if (!methodsBySkeleton.has(key)) methodsBySkeleton.set(key, new Set());
      methodsBySkeleton.get(key).add(method);
      anchored.add(`${file}\0${anchoredMatch[3]}`);
    }

    const literals = source.match(/['"`][^'"`\n]*['"`]/g) ?? [];
    for (const literal of literals) {
      const value = literal.slice(1, -1);
      const withoutQuery = pathInLiteral(value);
      if (!withoutQuery) continue;
      calls.add(skeleton(withoutQuery));
      // El mismo texto puede aparecer anclado en un lugar y suelto en otro: si
      // aparece suelto aunque sea una vez, el verbo de ese esqueleto no se
      // conoce con certeza y el auditor vuelve a su medición vieja.
      if (!anchored.has(`${file}\0${value}`)) {
        withoutMethod.add(skeleton(withoutQuery));
      }
      // `skeleton` tira el segmento vacío final, así que la barra abierta se
      // pierde ahí: hay que mirarla ANTES de normalizar.
      if (withoutQuery.endsWith('/')) concatenated.add(skeleton(withoutQuery));
    }
  }
  return { calls, concatenated, methodsBySkeleton, withoutMethod };
};

/**
 * ¿El cliente llama a este esqueleto CON ESTE VERBO?
 *
 * `null` = no se sabe (nadie lo escribió, o al menos una aparición vino sin
 * verbo al lado), y entonces vale como avalado, que es lo que este auditor
 * hacía siempre. `false` = el cliente toca ese path pero con otro verbo.
 */
const clientCallsWithMethod = (client, endpoint) => {
  if (!client.calls.has(endpoint.skeleton)) return false;
  if (client.withoutMethod.has(endpoint.skeleton)) return true;
  const methods = client.methodsBySkeleton.get(endpoint.skeleton);
  if (!methods) return true;
  return methods.has(endpoint.method);
};

/**
 * El prefijo que un cliente CONCATENADOR tendría que haber escrito para producir
 * esta ruta: el path entero menos su último segmento, y sólo si ese último
 * segmento es el dinámico. `/notifications/read-chat/:groupId` →
 * `/notifications/read-chat`.
 *
 * ── EL DEFECTO QUE CIERRA ──────────────────────────────────────────────────
 * Antes devolvía todo lo anterior al PRIMER segmento dinámico, así que
 * `/reports/profile/:reportId/ban-reported-user` daba `/reports/profile` — que
 * es exactamente el `POST /reports/profile` con el que la app crea una
 * denuncia. Con eso, cualquier ruta colgada de un prefijo que el cliente toca
 * quedaba dada por consumida: dos superficies de OPERADOR (`@RoleProtected
 * ADMIN`) pasaban el gate sin tener un solo llamador, y el titular del auditor
 * —«todos con consumidor»— afirmaba algo falso. Un gate que da un número falso
 * es peor que no tenerlo: da confianza.
 *
 * Un cliente que concatena corta la url en el ÚLTIMO segmento
 * (`'/notifications/read-chat/' + groupId`); nunca a mitad de camino dejando
 * dos segmentos más escritos a mano. Por eso el prefijo tiene que ser el path
 * completo menos uno, y no cualquier ancestro.
 */
const concatenablePrefix = (path) => {
  const segments = path.split('/').filter(Boolean);
  const last = segments[segments.length - 1];
  if (!last || !last.startsWith(':')) return null;
  const kept = segments.slice(0, -1);
  if (kept.some((segment) => segment.startsWith(':'))) return null;
  return kept.length >= 2 ? `/${kept.join('/')}` : null;
};

const endpoints = collectEndpoints();
const client = collectClientCalls();
const { calls: clientCalls, concatenated: clientConcatenatedPrefixes } = client;
const documentedModeration = collectDocumentedModerationEndpoints();

const orphans = [];
/**
 * Los avalados SÓLO por concatenación, publicados en el reporte. El titular
 * decía «todos con consumidor» sobre tres números medidos de formas distintas
 * —esqueleto exacto, excusa declarada y prefijo—, y el tercero era el único que
 * no se veía. Lo que no se cuenta aparte no se puede cuestionar.
 */
const matchedByConcatenation = [];
/**
 * Los huérfanos que el cliente TOCA con otro verbo. Se cuentan aparte porque
 * son un hallazgo distinto: no es una ruta que nadie llama, es una ruta que
 * alguien llama MAL —o un decorador con el verbo equivocado—, y el mensaje
 * tiene que decir cuál de las dos para que sea accionable.
 */
const methodMismatches = [];
for (const endpoint of endpoints) {
  const key = `${endpoint.method} ${endpoint.path}`;
  if (key in INTENTIONAL_WITHOUT_CLIENT) continue;
  if (clientCallsWithMethod(client, endpoint)) continue;
  const prefix = concatenablePrefix(endpoint.path);
  if (prefix && clientConcatenatedPrefixes.has(prefix)) {
    matchedByConcatenation.push(key);
    continue;
  }
  if (clientCalls.has(endpoint.skeleton)) {
    const verbos = [
      ...(client.methodsBySkeleton.get(endpoint.skeleton) ?? []),
    ].sort();
    methodMismatches.push(
      `${key}  (${endpoint.file}) — el cliente llama ese path con ${verbos.join('/')}`,
    );
    continue;
  }
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
  clientCallSkeletonsWithKnownMethod: [...client.methodsBySkeleton.keys()]
    .filter((skeletonKey) => !client.withoutMethod.has(skeletonKey))
    .length,
  matchedByConcatenation,
  intentionalWithoutClient: declaredKeys.size,
  methodMismatches,
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
} else if (methodMismatches.length > 0) {
  console.error(
    `audit:endpoints: ${methodMismatches.length} endpoint(s) que el cliente sólo toca con OTRO verbo:\n  ${methodMismatches.join('\n  ')}\n\n` +
      'No es una ruta sin llamador: es una ruta cuyo llamador usa otro método, así que\n' +
      'una de las dos puntas está equivocada. O el decorador dice el verbo que no es,\n' +
      'o la llamada del cliente lo dice, o son dos rutas distintas que comparten path\n' +
      'y a una le falta consumidor — en ese caso se declara en INTENTIONAL_WITHOUT_CLIENT.',
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
    // Los tres caminos se publican por separado. El titular anterior decía
    // «todos con consumidor» sumando tres mediciones distintas, y la que no se
    // veía —la del prefijo— era justo la que avalaba dos rutas ADMIN sin
    // llamador. Un número que no se puede desagregar no se puede cuestionar.
    `audit:endpoints: ${endpoints.length} endpoints, todos con consumidor ` +
      `(${endpoints.length - declaredKeys.size - matchedByConcatenation.length} por esqueleto exacto, ` +
      `${matchedByConcatenation.length} por concatenación del cliente, ` +
      `${declaredKeys.size} huérfanos legítimos declarados); ` +
      `${documentedModeration.endpoints.length} rutas operativas de moderación verificadas.`,
  );
}
