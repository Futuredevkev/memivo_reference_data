const { existsSync, readFileSync, readdirSync } = require('node:fs');
const { basename, dirname, join, relative, resolve } = require('node:path');
const ts = require('typescript');

const packageRoot = resolve(__dirname, '..');
const workspaceRoot = dirname(packageRoot);
const packageSrc = resolve(packageRoot, 'src');
// Las rutas se pueden sobreescribir por entorno para que el gate se pueda ejercitar
// contra repos sintéticos: sin esa costura, la única forma de probar que la auditoría
// detecta un duplicado sería tener el duplicado de verdad en un consumidor.
const roots = {
  api: process.env.MEMIVO_AUDIT_API_SRC
    ? resolve(process.env.MEMIVO_AUDIT_API_SRC)
    : resolve(workspaceRoot, 'memivo_api', 'src'),
  client: process.env.MEMIVO_AUDIT_CLIENT_SRC
    ? resolve(process.env.MEMIVO_AUDIT_CLIENT_SRC)
    : resolve(workspaceRoot, 'memivo_client', 'src'),
};
// El paquete entra como un lado más de la comparación: un contrato duplicado por UN
// solo consumidor nunca forma el par api×cliente y se colaba entero por el gate.
const declarationRoots = { ...roots, package: packageSrc };

/**
 * Excusas para pares que SÍ se forman y que no son un defecto.
 *
 * La clave es `${kind}:${name}` — sin lado y sin firma. Eso las hace potentes y
 * peligrosas a la vez: mientras una entrada esté acá, CUALQUIER declaración con ese
 * nombre, en cualquiera de los dos consumidores y con la forma que sea, queda excusada
 * sin llegar nunca a `crossRepoRisks`. Una entrada que dejó de matchear no es inocua:
 * es una excusa en blanco esperando a que alguien escriba el nombre.
 *
 * Por eso el reporte publica `resolvedBoundaries` y el gate FALLA con ellas: una
 * entrada acá tiene que estar ganándose el lugar en cada corrida.
 */
const intentionalBoundaries = new Map([
  ['class:Album', 'Server ORM entity and normalized client model are different layers.'],
  ['class:Folder', 'Server ORM entity and normalized client model are different layers.'],
  ['class:Notification', 'Server ORM entity and transport model have different timestamps and relations.'],
  ['class:GuestPost', 'Server ORM entity and normalized client model are different layers.'],
  ['class:PhotoTag', 'Server ORM entity and normalized client model are different layers.'],
  ['class:Photo', 'Server ORM entity and normalized client model are different layers.'],
  ['const:SENTRY_IGNORED_HTTP_STATUS', 'Configuración operativa independiente por runtime.'],
  ['const:SENTRY_PROFILES_SAMPLE_RATE_DEFAULT', 'Configuración operativa independiente por runtime.'],
  ['const:SENTRY_TRACES_SAMPLE_RATE_DEFAULT', 'Configuración operativa independiente por runtime.'],
  ['type:CloudinaryTransformResourceType', 'Unión primitiva local; no representa el mismo contrato de dominio que los tipos visuales.'],
  ['const:SENSITIVE_KEYS', 'Cada runtime redacta superficies y credenciales diferentes.'],
  ['class:MemivoMoment', 'Entidad ORM del ranking persistido; el ítem que viaja al cliente es la unión MemivoMoment.'],
  ['interface:AlbumGuest', 'Modelo de UI normalizado del cliente; el shape HTTP compartido lo valida el servicio.'],
  ['const:EMAIL_REGEX', 'Redacción de PII en Sentry (global, sin anclas) vs validación de un email completo.'],
]);

/**
 * Duplicados REALES cuyo arreglo vive en el repo consumidor: el paquete no puede
 * cerrarlos, así que no tumban su gate, pero quedan listados con el archivo y el
 * contrato que deben adoptar. Al adoptarlo, la entrada deja de matchear y el reporte
 * la muestra en `resolvedConsumerAdoption` para que se borre de esta tabla.
 */
const pendingConsumerAdoption = new Map([
  ['api:const:MESSAGE_CONTEXT_DEFAULT_LIMIT', 'chat/constants/chat-message: importar MESSAGE_CONTEXT_DEFAULT_LIMIT de @memivo/contracts/chat en vez de redeclarar el 40.'],
  ['api:const:CLOUDINARY_RESOURCE_TYPES', 'cloudinary/constants/cloudinary: usar CLOUDINARY_UPLOAD_RESOURCE_TYPES de @memivo/contracts/media.'],
  ['api:type:MediaFilterId', 'cloudinary/types: usar el MediaFilterId que su propio barrel de constantes ya re-exporta de @memivo/contracts/media.'],
  ['client:type:AuthTokens', 'store/auth/authSession: usar AuthTokens de @memivo/contracts/auth.'],
  ['client:interface:BlockedUserSummary', 'types/block: usar BlockedUserSummary de @memivo/contracts; la copia local relaja name/lastName/avatarUrl a opcionales y esconde si el API emite null.'],
  ['client:interface:BlockedUsersListResponse', 'types/block: usar BlockedUsersListResponse de @memivo/contracts (PaginatedResponse compartido).'],
  ['client:const:VIDEO_EXTENSIONS', 'utils/file-utils: usar ALLOWED_VIDEO_FORMATS de @memivo/contracts/media.'],
]);

const intentionalLocalErrorCodes = new Map([
  ['client:UPLOAD_INTERRUPTED', 'Estado local persistido del pipeline; nunca cruza la API.'],
]);

function walk(root) {
  const files = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (['coverage', 'dist', 'node_modules', '__snapshots__'].includes(entry.name)) continue;
    const path = join(root, entry.name);
    if (entry.isDirectory()) files.push(...walk(path));
    else if (/\.tsx?$/.test(entry.name) && !/\.(spec|test)\.tsx?$/.test(entry.name)) files.push(path);
  }
  return files;
}

function sourceFile(path) {
  const text = readFileSync(path, 'utf8');
  return {
    text,
    source: ts.createSourceFile(
      path,
      text,
      ts.ScriptTarget.Latest,
      true,
      path.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    ),
  };
}

function unwrap(node) {
  while (
    node &&
    (ts.isAsExpression(node) ||
      ts.isTypeAssertionExpression(node) ||
      ts.isParenthesizedExpression(node) ||
      ts.isSatisfiesExpression(node))
  ) {
    node = node.expression;
  }
  return node;
}

function literalValue(node, source) {
  node = unwrap(node);
  if (!node) return undefined;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isRegularExpressionLiteral(node)) return { regex: node.text };
  if (ts.isPrefixUnaryExpression(node) && ts.isNumericLiteral(node.operand)) {
    const number = Number(node.operand.text);
    return node.operator === ts.SyntaxKind.MinusToken ? -number : number;
  }
  if (ts.isArrayLiteralExpression(node)) {
    const values = node.elements.map((element) => literalValue(element, source));
    return values.some((value) => value === undefined) ? undefined : values;
  }
  if (ts.isNewExpression(node) && node.expression.getText(source) === 'Set' && node.arguments?.length === 1) {
    const values = literalValue(node.arguments[0], source);
    return Array.isArray(values) ? { set: values } : undefined;
  }
  if (ts.isCallExpression(node) && node.expression.getText(source) === 'Object.freeze') {
    return literalValue(node.arguments[0], source);
  }
  if (ts.isObjectLiteralExpression(node)) {
    const object = {};
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property)) return undefined;
      const key = property.name.getText(source).replace(/^['"]|['"]$/g, '');
      const value = literalValue(property.initializer, source);
      if (value === undefined) return undefined;
      object[key] = value;
    }
    return object;
  }
  return undefined;
}

function stable(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return JSON.stringify(
      Object.fromEntries(Object.entries(value).sort(([left], [right]) => left.localeCompare(right))),
    );
  }
  return JSON.stringify(value);
}

function isPublicPackageFile(file) {
  // Mismo recorte que `exportedSharedSymbols`: los barrels no declaran nada propio y
  // `internal/` son piezas privadas que ningún dominio re-exporta.
  return basename(file) !== 'index.ts' && !/[\\/]internal[\\/]/.test(file);
}

function declarations(side) {
  const output = [];
  const root = declarationRoots[side];
  for (const file of walk(root)) {
    if (side === 'package' && !isPublicPackageFile(file)) continue;
    const { text, source } = sourceFile(file);
    const sharedImports = new Set();
    for (const statement of source.statements) {
      if (
        !ts.isImportDeclaration(statement) ||
        !ts.isStringLiteral(statement.moduleSpecifier) ||
        !statement.moduleSpecifier.text.startsWith('@memivo/contracts')
      ) continue;
      const clause = statement.importClause;
      if (clause?.name) sharedImports.add(clause.name.text);
      if (clause?.namedBindings && ts.isNamedImports(clause.namedBindings)) {
        for (const element of clause.namedBindings.elements) sharedImports.add(element.name.text);
      }
      if (clause?.namedBindings && ts.isNamespaceImport(clause.namedBindings)) {
        sharedImports.add(clause.namedBindings.name.text);
      }
    }
    const isSharedBacked = (node) => {
      const declarationText = node.getText(source);
      if (declarationText.includes('@memivo/contracts')) return true;
      return [...sharedImports].some((name) => new RegExp(`\\b${name}\\b`).test(declarationText));
    };
    // Un alias local de un tipo compartido SIGUE siendo el contrato compartido, así que
    // lo que se derive de él tampoco es una redefinición propia: sin este cierre,
    // `type Wire = Shared<X>` seguido de `type Local = Omit<Wire, 'k'> & {...}` se
    // denunciaba como duplicado del contrato del que justamente deriva.
    for (let grew = true; grew; ) {
      grew = false;
      for (const statement of source.statements) {
        const names = ts.isVariableStatement(statement)
          ? statement.declarationList.declarations
              .filter((declaration) => ts.isIdentifier(declaration.name))
              .map((declaration) => declaration.name.text)
          : [statement.name?.text].filter(Boolean);
        for (const name of names) {
          if (sharedImports.has(name) || !isSharedBacked(statement)) continue;
          sharedImports.add(name);
          grew = true;
        }
      }
    }
    for (const statement of source.statements) {
      let kind;
      let name;
      let signature;
      if (ts.isEnumDeclaration(statement)) {
        kind = 'enum';
        name = statement.name.text;
        signature = statement.members.map((member) => literalValue(member.initializer, source));
      } else if (ts.isInterfaceDeclaration(statement)) {
        kind = 'interface';
        name = statement.name.text;
        signature = statement.members.map((member) => member.getText(source).replace(/\s+/g, ''));
      } else if (ts.isTypeAliasDeclaration(statement)) {
        kind = 'type';
        name = statement.name.text;
        signature = statement.type.getText(source).replace(/\s+/g, '');
      } else if (ts.isClassDeclaration(statement) && statement.name) {
        kind = 'class';
        name = statement.name.text;
        signature = statement.members
          .filter(ts.isPropertyDeclaration)
          .map((member) => {
            const propertyName = member.name?.getText(source) ?? '';
            const optional = member.questionToken ? '?' : '';
            const type = member.type?.getText(source).replace(/\s+/g, '') ?? 'unknown';
            return `${propertyName}${optional}:${type};`;
          });
        if (signature.length === 0) continue;
      } else if (ts.isVariableStatement(statement)) {
        for (const declaration of statement.declarationList.declarations) {
          if (!ts.isIdentifier(declaration.name)) continue;
          if (isSharedBacked(declaration)) continue;
          const value = literalValue(declaration.initializer, source);
          if (value !== undefined) {
            output.push({
              side,
              kind: 'const',
              name: declaration.name.text,
              signature: value,
              file: relative(root, file),
            });
          }
        }
        continue;
      }
      if (kind && name && signature !== undefined) {
        if (isSharedBacked(statement)) continue;
        output.push({ side, kind, name, signature, file: relative(root, file) });
      }
    }

    // El recorrido de arriba sólo mira `source.statements`: el NIVEL SUPERIOR del
    // archivo. Un patrón del contrato copiado dentro del argumento de un decorador
    // (`@Matches(/^\+[1-9]\d{6,14}$/)`) o dentro del cuerpo de una función
    // (`const emailRegex = /.../` adentro de `validateEmailFormat`) nunca entraba al
    // corpus, así que no podía formar par con el símbolo del paquete y
    // `crossRepoRisks` no lo podía ver NUNCA. Tres copias byte a byte de
    // EMAIL_REGEX, INTERNATIONAL_PHONE_REGEX e INSTAGRAM_HANDLE_REGEX vivían así en
    // el api con el gate en verde.
    //
    // Se recolectan sólo REGEX y sólo en los consumidores: un regex idéntico es
    // prueba de duplicación por sí solo (`substantial` es true para un objeto), no
    // necesita coincidencia de nombre, y acotarlo a regex mantiene la señal alta.
    // El paquete no lo necesita: ahí los patrones se declaran en el nivel superior,
    // que es la convención.
    if (side !== 'package') {
      const topLevelInitializers = new Set(
        source.statements
          .filter(ts.isVariableStatement)
          .flatMap((statement) => statement.declarationList.declarations.map((d) => d.initializer))
          .filter(Boolean),
      );
      const visit = (node) => {
        if (ts.isRegularExpressionLiteral(node) && !topLevelInitializers.has(node)) {
          const value = literalValue(node, source);
          if (value !== undefined) {
            // El nombre de la variable si lo hay (`const emailRegex = /.../`). Si el
            // regex es anónimo —el caso del decorador— el nombre lleva la ubicación
            // para que sea ÚNICO: un placeholder compartido haría `sameName` true
            // entre dos regex que no tienen nada que ver y ahogaría el reporte. Sin
            // nombre que comparar, el cruce queda donde corresponde: la firma, que
            // para un regex es evidencia suficiente por sí sola.
            const parent = node.parent;
            const line =
              source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
            const name =
              parent && ts.isVariableDeclaration(parent) && ts.isIdentifier(parent.name)
                ? parent.name.text
                : `InlineRegex@${relative(root, file).replace(/\\/g, '/')}:${line}`;
            output.push({
              side,
              kind: 'const',
              name,
              signature: value,
              file: relative(root, file),
              inlineRegex: true,
            });
          }
        }
        ts.forEachChild(node, visit);
      };
      ts.forEachChild(source, visit);
    }
  }
  return output;
}

function evaluatePair(left, right) {
  const sameName = left.name.toLowerCase() === right.name.toLowerCase();
  const sameSignature = stable(left.signature) === stable(right.signature);
  const memberNames = (signature) =>
    Array.isArray(signature)
      ? new Set(
          signature
            .filter((member) => typeof member === 'string')
            .map((member) => member.match(/^([^?:]+)/)?.[1])
            .filter(Boolean),
        )
      : new Set();
  const leftMembers = memberNames(left.signature);
  const rightMembers = memberNames(right.signature);
  const sharedMembers = [...leftMembers].filter((member) => rightMembers.has(member));
  const overlap = Math.min(leftMembers.size, rightMembers.size)
    ? sharedMembers.length / Math.min(leftMembers.size, rightMembers.size)
    : 0;
  const stem = (name) => name
    .replace(/^(?:I)(?=[A-Z])/, '')
    .replace(/(?:Dto|Request|Payload|Input|Response|Interface)$/i, '')
    .toLowerCase();
  const dtoCandidate =
    left.kind === 'class' &&
    /Dto$/.test(left.name) &&
    leftMembers.size >= 2 &&
    rightMembers.size >= 2 &&
    overlap >= 0.8 &&
    (stem(left.name) === stem(right.name) || sharedMembers.length >= 3);
  // Sin coincidencia de nombre, la forma es la única evidencia: dos shapes de 2
  // campos (`{ id; url }`, `{ downloadUrl; fileName }`) chocan por casualidad entre
  // dominios distintos y ahogarían la señal. Un VALOR literal idéntico (catálogos,
  // límites) sí prueba duplicación aunque el nombre difiera.
  const substantial = Array.isArray(left.signature)
    ? left.signature.length >= 3
    : typeof left.signature === 'object' || String(left.signature).length >= 6;
  if (!sameName && !(sameSignature && substantial) && !dtoCandidate) return undefined;

  return { sameName, sameSignature, dtoCandidate, left, right };
}

function findCrossRepoRisks() {
  const api = declarations('api');
  const client = declarations('client');
  const shared = declarations('package');
  const risks = [];
  const intentional = [];
  const pending = [];
  const matchedPendingKeys = new Set();
  const matchedBoundaryKeys = new Set();

  // El consumidor va SIEMPRE a la izquierda: la tabla de fronteras intencionales está
  // escrita con sus nombres (entidad ORM, modelo normalizado) y debe clasificar igual
  // el par api×cliente que el par consumidor×paquete.
  for (const [lefts, rights] of [[api, client], [api, shared], [client, shared]]) {
    for (const left of lefts) {
      for (const right of rights) {
        // Un regex recolectado del interior de un decorador o de un cuerpo de
        // función sólo se cruza contra EL PAQUETE. El defecto que persigue es «un
        // consumidor reimplementó un patrón que ya vive en el contrato»; que el api
        // y el cliente escriban los dos `/\s+/g` —uno para normalizar un asunto de
        // mail, el otro para un accessibilityLabel— no es un contrato compartido, y
        // dejar que formen par ahoga la señal (medido: 4 pares reales contra 4 de
        // casualidad, y sin este corte el reporte llegaba a 1174).
        if ((left.inlineRegex || right.inlineRegex) && right.side !== 'package') continue;
        const item = evaluatePair(left, right);
        if (!item) continue;
        const boundaryKey = `${left.kind}:${left.name}`;
        const boundary = intentionalBoundaries.get(boundaryKey);
        if (boundary) {
          matchedBoundaryKeys.add(boundaryKey);
          intentional.push({ ...item, reason: boundary });
          continue;
        }
        const pendingKey = `${left.side}:${left.kind}:${left.name}`;
        const adoption = pendingConsumerAdoption.get(pendingKey);
        if (adoption && right.side === 'package') {
          matchedPendingKeys.add(pendingKey);
          pending.push({ ...item, fix: adoption });
          continue;
        }
        risks.push(item);
      }
    }
  }
  const resolved = [...pendingConsumerAdoption.keys()].filter((key) => !matchedPendingKeys.has(key));
  // Mismo mecanismo que `resolved`, para la otra tabla. Sin esto, una entrada de
  // `intentionalBoundaries` que dejó de matchear es INVISIBLE y se acumula — y no es
  // inocua: la clave es `${kind}:${name}`, sin lado ni firma, así que mientras siga
  // en el mapa cualquier `class User` / `class Poll` que aparezca en el futuro, en
  // CUALQUIERA de los dos consumidores y con la forma que sea (incluso una copia
  // literal del contrato compartido), se clasifica como frontera intencional y nunca
  // llega a `crossRepoRisks`. Una excusa que caducó es una excusa en blanco.
  const resolvedBoundaries = [...intentionalBoundaries.keys()].filter(
    (key) => !matchedBoundaryKeys.has(key),
  );
  return { risks, intentional, pending, resolved, resolvedBoundaries };
}

function combinedText(side, excludedFragment) {
  return walk(roots[side])
    .filter((file) => !excludedFragment || !file.includes(excludedFragment))
    .map((file) => readFileSync(file, 'utf8'))
    .join('\n');
}

function memberReferences(text) {
  const withoutComments = text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
  return new Set(
    [...withoutComments.matchAll(/\b(?:ErrorCode|[A-Z][A-Za-z]+ErrorCode)\.([A-Z][A-Z0-9_]*)\b/g)].map(
      (match) => match[1],
    ),
  );
}

function exportedSharedSymbols() {
  // Símbolo -> dominio (`errors`, `media`, ...) para poder resolver los `export *`
  // de subpath, que consumen un dominio entero sin nombrar sus símbolos.
  const symbols = new Map();
  for (const file of walk(packageSrc)) {
    const { source } = sourceFile(file);
    if (basename(file) === 'index.ts') continue;
    // `internal/` holds private building blocks that no domain barrel re-exports;
    // they are exported only for sibling imports, so they are not public surface.
    if (/[\\/]internal[\\/]/.test(file)) continue;
    const domain = relative(packageSrc, file).split(/[\\/]/)[0];
    for (const statement of source.statements) {
      if (!statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) continue;
      if (
        ts.isEnumDeclaration(statement) ||
        ts.isInterfaceDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement) ||
        ts.isFunctionDeclaration(statement) ||
        ts.isClassDeclaration(statement)
      ) {
        if (statement.name) symbols.set(statement.name.text, domain);
      } else if (ts.isVariableStatement(statement)) {
        for (const declaration of statement.declarationList.declarations) {
          if (ts.isIdentifier(declaration.name)) symbols.set(declaration.name.text, domain);
        }
      }
    }
  }
  return symbols;
}

/**
 * Nombres que los consumidores IMPORTAN del paquete, leídos del AST.
 *
 * Antes esto era un `match` de la palabra sobre el texto concatenado de los dos
 * repos: un símbolo local homónimo —o la palabra suelta dentro de un comentario—
 * alcanzaba para dar por vivo un export muerto. `wildcardDomains` cubre el único
 * caso que no se puede resolver por nombre (`export *`, `import * as`), donde el
 * consumidor toma el dominio entero.
 */
/**
 * Símbolos que el PROPIO paquete referencia desde otro archivo suyo.
 *
 * Sin esto, `unusedSharedExports` mide mal: los 19 enums por dominio de
 * `errors/` no los importa ningún consumidor —importan el `ErrorCode`
 * consolidado— pero son exactamente las piezas con las que ese consolidado se
 * arma (`errors/index.ts`). Marcarlos como muertos es al revés: son la fuente
 * de verdad. Lo mismo `MB`, que alimenta `RESOURCE_UPLOAD_LIMITS`.
 *
 * El gate estuvo verde por accidente hasta ahora: el api tenía 19 archivos que
 * sólo hacían `export { XErrorCode } from '@memivo/contracts/errors'` sin que
 * nadie los importara. Eran dead code que, de paso, satisfacía esta cuenta.
 * Al borrarlos, el gate empezó a reportar 19 falsos positivos — o sea que la
 * cuenta nunca midió lo que dice medir.
 *
 * Queda como muerto de verdad sólo lo que ni el paquete ni los consumidores
 * tocan.
 */
function symbolsReferencedInsidePackage() {
  const referenced = new Set();
  for (const file of walk(packageSrc)) {
    const { source } = sourceFile(file);
    const visit = (node) => {
      // Sólo identificadores en posición de USO. La declaración propia no
      // cuenta: si contara, todo símbolo se auto-justificaría.
      if (ts.isIdentifier(node)) {
        const parent = node.parent;
        const isOwnName =
          parent &&
          'name' in parent &&
          parent.name === node &&
          (ts.isEnumDeclaration(parent) ||
            ts.isInterfaceDeclaration(parent) ||
            ts.isTypeAliasDeclaration(parent) ||
            ts.isFunctionDeclaration(parent) ||
            ts.isClassDeclaration(parent) ||
            ts.isVariableDeclaration(parent));
        if (!isOwnName) referenced.add(node.text);
      }
      ts.forEachChild(node, visit);
    };
    ts.forEachChild(source, visit);
  }
  return referenced;
}

function importedSharedNames() {
  const names = new Set();
  const wildcardDomains = new Set();
  // Los agregados (`VALIDATION.MIN_AGE_YEARS`, `RESOURCE_UPLOAD_LIMITS[...]`) consumen
  // un símbolo sin importarlo por nombre, y casi siempre desde otro archivo que el
  // que hace el import. Se juntan todos los accesos y se resuelven al final contra
  // los objetos que sí vienen del paquete.
  const propertyAccesses = [];
  const sharedObjectNames = new Set();
  const domainOf = (specifier) => specifier.replace(/^@memivo\/contracts\/?/, '') || '*';
  for (const side of Object.keys(roots)) {
    for (const file of walk(roots[side])) {
      const { source } = sourceFile(file);
      for (const statement of source.statements) {
        const isImport = ts.isImportDeclaration(statement);
        const isExport = ts.isExportDeclaration(statement);
        if (!isImport && !isExport) continue;
        const specifier = statement.moduleSpecifier;
        if (!specifier || !ts.isStringLiteral(specifier)) continue;
        if (!specifier.text.startsWith('@memivo/contracts')) continue;
        const bindings = isImport ? statement.importClause?.namedBindings : statement.exportClause;
        if (isImport && statement.importClause?.name) wildcardDomains.add(domainOf(specifier.text));
        if (!bindings) {
          // `export * from '@memivo/contracts/errors'`: reexporta el dominio completo.
          if (isExport) wildcardDomains.add(domainOf(specifier.text));
          continue;
        }
        if (ts.isNamedImports(bindings) || ts.isNamedExports(bindings)) {
          for (const element of bindings.elements) {
            names.add((element.propertyName ?? element.name).text);
            // El alias local también cuenta como puerta al agregado: el cliente
            // re-exporta varios contratos con otro nombre.
            sharedObjectNames.add(element.name.text);
          }
        } else {
          wildcardDomains.add(domainOf(specifier.text));
        }
      }
      const visit = (node) => {
        if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.expression)) {
          propertyAccesses.push([node.expression.text, node.name.text]);
        }
        ts.forEachChild(node, visit);
      };
      visit(source);
    }
  }
  for (const [object, property] of propertyAccesses) {
    if (names.has(object) || sharedObjectNames.has(object)) names.add(property);
  }
  return { names, wildcardDomains };
}

function localeErrorKeys(locale) {
  const file = resolve(roots.client, 'i18n', 'locales', `${locale}.ts`);
  // Sin esto el fallo es un ENOENT crudo con el stack de `fs.readFileSync`, que no
  // nombra ni el locale ni el gate. Pasa de verdad: al ejercitar el auditor contra un
  // repo sintético por la costura `MEMIVO_AUDIT_CLIENT_SRC` —que es para lo que la
  // costura existe— el script moría antes de imprimir una sola línea del reporte.
  // Se sigue tratando como error duro: un locale que no está es cobertura que no se
  // puede medir, no cobertura vacía.
  if (!existsSync(file)) {
    throw new Error(
      `audit:consumers — falta el archivo de locale "${locale}": ${file}. ` +
        'La cobertura de traducciones de los 195 códigos de error se mide contra los 3 ' +
        'locales del cliente; si el cliente apunta a otro lado, revisá MEMIVO_AUDIT_CLIENT_SRC.',
    );
  }
  const { source } = sourceFile(file);
  const keys = new Set();
  const visit = (node) => {
    if (
      ts.isPropertyAssignment(node) &&
      node.name.getText(source).replace(/^['"]|['"]$/g, '') === 'errors' &&
      ts.isObjectLiteralExpression(node.initializer)
    ) {
      for (const property of node.initializer.properties) {
        if (!property.name) continue;
        const key = property.name.getText(source).replace(/^['"]|['"]$/g, '');
        if (/^[A-Z][A-Z0-9_]+$/.test(key)) keys.add(key);
      }
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return keys;
}

function rawRuntimeContractLiterals() {
  const contracts = require('../dist/index.js');
  const enumNames = [
    'AlbumMemberRole',
    'ModeratedContentType',
    'OAuthProvider',
    'SessionPlatform',
    'ValidRoles',
    'ChatMemberRole',
    'ChatMemberStatus',
    'ChatMessageType',
    'SystemMessageAction',
    'ChatReactionAction',
    'ChatReactionType',
    'ChatRoleBadge',
    'PollStatus',
    'ReactionAction',
    'ReactionType',
    'ProfileReportReason',
    'NotificationType',
    'DownloadContext',
    'Language',
    'EmailActionRequired',
    'ResourceType',
    'UploadContext',
  ];
  const ownersByValue = new Map();
  for (const enumName of enumNames) {
    for (const value of Object.values(contracts[enumName])) {
      if (typeof value !== 'string') continue;
      const owners = ownersByValue.get(value) ?? [];
      owners.push(enumName);
      ownersByValue.set(value, owners);
    }
  }

  const occurrences = [];
  for (const side of Object.keys(roots)) {
    for (const file of walk(roots[side])) {
      const { source } = sourceFile(file);
      const visit = (node) => {
        if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
          const parent = node.parent;
          const isModuleSpecifier =
            (ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent)) &&
            parent.moduleSpecifier === node;
          const isPropertyName =
            (ts.isPropertyAssignment(parent) ||
              ts.isPropertySignature(parent) ||
              ts.isMethodDeclaration(parent)) &&
            parent.name === node;
          const owners = ownersByValue.get(node.text);
          if (owners && !isModuleSpecifier && !isPropertyName) {
            const { line } = source.getLineAndCharacterOfPosition(node.getStart(source));
            const ancestors = [];
            let ancestor = node.parent;
            while (ancestor && !ts.isSourceFile(ancestor) && ancestors.length < 8) {
              ancestors.push(ancestor);
              ancestor = ancestor.parent;
            }
            const context = ancestors
              .slice(0, 5)
              .map((item) => item.getText(source))
              .join(' ');
            const immediateContext = ancestors
              .slice(0, 2)
              .map((item) => item.getText(source))
              .join(' ');
            const enumDeclaration = ancestors.find(ts.isEnumDeclaration);
            const propertyAssignment = ancestors.find(ts.isPropertyAssignment);
            const propertyName = propertyAssignment?.name.getText(source) ?? '';
            let reason;
            if (ancestors.some(ts.isLiteralTypeNode)) {
              reason = 'Type-only literal; it does not emit an independent runtime contract.';
            } else if (enumDeclaration && !owners.includes(enumDeclaration.name.text)) {
              reason = `Independent ${enumDeclaration.name.text} enum with an intentionally overlapping value.`;
            } else if (
              owners.includes('SessionPlatform') &&
              side === 'client' &&
              /Platform\.(?:OS|select)/.test(context)
            ) {
              reason = 'React Native platform branch, not the API session-platform contract.';
            } else if (
              owners.includes('ResourceType') &&
              !/resource_?type/i.test(immediateContext)
            ) {
              reason = 'Overlapping route, relation, field, or UI label; not a media ResourceType.';
            } else if (
              owners.includes('UploadContext') &&
              propertyAssignment &&
              !/context/i.test(propertyName)
            ) {
              reason = 'Overlapping named constant; not an upload context.';
            } else if (
              owners.includes('UploadContext') &&
              !/(?:\.context|\bcontext\s*[:=])/i.test(immediateContext)
            ) {
              reason = 'Overlapping resource, cache, query, or UI label; not an upload context.';
            } else if (
              owners.includes('Language') &&
              !/(?:language|locale)/i.test(immediateContext)
            ) {
              reason = 'Query alias or unrelated short token; not an application language.';
            } else if (
              owners.includes('ModeratedContentType') &&
              /httpMethod\s*:\s*['"]POST['"]/.test(context)
            ) {
              reason = 'HTTP method, not a moderated-content type.';
            }
            occurrences.push({
              side,
              file: relative(roots[side], file),
              line: line + 1,
              value: node.text,
              owners,
              ...(reason ? { reason } : {}),
            });
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(source);
    }
  }
  return occurrences;
}

const { ErrorCode } = require('../dist/errors/index.js');
const errorCodes = Object.keys(ErrorCode);
const apiText = combinedText('api', `${join('common', 'constants', 'error-codes')}`);
const clientText = combinedText('client');
const apiErrorReferences = memberReferences(apiText);
const clientErrorReferences = memberReferences(clientText);
const unknownApiErrorReferences = [...apiErrorReferences].filter((code) => !errorCodes.includes(code));
const unknownClientErrorReferences = [...clientErrorReferences].filter((code) => !errorCodes.includes(code));
const apiUnusedErrorCodes = errorCodes.filter((code) => !apiErrorReferences.has(code));
const literalErrorCodes = [];
const intentionalLiteralErrorCodes = [];
for (const side of Object.keys(roots)) {
  for (const file of walk(roots[side])) {
    const text = readFileSync(file, 'utf8');
    for (const match of text.matchAll(/\berrorCode\s*:\s*['"]([A-Z][A-Z0-9_]*)['"]/g)) {
      const item = { side, file: relative(roots[side], file), code: match[1] };
      const reason = intentionalLocalErrorCodes.get(`${side}:${match[1]}`);
      if (reason) intentionalLiteralErrorCodes.push({ ...item, reason });
      else literalErrorCodes.push(item);
    }
  }
}

const sharedExports = exportedSharedSymbols();
const { names: importedSymbols, wildcardDomains } = importedSharedNames();
const packageInternalReferences = symbolsReferencedInsidePackage();
const unusedSharedExports = [...sharedExports]
  .filter(([symbol, domain]) =>
    !importedSymbols.has(symbol) &&
    !packageInternalReferences.has(symbol) &&
    !wildcardDomains.has('*') &&
    !wildcardDomains.has(domain))
  .map(([symbol]) => symbol)
  .sort();
const localeCoverage = Object.fromEntries(
  ['en', 'es', 'pt'].map((locale) => {
    const keys = localeErrorKeys(locale);
    return [locale, {
      translated: errorCodes.filter((code) => keys.has(code)).length,
      missing: errorCodes.filter((code) => !keys.has(code)),
    }];
  }),
);
const rawRuntimeLiterals = rawRuntimeContractLiterals();
const unexpectedRawRuntimeLiterals = rawRuntimeLiterals.filter((item) => !item.reason);
const intentionalRawRuntimeLiterals = rawRuntimeLiterals.filter((item) => item.reason);

const crossRepo = findCrossRepoRisks();
const verbose = process.argv.includes('--verbose');
const report = {
  summary: {
    sharedErrorCodes: errorCodes.length,
    apiReferencedErrorCodes: apiErrorReferences.size,
    clientExplicitlyHandledErrorCodes: clientErrorReferences.size,
    crossRepoRisks: crossRepo.risks.length,
    intentionalBoundaries: crossRepo.intentional.length,
    pendingConsumerAdoption: crossRepo.pending.length,
    resolvedConsumerAdoption: crossRepo.resolved.length,
    resolvedBoundaries: crossRepo.resolvedBoundaries.length,
    unusedSharedExports: unusedSharedExports.length,
    localeCoverage: Object.fromEntries(
      Object.entries(localeCoverage).map(([locale, coverage]) => [locale, coverage.translated]),
    ),
    rawRuntimeLiterals: unexpectedRawRuntimeLiterals.length,
    intentionalRawRuntimeLiterals: intentionalRawRuntimeLiterals.length,
  },
  errorCodes: {
    unknownApiErrorReferences,
    unknownClientErrorReferences,
    apiUnusedErrorCodes,
    literalErrorCodes,
    intentionalLiteralErrorCodes,
  },
  crossRepo: verbose
    ? crossRepo
    : {
        risks: crossRepo.risks,
        intentionalCount: crossRepo.intentional.length,
        // La deuda se imprime SIEMPRE: es lo que hay que llevarle al repo consumidor.
        pending: crossRepo.pending.map(({ fix, left }) => ({ fix, declaredIn: `${left.side}:${left.file}` })),
        resolved: crossRepo.resolved,
        // Se imprime SIEMPRE, igual que `resolved`: son excusas que ya no excusan nada
        // y que hay que borrar del mapa.
        resolvedBoundaries: crossRepo.resolvedBoundaries,
      },
  unusedSharedExports,
  localeCoverage,
  rawRuntimeLiterals: unexpectedRawRuntimeLiterals,
  ...(verbose ? { intentionalRawRuntimeLiterals } : {}),
};

console.log(JSON.stringify(report, null, 2));

if (
  unknownApiErrorReferences.length ||
  unknownClientErrorReferences.length ||
  apiUnusedErrorCodes.length ||
  literalErrorCodes.length ||
  crossRepo.risks.length ||
  // Una frontera intencional que ya no matchea nada es una excusa en blanco: la clave
  // no lleva lado ni firma, así que sigue tapando cualquier declaración futura con ese
  // nombre. Es más estricto que `resolvedConsumerAdoption` —que sólo informa— a
  // propósito: aquella significa "un consumidor adoptó el contrato", que es una buena
  // noticia con tarea de limpieza; ésta significa "hay un agujero de cobertura puesto
  // a mano y nadie lo sabe".
  crossRepo.resolvedBoundaries.length ||
  unusedSharedExports.length ||
  unexpectedRawRuntimeLiterals.length ||
  Object.values(localeCoverage).some((coverage) => coverage.missing.length)
) {
  process.exitCode = 1;
}
