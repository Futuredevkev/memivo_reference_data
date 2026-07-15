const { readFileSync, readdirSync } = require('node:fs');
const { dirname, join, relative, resolve } = require('node:path');
const ts = require('typescript');

const packageRoot = resolve(__dirname, '..');
const workspaceRoot = dirname(packageRoot);
const roots = {
  api: resolve(workspaceRoot, 'memivo_api', 'src'),
  client: resolve(workspaceRoot, 'memivo_client', 'src'),
};
const httpDecorators = new Set(['Get', 'Post', 'Put', 'Patch', 'Delete']);
const axiosMethods = new Set(['get', 'post', 'put', 'patch', 'delete']);

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

function parse(path) {
  const text = readFileSync(path, 'utf8');
  return ts.createSourceFile(
    path,
    text,
    ts.ScriptTarget.Latest,
    true,
    path.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
}

function location(source, node, root) {
  const point = source.getLineAndCharacterOfPosition(node.getStart(source));
  return `${relative(root, source.fileName)}:${point.line + 1}`;
}

function decoratorsOf(node) {
  return ts.canHaveDecorators(node) ? (ts.getDecorators(node) ?? []) : [];
}

function decoratorName(decorator) {
  const expression = decorator.expression;
  if (ts.isIdentifier(expression)) return expression.text;
  if (ts.isCallExpression(expression) && ts.isIdentifier(expression.expression)) {
    return expression.expression.text;
  }
  return '';
}

function isApiCall(node) {
  if (!ts.isCallExpression(node) || !ts.isPropertyAccessExpression(node.expression)) return false;
  return ts.isIdentifier(node.expression.expression)
    && node.expression.expression.text === 'api'
    && axiosMethods.has(node.expression.name.text);
}

function unwrapExpression(node) {
  while (
    node
    && (ts.isParenthesizedExpression(node)
      || ts.isAsExpression(node)
      || ts.isTypeAssertionExpression(node)
      || ts.isSatisfiesExpression(node))
  ) node = node.expression;
  return node;
}

function isSocketEmitter(node, source) {
  if (!ts.isPropertyAccessExpression(node.expression)) return false;
  const receiver = node.expression.expression.getText(source);
  return /(?:^|\.)(?:server|client|socket)(?:\.|$)/i.test(receiver);
}

function auditClient() {
  const missingAxiosResponseType = [];
  const inlineAxiosResponseType = [];
  const inlineAxiosRequestPayload = [];
  const inlineAxiosQueryParams = [];
  const inlineSocketPayload = [];
  for (const file of walk(roots.client)) {
    const source = parse(file);
    const visit = (node) => {
      if (isApiCall(node)) {
        if (!node.typeArguments?.length) {
          missingAxiosResponseType.push(location(source, node, roots.client));
        } else if (ts.isTypeLiteralNode(node.typeArguments[0])) {
          inlineAxiosResponseType.push(location(source, node, roots.client));
        }
        const method = node.expression.name.text;
        const body = node.arguments[1] && unwrapExpression(node.arguments[1]);
        if (
          ['post', 'put', 'patch'].includes(method)
          && body
          && ts.isObjectLiteralExpression(body)
        ) {
          inlineAxiosRequestPayload.push(location(source, node, roots.client));
        }
        if (method === 'delete' && body && ts.isObjectLiteralExpression(body)) {
          const dataProperty = body.properties.find((property) => (
            ts.isPropertyAssignment(property)
            && property.name.getText(source).replace(/^['"]|['"]$/g, '') === 'data'
          ));
          if (
            dataProperty
            && ts.isPropertyAssignment(dataProperty)
            && ts.isObjectLiteralExpression(unwrapExpression(dataProperty.initializer))
          ) {
            inlineAxiosRequestPayload.push(location(source, node, roots.client));
          }
        }
        for (const argument of node.arguments) {
          const config = unwrapExpression(argument);
          if (!ts.isObjectLiteralExpression(config)) continue;
          const paramsProperty = config.properties.find((property) => (
            ts.isPropertyAssignment(property)
            && property.name.getText(source).replace(/^['"]|['"]$/g, '') === 'params'
          ));
          if (
            paramsProperty
            && ts.isPropertyAssignment(paramsProperty)
            && ts.isObjectLiteralExpression(unwrapExpression(paramsProperty.initializer))
          ) {
            inlineAxiosQueryParams.push(location(source, node, roots.client));
          }
        }
      }
      if (
        ts.isCallExpression(node)
        && ts.isPropertyAccessExpression(node.expression)
        && node.expression.name.text === 'emit'
        && isSocketEmitter(node, source)
        && node.arguments.slice(1).some((argument) => ts.isObjectLiteralExpression(unwrapExpression(argument)))
      ) {
        inlineSocketPayload.push(location(source, node, roots.client));
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  return {
    missingAxiosResponseType,
    inlineAxiosResponseType,
    inlineAxiosRequestPayload,
    inlineAxiosQueryParams,
    inlineSocketPayload,
  };
}

function auditApi() {
  const missingControllerReturnType = [];
  const inlineControllerReturnType = [];
  const missingSocketHandlerReturnType = [];
  const inlineSocketHandlerReturnType = [];
  const inlineSocketPayload = [];
  for (const file of walk(roots.api)) {
    const source = parse(file);
    const isController = file.endsWith('.controller.ts');
    const visit = (node) => {
      if (isController && ts.isMethodDeclaration(node)) {
        const isEndpoint = decoratorsOf(node).some((decorator) => (
          httpDecorators.has(decoratorName(decorator))
        ));
        if (isEndpoint && !node.type) {
          missingControllerReturnType.push(location(source, node, roots.api));
        } else if (isEndpoint && node.type) {
          const returnType = ts.isTypeReferenceNode(node.type)
            && node.type.typeArguments?.length === 1
            ? node.type.typeArguments[0]
            : node.type;
          if (returnType && ts.isTypeLiteralNode(returnType)) {
            inlineControllerReturnType.push(location(source, node, roots.api));
          }
        }
      }
      if (ts.isMethodDeclaration(node)) {
        const isSocketHandler = decoratorsOf(node).some((decorator) => (
          decoratorName(decorator) === 'SubscribeMessage'
        ));
        if (isSocketHandler && !node.type) {
          missingSocketHandlerReturnType.push(location(source, node, roots.api));
        } else if (isSocketHandler && node.type) {
          const returnType = ts.isTypeReferenceNode(node.type)
            && node.type.typeArguments?.length === 1
            ? node.type.typeArguments[0]
            : node.type;
          if (returnType && ts.isTypeLiteralNode(returnType)) {
            inlineSocketHandlerReturnType.push(location(source, node, roots.api));
          }
        }
      }
      if (
        ts.isCallExpression(node)
        && ts.isPropertyAccessExpression(node.expression)
        && node.expression.name.text === 'emit'
        && isSocketEmitter(node, source)
        && node.arguments.slice(1).some((argument) => ts.isObjectLiteralExpression(unwrapExpression(argument)))
      ) {
        inlineSocketPayload.push(location(source, node, roots.api));
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  return {
    missingControllerReturnType,
    inlineControllerReturnType,
    missingSocketHandlerReturnType,
    inlineSocketHandlerReturnType,
    inlineSocketPayload,
  };
}

const report = { client: auditClient(), api: auditApi() };
const summary = Object.fromEntries(
  Object.entries(report).flatMap(([side, groups]) => (
    Object.entries(groups).map(([name, values]) => [`${side}.${name}`, values.length])
  )),
);
console.log(JSON.stringify({ summary, ...report }, null, 2));
process.exitCode = Object.values(summary).some((count) => count > 0) ? 1 : 0;
