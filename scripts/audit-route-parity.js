/**
 * Auditor de PARIDAD POR RUTA entre el api y el cliente (quinto del paquete).
 *
 * Los cuatro auditores que ya existen tocan el cable y ninguno lo APAREA:
 *
 * - `audit-transport-surfaces.js` exige que cada extremo TENGA un tipo, por
 *   separado: `auditApi()` y `auditClient()` ni se conocen. Los dos lados
 *   pueden estar anotados, dar 0 en las diez categorías y decir cosas
 *   incompatibles sobre la misma ruta.
 * - `audit-endpoints.js` sí junta por ruta, pero su lado cliente es un match de
 *   literales con pinta de path: prueba que la CADENA existe, no que una llamada
 *   tipada la alcance. Es permisivo a propósito y está escrito en su docblock.
 * - `audit-consumers.js` compara símbolos POR NOMBRE. Cuando los dos lados usan
 *   nombres distintos —que es lo normal acá: `IGuestPost` vs `GuestPostResponse`—
 *   el par no se forma y no hay nada que comparar.
 * - `audit-response-fields.js` arma su universo por sufijo de nombre de tipo.
 *
 * El hueco lo dejó anticipado por escrito el docblock de `audit-response-fields`
 * («evaluar si vale la pena exigir tipo de retorno anotado en todo handler es
 * tarea de otro bloque»): la anotación ya se exige, lo que faltaba era
 * APAREARLA. Los defectos que sobrevivieron al hueco rompían en runtime en el
 * camino de ÉXITO — el api anotaba `Promise<void>`, el cliente afirmaba un
 * cuerpo y lo desreferenciaba sin guarda.
 *
 * ── LO QUE MIDE ───────────────────────────────────────────────────────────
 * Arma UNA tabla `ruta → (lado api, lado cliente)` y le aplica tres reglas.
 * Es una sola tabla a propósito: el apareo por esqueleto más la resolución de
 * alias es la mitad cara y frágil, y tres gates separados serían tres copias
 * suyas divergiendo.
 *
 *   R1 · CUERPO      `void` de un lado ⇒ `void` del otro. Es la regla que
 *                    rompe en runtime: el cliente que afirma un cuerpo que no
 *                    llega lo desreferencia y tira `TypeError` en el camino de
 *                    éxito.
 *   R2 · RAÍZ        el tipo de los dos lados tiene que resolver al MISMO
 *                    símbolo después de seguir los alias hasta su origen.
 *   R3 · IDEMPOTENCIA  un handler con `@Idempotent()` sin `Idempotency-Key` del
 *                    otro lado es un interceptor inerte: el reintento por red
 *                    intermitente vuelve a ejecutar el efecto.
 *
 * ── LA RESOLUCIÓN DE ALIAS ES LO QUE HACE QUE EL GATE NAZCA ENCENDIDO ─────
 * Los dos repos renombran al importar (`import type { PhotoTag as
 * PhotoTagResponse }`) y republican con alias (`export type { PaginatedResponse
 * as IPaginatedResult }`). Comparar los nombres crudos daría decenas de falsos
 * positivos y obligaría a una allowlist que apagaría el gate. Por eso cada lado
 * se resuelve siguiendo imports, re-exports, barrels y alias de tipo hasta el
 * símbolo de origen, y recién ahí se comparan.
 *
 * ── LAS EQUIVALENCIAS SANCIONADAS, Y SON ÉSTAS Y NINGUNA MÁS ──────────────
 * `Promise<X> ≡ X` (se desenvuelve el retorno del handler), `X<Date> ≡ X` (los
 * argumentos genéricos no entran en la raíz: el default del paquete ya es la
 * forma del cable), `NormalizeTransportTimestamps<X> ≡ X`, `Array<T> ≡ T[]`, y
 * `class D implements C` ≡ `C` cuando `C` es del paquete — que es la forma
 * sancionada de adoptar un contrato en un DTO de Nest. `Omit`/`Pick` NO son
 * equivalencias: recortan la promesa y se comparan como raíz propia.
 *
 * ── ALCANCE: LO QUE ESTE GATE NO CUBRE ────────────────────────────────────
 * 1. Compara la RAÍZ que cada lado nombra, NO su conjunto de campos ni los
 *    argumentos genéricos anidados. Que `PaginatedResponse<X>` de un lado sea
 *    `PaginatedResponse<Omit<X, 'k'>>` del otro no lo ve: ese eje es
 *    `audit-response-fields.js`.
 * 2. Sólo ve llamadas cuyo primer argumento es un literal de string o un
 *    template literal. Las que arman la url en una variable no se pueden aparear
 *    por ruta y salen en `unpairedClientCalls` sin tumbar el gate.
 * 3. Un endpoint sin ninguna llamada tipada que lo alcance no es asunto de este
 *    gate: los huérfanos los cuenta `audit-endpoints.js`.
 * 4. Que cada extremo TENGA un tipo es de `audit-transport-surfaces.js`. Acá un
 *    par con un lado sin anotar sale en `unannotatedPairs` y no aporta
 *    comparación — se lista para que el conteo de pares verificados no se lea
 *    como cobertura que no hubo.
 * 5. Dos handlers distintos con el MISMO método y esqueleto no permiten decir
 *    cuál contesta: salen en `ambiguousRoots` y no se comparan, en vez de
 *    elegir uno al azar. Hoy son cero.
 * 6. La resolución de un nombre arranca en el archivo que lo usa y sigue sus
 *    imports, así que un nombre declarado dos veces en el repo no se confunde
 *    por archivo — pero un BARREL que reexporta dos módulos con el mismo nombre
 *    devuelve el primero que encuentra.
 * 7. No todo nodo llega a una raíz por SÍMBOLO. El que no reduce a un nombre
 *    —intersecciones, tipos indexados, condicionales— cae en `opaque:` y se
 *    compara por su TEXTO FUENTE con los blancos colapsados, que es una
 *    comparación más débil: mira cómo está ESCRITO el tipo, no lo que
 *    significa. LO QUE SÍ NORMALIZA: sangría y saltos de línea, así que el
 *    mismo tipo escrito multilínea de un lado y en una línea del otro aparea.
 *    LO QUE NO: todo lo demás del texto. Medido, `Base & { k: Cat; }` contra
 *    `Base & { k: Cat }` sale como drift — mismo tipo, sobra el separador. El
 *    orden de los miembros de una intersección tampoco se canoniza: `A & B`
 *    contra `B & A` sale como drift. Cuando eso pase, la salida es darle al
 *    nodo una rama propia acá arriba —como la tienen `Array`, los literales
 *    inline y los `import(...)`—, NO un renglón en `INTENTIONAL_ROUTE_DRIFT`:
 *    eso apagaría el eje entero para esa ruta.
 *
 * ── LAS EXCEPCIONES SE DECLARAN CON MOTIVO Y TIENEN QUE SEGUIR VIVAS ──────
 * Igual que `INTENTIONAL_WITHOUT_CLIENT` de `audit-endpoints.js` y que
 * `intentionalBoundaries` de `audit-consumers.js`: el gate también falla si una
 * excusa dejó de corresponder a un par vivo. Sin eso la lista crece sola y el
 * gate se apaga en silencio.
 */
const { existsSync, readFileSync, readdirSync, statSync } = require('node:fs');
const { dirname, join, relative, resolve } = require('node:path');
const ts = require('typescript');

const packageRoot = resolve(__dirname, '..');
const workspaceRoot = dirname(packageRoot);
// Misma costura por entorno que usan `audit-endpoints` y `audit-consumers`: sin
// ella, la única forma de probar que el gate detecta un drift sería tener el
// drift de verdad en un repo real.
const roots = {
  api: process.env.MEMIVO_AUDIT_API_SRC
    ? resolve(process.env.MEMIVO_AUDIT_API_SRC)
    : resolve(workspaceRoot, 'memivo_api', 'src'),
  client: process.env.MEMIVO_AUDIT_CLIENT_SRC
    ? resolve(process.env.MEMIVO_AUDIT_CLIENT_SRC)
    : resolve(workspaceRoot, 'memivo_client', 'src'),
};

const CONTRACTS_MODULE = '@memivo/contracts';
const HTTP_DECORATORS = new Set(['Get', 'Post', 'Put', 'Patch', 'Delete']);
const AXIOS_METHODS = new Set(['get', 'post', 'put', 'patch', 'delete']);
/**
 * Envoltorios TRANSPARENTES: cambian la representación de un contrato sin
 * cambiar de contrato. `NormalizeTransportTimestamps<X>` es literalmente «X tal
 * como viaja por el cable», y el default de los genéricos del paquete ya es la
 * forma del cable, así que `X<Date>` y `X` son el mismo símbolo para este eje.
 */
const TRANSPARENT_WRAPPERS = new Set(['NormalizeTransportTimestamps', 'Promise']);
/**
 * Envoltorios que NO son transparentes: recortan el contrato. `Omit<X,'album'>`
 * es una promesa distinta de `X` —el campo no viaja— y esa diferencia fue un
 * drift real: el detalle de post anotaba el recorte mientras el servicio sí
 * mandaba el campo y la pantalla lo leía.
 */
const NARROWING_WRAPPERS = new Set(['Omit', 'Pick', 'Exclude', 'Extract']);
const VOID_ROOT = 'void';

/**
 * Pares vivos que divergen a propósito. Clave: `MÉTODO /esqueleto`.
 * Vacío hoy: cada divergencia medida resultó ser un defecto y se arregló.
 */
const INTENTIONAL_ROUTE_DRIFT = new Map([]);

/**
 * Handlers `@Idempotent()` cuyo call-site NO manda la cabecera a propósito.
 * Clave: `MÉTODO /esqueleto`.
 */
const INTENTIONAL_WITHOUT_IDEMPOTENCY_KEY = new Map([]);

const walk = (root, out = []) => {
  if (!existsSync(root)) return out;
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (['coverage', 'dist', 'node_modules', '__snapshots__'].includes(entry.name)) continue;
    const path = join(root, entry.name);
    if (entry.isDirectory()) walk(path, out);
    else if (/\.tsx?$/.test(entry.name) && !/\.(spec|test)\.tsx?$/.test(entry.name)) out.push(path);
  }
  return out;
};

const parse = (path) =>
  ts.createSourceFile(
    path,
    readFileSync(path, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    path.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

/** `/album/:id/folders` y `` `/album/${id}/folders` `` → `/album/*\/folders`. */
const skeleton = (path) =>
  `/${path
    .split('/')
    .filter(Boolean)
    .map((segment) => (segment.startsWith(':') || segment.includes('${') ? '*' : segment))
    .join('/')}`;

const decoratorsOf = (node) =>
  ts.canHaveDecorators(node) ? (ts.getDecorators(node) ?? []) : [];

const decoratorName = (decorator) => {
  const expression = decorator.expression;
  if (ts.isIdentifier(expression)) return expression.text;
  if (ts.isCallExpression(expression) && ts.isIdentifier(expression.expression)) {
    return expression.expression.text;
  }
  return '';
};

const decoratorFirstStringArgument = (decorator) => {
  const expression = decorator.expression;
  if (!ts.isCallExpression(expression)) return '';
  const [first] = expression.arguments;
  if (!first) return '';
  if (ts.isStringLiteral(first) || ts.isNoSubstitutionTemplateLiteral(first)) return first.text;
  return '';
};

// ── ÍNDICE DE MÓDULOS: lo que hace posible seguir un alias hasta su origen ──

const resolveModulePath = (fromFile, specifier, root) => {
  let base;
  if (specifier.startsWith('.')) {
    base = resolve(dirname(fromFile), specifier);
  } else if (specifier.startsWith('src/')) {
    // El api importa por `baseUrl` (`src/common/interfaces`) y por ruta
    // relativa, las dos formas sobre los MISMOS archivos. Sin esta rama, la
    // mitad de los alias del api quedaban sin resolver y el gate llamaba drift
    // a un re-export del mismo contrato.
    base = resolve(dirname(root), specifier);
  } else {
    return null;
  }
  const candidates = [
    `${base}.ts`,
    `${base}.tsx`,
    join(base, 'index.ts'),
    join(base, 'index.tsx'),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
};

/**
 * Por archivo: de dónde viene cada nombre y qué declara por su cuenta. Es el
 * insumo de `resolveRoot`, y sin él el gate compararía `PhotoTagResponse` contra
 * `IPhotoTag` y llamaría drift a un alias del MISMO contrato.
 */
const indexFile = (file) => {
  const source = parse(file);
  const entry = {
    source,
    imported: new Map(),
    aliases: new Map(),
    declared: new Set(),
    implemented: new Map(),
    starReexports: [],
  };

  const remember = (name, originalName, specifier) => {
    entry.imported.set(name, { originalName, specifier });
  };

  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
      const specifier = statement.moduleSpecifier.text;
      const bindings = statement.importClause?.namedBindings;
      if (bindings && ts.isNamedImports(bindings)) {
        for (const element of bindings.elements) {
          remember(element.name.text, (element.propertyName ?? element.name).text, specifier);
        }
      }
      continue;
    }
    if (ts.isExportDeclaration(statement)) {
      const specifier =
        statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)
          ? statement.moduleSpecifier.text
          : null;
      if (statement.exportClause && ts.isNamedExports(statement.exportClause)) {
        for (const element of statement.exportClause.elements) {
          if (specifier) {
            remember(element.name.text, (element.propertyName ?? element.name).text, specifier);
          }
        }
      } else if (specifier) {
        entry.starReexports.push(specifier);
      }
      continue;
    }
    if (ts.isTypeAliasDeclaration(statement)) {
      entry.aliases.set(statement.name.text, statement.type);
      entry.declared.add(statement.name.text);
      continue;
    }
    if (
      ts.isInterfaceDeclaration(statement)
      || ts.isClassDeclaration(statement)
      || ts.isEnumDeclaration(statement)
    ) {
      if (!statement.name) continue;
      entry.declared.add(statement.name.text);
      // `class ResponseUserDto implements UserResponse<Date>` es la forma
      // SANCIONADA de adoptar un contrato en el api: el DTO existe por los
      // decoradores de validación/serialización de Nest, y el `implements` es
      // lo que hace que `tsc` corte si la forma se mueve. Un DTO así NO es una
      // copia del contrato — es el contrato con equipaje de framework — y
      // tratarlo como drift habría obligado a excusar a mano todos los DTO de
      // respuesta del repo, que es como se apaga un gate.
      const implemented = (statement.heritageClauses ?? []).find(
        (clause) => clause.token === ts.SyntaxKind.ImplementsKeyword,
      );
      const first = implemented?.types?.[0];
      if (first && ts.isIdentifier(first.expression)) {
        entry.implemented.set(statement.name.text, first.expression.text);
      }
    }
  }
  return entry;
};

const buildIndex = (root) => {
  const index = new Map();
  for (const file of walk(root)) index.set(file, indexFile(file));
  return index;
};

const KEYWORD_ROOTS = new Map([
  [ts.SyntaxKind.StringKeyword, 'string'],
  [ts.SyntaxKind.NumberKeyword, 'number'],
  [ts.SyntaxKind.BooleanKeyword, 'boolean'],
  [ts.SyntaxKind.UnknownKeyword, 'unknown'],
  [ts.SyntaxKind.AnyKeyword, 'any'],
  [ts.SyntaxKind.NeverKeyword, 'never'],
  [ts.SyntaxKind.ObjectKeyword, 'object'],
  [ts.SyntaxKind.NullKeyword, 'null'],
  [ts.SyntaxKind.BigIntKeyword, 'bigint'],
  [ts.SyntaxKind.SymbolKeyword, 'symbol'],
]);

/**
 * Sigue un nombre hasta su origen. Devuelve `pkg:X`, `<repo>:X` — o `null`
 * cuando el archivo NO sabe nada de ese nombre, que es lo que permite seguir
 * buscando por los barrels sin confundir «no está acá» con «se resolvió a una
 * declaración local». Esa confusión fue el primer bug de este resolvedor: un
 * re-export de contrato a través de un `index.ts` se leía como declaración
 * propia del repo y producía seis drifts falsos.
 *
 * `seen` corta los ciclos de barrels, que existen y colgarían el gate.
 */
const tryResolve = (side, index, file, name, root, seen) => {
  const key = `${file}#${name}`;
  if (seen.has(key)) return null;
  seen.add(key);

  const entry = index.get(file);
  if (!entry) return null;

  const imported = entry.imported.get(name);
  if (imported) {
    if (imported.specifier.startsWith(CONTRACTS_MODULE)) return `pkg:${imported.originalName}`;
    const target = resolveModulePath(file, imported.specifier, root);
    if (target) {
      return (
        tryResolve(side, index, target, imported.originalName, root, seen)
        ?? `${side}:${imported.originalName}`
      );
    }
    return `${side}:${imported.originalName}`;
  }

  const alias = entry.aliases.get(name);
  if (alias) return rootOfTypeNode(side, index, file, alias, root);

  if (entry.declared.has(name)) {
    const contract = entry.implemented.get(name);
    if (contract) {
      const resolved = tryResolve(side, index, file, contract, root, new Set());
      if (resolved && resolved.startsWith('pkg:')) return resolved;
    }
    return `${side}:${name}`;
  }

  for (const specifier of entry.starReexports) {
    if (specifier.startsWith(CONTRACTS_MODULE)) continue;
    const target = resolveModulePath(file, specifier, root);
    if (!target) continue;
    const resolved = tryResolve(side, index, target, name, root, seen);
    if (resolved) return resolved;
  }

  return null;
};

const resolveRoot = (side, index, file, name, root) =>
  tryResolve(side, index, file, name, root, new Set()) ?? `${side}:${name}`;

/**
 * Reduce un nodo de tipo a su RAÍZ comparable, resolviendo los alias de los
 * nombres que encuentra por el camino.
 *
 * TODO nodo produce una raíz: ninguno se salta. Una versión anterior devolvía
 * `null` para lo que no fuera una referencia nombrada y la fila desaparecía del
 * reporte — anotar un handler `Promise<unknown>` contra un cliente que pedía
 * `void` pasaba en VERDE. Lo cazó romper el gate a propósito: un par que no se
 * puede comparar tiene que verse, no evaporarse.
 *
 * Las raíces con prefijo (`keyword:`, `literal:`, `inline:`, `union:`,
 * `opaque:`) son terminales y no se resuelven; sólo los nombres desnudos pasan
 * por `resolveRoot`.
 */
const rootOfTypeNode = (side, index, file, node, root) => {
  if (!node) return null;
  const source = node.getSourceFile();

  if (node.kind === ts.SyntaxKind.VoidKeyword || node.kind === ts.SyntaxKind.UndefinedKeyword) {
    return VOID_ROOT;
  }
  if (ts.isParenthesizedTypeNode(node)) {
    return rootOfTypeNode(side, index, file, node.type, root);
  }
  if (ts.isArrayTypeNode(node)) {
    return `Array(${rootOfTypeNode(side, index, file, node.elementType, root)})`;
  }
  if (ts.isUnionTypeNode(node)) {
    const meaningful = node.types.filter(
      (member) => member.kind !== ts.SyntaxKind.UndefinedKeyword,
    );
    if (meaningful.length === 1) {
      return rootOfTypeNode(side, index, file, meaningful[0], root);
    }
    const members = meaningful
      .map((member) => rootOfTypeNode(side, index, file, member, root))
      .sort()
      .join('|');
    return `union:(${members})`;
  }
  if (ts.isTypeReferenceNode(node)) {
    const name = node.typeName.getText(source);
    if (name === 'Array' && node.typeArguments?.length === 1) {
      return `Array(${rootOfTypeNode(side, index, file, node.typeArguments[0], root)})`;
    }
    if (TRANSPARENT_WRAPPERS.has(name) && node.typeArguments?.length) {
      return rootOfTypeNode(side, index, file, node.typeArguments[0], root);
    }
    if (NARROWING_WRAPPERS.has(name) && node.typeArguments?.length) {
      return `${name}(${rootOfTypeNode(side, index, file, node.typeArguments[0], root)})`;
    }
    return resolveRoot(side, index, file, name, root);
  }
  if (ts.isImportTypeNode(node)) {
    // `import('@memivo/contracts/auth').LogoutResponse` — la forma inline del
    // mismo import, que el cliente usa en algunos servicios. Sin esta rama caía
    // en `opaque:` y el par contra el api salía como drift falso.
    const specifier =
      ts.isLiteralTypeNode(node.argument) && ts.isStringLiteral(node.argument.literal)
        ? node.argument.literal.text
        : null;
    const qualifier = node.qualifier ? node.qualifier.getText(source) : null;
    if (specifier?.startsWith(CONTRACTS_MODULE) && qualifier) return `pkg:${qualifier}`;
  }
  const keyword = KEYWORD_ROOTS.get(node.kind);
  if (keyword) return `keyword:${keyword}`;
  if (ts.isLiteralTypeNode(node)) {
    return `literal:${node.getText(source)}`;
  }
  if (ts.isTypeLiteralNode(node)) {
    // Por sus claves ORDENADAS: dos literales inline con la misma forma son la
    // misma promesa aunque difieran en orden o en espacios.
    const keys = node.members
      .map((member) => (member.name ? member.name.getText(source) : '?'))
      .sort()
      .join(',');
    return `inline:{${keys}}`;
  }
  // ÚLTIMO RECURSO — y es una comparación MÁS DÉBIL que las de arriba: lo que
  // no reduce a un símbolo con nombre (intersecciones, indexados,
  // condicionales) se compara por su TEXTO FUENTE con los blancos colapsados.
  // La barra de `\s` faltaba y el defecto tenía las dos caras: `/s+/g` no
  // colapsa blancos, reemplaza cada letra `s` por un espacio. Falso positivo
  // —el MISMO tipo escrito multilínea de un lado y en una línea del otro daba
  // drift, y la presión era agregar un renglón a `INTENTIONAL_ROUTE_DRIFT`— y
  // falso negativo mudo: `{ ks: Cat }` y `{ k : Cat }` colapsaban a la misma
  // clave. Además mutilaba el símbolo impreso en el reporte (`IGue tPo t`).
  return `opaque:${node.getText(source).replace(/\s+/g, ' ').trim()}`;
};

// ── LADO API ───────────────────────────────────────────────────────────────

const collectEndpoints = (index, root) => {
  const endpoints = [];
  for (const [file, entry] of index) {
    if (!file.endsWith('.controller.ts')) continue;
    const { source } = entry;
    const visit = (node) => {
      if (ts.isClassDeclaration(node)) {
        const controller = decoratorsOf(node).find((d) => decoratorName(d) === 'Controller');
        if (controller) {
          const base = decoratorFirstStringArgument(controller);
          for (const member of node.members) {
            if (!ts.isMethodDeclaration(member)) continue;
            const decorators = decoratorsOf(member);
            const http = decorators.find((d) => HTTP_DECORATORS.has(decoratorName(d)));
            if (!http) continue;
            const suffix = decoratorFirstStringArgument(http);
            const path = `/${[base, suffix].filter(Boolean).join('/')}`;
            const point = source.getLineAndCharacterOfPosition(member.getStart(source));
            endpoints.push({
              method: decoratorName(http).toUpperCase(),
              path,
              skeleton: skeleton(path),
              root: member.type ? rootOfTypeNode('api', index, file, member.type, root) : null,
              returnText: member.type ? member.type.getText(source) : null,
              idempotent: decorators.some((d) => decoratorName(d) === 'Idempotent'),
              location: `${relative(workspaceRoot, file).replace(/\\/g, '/')}:${point.line + 1}`,
            });
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  return endpoints;
};

// ── LADO CLIENTE ───────────────────────────────────────────────────────────

const urlOfArgument = (node, source) => {
  if (!node) return null;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isTemplateExpression(node)) {
    // Cada `${…}` colapsa a un segmento dinámico, igual que `skeleton()` hace
    // con los `:param` del servidor.
    let text = node.head.text;
    for (const span of node.templateSpans) text += '${x}' + span.literal.text;
    return text;
  }
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const left = urlOfArgument(node.left, source);
    return left === null ? null : `${left}\${x}`;
  }
  return null;
};

/**
 * Reconoce la cabecera de idempotencia MIRE COMO MIRE el call-site: con o sin
 * argumento, en el objeto de config inline o en una variable que se le asigna
 * antes. El primer censo de este eje grepeó `buildIdempotencyKeyHeader()` con
 * los paréntesis vacíos y perdió el call-site que pasa una clave, así que un
 * desapareado se leyó como apareado.
 */
const mentionsIdempotencyHelper = (node, source) =>
  node ? /buildIdempotencyKeyHeader\s*\(/.test(node.getText(source)) : false;

const collectClientCalls = (index, root) => {
  const calls = [];
  const unpaired = [];
  for (const [file, entry] of index) {
    const { source } = entry;
    const idempotencyVariables = new Set();
    const visit = (node) => {
      if (
        ts.isVariableDeclaration(node)
        && ts.isIdentifier(node.name)
        && node.initializer
        && mentionsIdempotencyHelper(node.initializer, source)
      ) {
        idempotencyVariables.add(node.name.text);
      }
      if (
        ts.isCallExpression(node)
        && ts.isPropertyAccessExpression(node.expression)
        && ts.isIdentifier(node.expression.expression)
        && node.expression.expression.text === 'api'
        && AXIOS_METHODS.has(node.expression.name.text)
      ) {
        const point = source.getLineAndCharacterOfPosition(node.getStart(source));
        const location = `${relative(workspaceRoot, file).replace(/\\/g, '/')}:${point.line + 1}`;
        const url = urlOfArgument(node.arguments[0], source);
        const rest = node.arguments.slice(1);
        const carriesIdempotencyKey = rest.some(
          (argument) =>
            mentionsIdempotencyHelper(argument, source)
            || (ts.isIdentifier(argument) && idempotencyVariables.has(argument.text))
            || (ts.isObjectLiteralExpression(argument)
              && argument.properties.some(
                (property) =>
                  ts.isShorthandPropertyAssignment(property)
                  && idempotencyVariables.has(property.name.text),
              )),
        );
        const call = {
          method: node.expression.name.text.toUpperCase(),
          url,
          skeleton: url === null ? null : skeleton(url.split('?')[0]),
          root:
            node.typeArguments?.length
              ? rootOfTypeNode('client', index, file, node.typeArguments[0], root)
              : null,
          typeText: node.typeArguments?.length ? node.typeArguments[0].getText(source) : null,
          carriesIdempotencyKey,
          location,
        };
        if (call.skeleton === null) unpaired.push(location);
        else calls.push(call);
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  return { calls, unpaired };
};

// ── COMPARACIÓN ────────────────────────────────────────────────────────────

const apiIndex = buildIndex(roots.api);
const clientIndex = buildIndex(roots.client);
const endpoints = collectEndpoints(apiIndex, roots.api);
const { calls: clientCalls, unpaired: unpairedClientCalls } = collectClientCalls(clientIndex, roots.client);

const endpointsByKey = new Map();
for (const endpoint of endpoints) {
  const key = `${endpoint.method} ${endpoint.skeleton}`;
  if (!endpointsByKey.has(key)) endpointsByKey.set(key, []);
  endpointsByKey.get(key).push(endpoint);
}

const bodyDrifts = [];
const rootDrifts = [];
const idempotencyDrifts = [];
const ambiguousRoots = [];
const unannotatedPairs = [];
const matchedKeys = new Set();
let pairs = 0;

for (const call of clientCalls) {
  const key = `${call.method} ${call.skeleton}`;
  const candidates = endpointsByKey.get(key);
  if (!candidates) continue;
  // Un mismo esqueleto declarado por dos controllers distintos no permite decir
  // cuál contesta: se reporta y no se compara, en vez de elegir uno al azar.
  if (candidates.length > 1) {
    ambiguousRoots.push(`${key} — ${candidates.length} handlers: ${candidates.map((e) => e.location).join(', ')}`);
    continue;
  }
  const endpoint = candidates[0];
  matchedKeys.add(key);
  pairs += 1;

  // Un lado SIN anotación no se puede comparar — pero tampoco se saltea en
  // silencio: se lista. Que cada extremo TENGA un tipo es el eje de
  // `audit-transport-surfaces`, que ya lo tumba; acá sólo se deja constancia de
  // por qué esa fila no aportó comparación, para que el conteo de pares
  // verificados no se lea como cobertura que no hubo.
  if (call.root === null || endpoint.root === null) {
    unannotatedPairs.push(
      `${key} — ${endpoint.root === null ? 'api sin tipo de retorno' : 'cliente sin type argument'} (${endpoint.location} · ${call.location})`,
    );
    continue;
  }

  const excused = INTENTIONAL_ROUTE_DRIFT.has(key);
  const apiIsVoid = endpoint.root === VOID_ROOT;
  const clientIsVoid = call.root === VOID_ROOT;

  if (apiIsVoid !== clientIsVoid) {
    if (!excused) {
      bodyDrifts.push(
        `${key}\n      api    ${endpoint.returnText}  (${endpoint.location})\n      cliente ${call.typeText}  (${call.location})`,
      );
    }
  } else if (!apiIsVoid && endpoint.root !== call.root && !excused) {
    rootDrifts.push(
      `${key}\n      api    ${endpoint.returnText} → ${endpoint.root}  (${endpoint.location})\n      cliente ${call.typeText} → ${call.root}  (${call.location})`,
    );
  }

  if (
    endpoint.idempotent
    && !call.carriesIdempotencyKey
    && !INTENTIONAL_WITHOUT_IDEMPOTENCY_KEY.has(key)
  ) {
    idempotencyDrifts.push(
      `${key}\n      api    @Idempotent()  (${endpoint.location})\n      cliente sin Idempotency-Key  (${call.location})`,
    );
  }
}

const staleDriftExcuses = [...INTENTIONAL_ROUTE_DRIFT.keys()].filter((key) => !matchedKeys.has(key));
const staleIdempotencyExcuses = [...INTENTIONAL_WITHOUT_IDEMPOTENCY_KEY.keys()].filter(
  (key) => !matchedKeys.has(key),
);

const report = {
  endpoints: endpoints.length,
  clientCalls: clientCalls.length,
  pairs,
  idempotentEndpoints: endpoints.filter((endpoint) => endpoint.idempotent).length,
  unpairedClientCalls,
  ambiguousRoots,
  unannotatedPairs,
  bodyDrifts,
  rootDrifts,
  idempotencyDrifts,
  staleDriftExcuses,
  staleIdempotencyExcuses,
};

if (process.argv.includes('--verbose')) {
  console.log(JSON.stringify(report, null, 2));
}

const failures = [];
if (pairs === 0) {
  // Un gate sobre el conjunto vacío está APAGADO, no limpio. Si el apareo deja
  // de enganchar —un refactor de rutas, un repo que no está en disco— tiene que
  // salir en rojo en vez de felicitar.
  failures.push(
    'audit:route-parity: 0 pares ruta↔call-site. El apareo dejó de enganchar; el gate estaría midiendo el conjunto vacío.',
  );
}
if (bodyDrifts.length > 0) {
  failures.push(
    `audit:route-parity: ${bodyDrifts.length} ruta(s) donde un lado dice \`void\` y el otro promete un cuerpo:\n    ${bodyDrifts.join('\n    ')}\n\n` +
      '  Es la forma que ROMPE EN EL CAMINO DE ÉXITO: el cliente desreferencia un cuerpo\n' +
      '  que nunca llega. O el handler devuelve el recurso, o el call-site deja de pedirlo.',
  );
}
if (rootDrifts.length > 0) {
  failures.push(
    `audit:route-parity: ${rootDrifts.length} ruta(s) donde los dos lados nombran contratos distintos:\n    ${rootDrifts.join('\n    ')}\n\n` +
      '  Los dos extremos del mismo cable tienen que resolver al MISMO símbolo. Si uno de\n' +
      '  los dos declara su propia copia, adoptá el contrato compartido.',
  );
}
if (idempotencyDrifts.length > 0) {
  failures.push(
    `audit:route-parity: ${idempotencyDrifts.length} handler(s) \`@Idempotent()\` sin \`Idempotency-Key\` del lado del cliente:\n    ${idempotencyDrifts.join('\n    ')}\n\n` +
      '  El interceptor queda inerte: el reintento por red intermitente vuelve a ejecutar\n' +
      '  el efecto. Pasá `{ headers: buildIdempotencyKeyHeader() }` en el call-site.',
  );
}
if (staleDriftExcuses.length > 0 || staleIdempotencyExcuses.length > 0) {
  failures.push(
    `audit:route-parity: ${staleDriftExcuses.length + staleIdempotencyExcuses.length} excusa(s) sin par vivo que las respalde:\n    ${[...staleDriftExcuses, ...staleIdempotencyExcuses].join('\n    ')}\n\n` +
      '  Una excusa que dejó de matchear excusa cualquier ruta futura con ese nombre. Borrala.',
  );
}

if (failures.length > 0) {
  console.error(failures.join('\n\n'));
  process.exitCode = 1;
} else {
  console.log(
    `audit:route-parity: ${pairs} pares ruta↔call-site verificados sobre ${endpoints.length} endpoints ` +
      `y ${clientCalls.length} llamadas tipadas; ${report.idempotentEndpoints} handlers @Idempotent() apareados; ` +
      `${unpairedClientCalls.length} llamada(s) con url no literal fuera de alcance.`,
  );
}
