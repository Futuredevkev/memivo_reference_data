const test = require('node:test');
const assert = require('node:assert/strict');
const { resolve } = require('node:path');
const ts = require('typescript');

/**
 * `messageIndex` elige uno de los copies motivacionales dentro del API, pero el
 * productor lo quita antes de serializar la push y DAILY_MOTIVATIONAL no deja
 * fila en la campanita. Por eso no es metadata de transporte y no pertenece al
 * mapa compartido: si entra ahí, `NotificationMetadataView` lo publica al
 * cliente aunque ningún payload lo lleve.
 *
 * El checker de TypeScript es el oráculo de este test. Así se prueba la forma
 * resuelta del contrato (no el texto o el nombre del archivo): la rama diaria
 * no admite metadata y la vista tolerante del cliente no adquiere el campo.
 */

const ROOT = resolve(__dirname, '..');
const configPath = resolve(ROOT, 'tsconfig.json');
const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
assert.equal(configFile.error, undefined);

const config = ts.parseJsonConfigFileContent(configFile.config, ts.sys, ROOT);
const program = ts.createProgram(config.fileNames, config.options);
const checker = program.getTypeChecker();

const declaredType = (relativePath, declarationName) => {
  const source = program.getSourceFile(resolve(ROOT, relativePath));
  assert.ok(source, `TypeScript no cargó ${relativePath}`);

  const declaration = source.statements.find(
    (statement) =>
      ts.isTypeAliasDeclaration(statement) &&
      statement.name.text === declarationName,
  );
  assert.ok(declaration, `no existe el alias ${declarationName}`);

  const symbol = checker.getSymbolAtLocation(declaration.name);
  assert.ok(symbol, `TypeScript no resolvió ${declarationName}`);
  return checker.getDeclaredTypeOfSymbol(symbol);
};

test('DAILY_MOTIVATIONAL no admite metadata en el contrato de transporte', () => {
  const byType = declaredType(
    'src/notifications/interfaces/notification-metadata-by-type.type.ts',
    'NotificationMetadataByType',
  );
  const daily = checker.getPropertyOfType(byType, 'DAILY_MOTIVATIONAL');
  assert.ok(daily, 'falta la rama total DAILY_MOTIVATIONAL');

  const metadata = checker.getTypeOfSymbolAtLocation(
    daily,
    daily.valueDeclaration ?? daily.declarations[0],
  );
  assert.ok(
    metadata.flags & ts.TypeFlags.Never,
    `DAILY_MOTIVATIONAL volvió a publicar ${checker.typeToString(metadata)}`,
  );
});

test('NotificationMetadataView no expone el input privado messageIndex', () => {
  const view = declaredType(
    'src/notifications/interfaces/notification-metadata-view.type.ts',
    'NotificationMetadataView',
  );

  assert.equal(checker.getPropertyOfType(view, 'messageIndex'), undefined);
});
