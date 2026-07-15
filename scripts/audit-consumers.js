const { readFileSync, readdirSync } = require('node:fs');
const { basename, dirname, join, relative, resolve } = require('node:path');
const ts = require('typescript');

const packageRoot = resolve(__dirname, '..');
const workspaceRoot = dirname(packageRoot);
const roots = {
  api: resolve(workspaceRoot, 'memivo_api', 'src'),
  client: resolve(workspaceRoot, 'memivo_client', 'src'),
};

const intentionalBoundaries = new Map([
  ['class:Album', 'Server ORM entity and normalized client model are different layers.'],
  ['class:Role', 'Server ORM entity; the public wire subset is shared as UserRole.'],
  ['class:User', 'Server ORM entity with persistence-only secrets and relations; the public and authenticated wire subsets are shared as PublicUserResponse and UserResponse.'],
  ['class:ChatGroup', 'Server ORM entity and normalized client model are different layers.'],
  ['class:ChatMember', 'Server ORM entity and normalized client model are different layers.'],
  ['class:ChatMessage', 'Server ORM entity and normalized client model are different layers.'],
  ['class:Folder', 'Server ORM entity and normalized client model are different layers.'],
  ['class:Notification', 'Server ORM entity and transport model have different timestamps and relations.'],
  ['class:PollOption', 'Server ORM entity and normalized client model are different layers.'],
  ['class:PollVote', 'Server ORM entity and normalized client model are different layers.'],
  ['class:Poll', 'Server ORM entity and normalized client model are different layers.'],
  ['class:GuestPost', 'Server ORM entity and normalized client model are different layers.'],
  ['class:PhotoTag', 'Server ORM entity and normalized client model are different layers.'],
  ['class:Photo', 'Server ORM entity and normalized client model are different layers.'],
  ['const:SENTRY_IGNORED_HTTP_STATUS', 'Configuración operativa independiente por runtime.'],
  ['const:SENTRY_PROFILES_SAMPLE_RATE_DEFAULT', 'Configuración operativa independiente por runtime.'],
  ['const:SENTRY_TRACES_SAMPLE_RATE_DEFAULT', 'Configuración operativa independiente por runtime.'],
  ['type:CloudinaryTransformResourceType', 'Unión primitiva local; no representa el mismo contrato de dominio que los tipos visuales.'],
  ['const:SENSITIVE_KEYS', 'Cada runtime redacta superficies y credenciales diferentes.'],
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

function declarations(side) {
  const output = [];
  for (const file of walk(roots[side])) {
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
              file: relative(roots[side], file),
            });
          }
        }
        continue;
      }
      if (kind && name && signature !== undefined) {
        if (isSharedBacked(statement)) continue;
        output.push({ side, kind, name, signature, file: relative(roots[side], file) });
      }
    }
  }
  return output;
}

function findCrossRepoRisks() {
  const api = declarations('api');
  const client = declarations('client');
  const risks = [];
  const intentional = [];

  for (const left of api) {
    for (const right of client) {
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
      const substantial = Array.isArray(left.signature)
        ? left.signature.length >= 2
        : typeof left.signature === 'object' || String(left.signature).length >= 6;
      if (!sameName && !(sameSignature && substantial) && !dtoCandidate) continue;

      const item = { sameName, sameSignature, dtoCandidate, api: left, client: right };
      const boundary = intentionalBoundaries.get(`${left.kind}:${left.name}`);
      if (boundary) intentional.push({ ...item, reason: boundary });
      else risks.push(item);
    }
  }
  return { risks, intentional };
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
  const symbols = new Set();
  for (const file of walk(resolve(packageRoot, 'src'))) {
    const { source } = sourceFile(file);
    if (basename(file) === 'index.ts') continue;
    // `internal/` holds private building blocks that no domain barrel re-exports;
    // they are exported only for sibling imports, so they are not public surface.
    if (/[\\/]internal[\\/]/.test(file)) continue;
    for (const statement of source.statements) {
      if (!statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) continue;
      if (
        ts.isEnumDeclaration(statement) ||
        ts.isInterfaceDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement) ||
        ts.isFunctionDeclaration(statement) ||
        ts.isClassDeclaration(statement)
      ) {
        if (statement.name) symbols.add(statement.name.text);
      } else if (ts.isVariableStatement(statement)) {
        for (const declaration of statement.declarationList.declarations) {
          if (ts.isIdentifier(declaration.name)) symbols.add(declaration.name.text);
        }
      }
    }
  }
  return [...symbols].sort();
}

function localeErrorKeys(locale) {
  const file = resolve(roots.client, 'i18n', 'locales', `${locale}.ts`);
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

const allConsumerText = `${combinedText('api')}\n${clientText}`;
const unusedSharedExports = exportedSharedSymbols().filter((symbol) => {
  const matches = allConsumerText.match(new RegExp(`\\b${symbol}\\b`, 'g'));
  return !matches;
});
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
    : { risks: crossRepo.risks, intentionalCount: crossRepo.intentional.length },
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
  unusedSharedExports.length ||
  unexpectedRawRuntimeLiterals.length ||
  Object.values(localeCoverage).some((coverage) => coverage.missing.length)
) {
  process.exitCode = 1;
}
