const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { mkdtempSync, mkdirSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { dirname, resolve, join } = require('node:path');

/**
 * TESTS DEL AUDITOR DE CAMPOS DE RESPUESTA, NO DE LOS CAMPOS.
 *
 * ── EL DEFECTO QUE CIERRA ─────────────────────────────────────────────────
 * N-643 midió que cuatro de los seis auditores cross-repo del paquete corren
 * sin un solo arnés, y que **dos de los tres que más veces frenaron una
 * publicación** son de ésos. Éste es uno de los dos, y además es el que la
 * ventana del 31 de agosto al 1 de septiembre TOCÓ (commit `5d7a400`), así que
 * no es otro frente: es un archivo que esta pasada ya abre.
 *
 * Lo que un auditor sin arnés no puede contestar es la única pregunta que
 * importa de un auditor: **¿sigue enganchando?** Un reconocedor que dejó de
 * ver el árbol contesta CERO desvíos, que es exactamente lo que contesta uno
 * que está limpio. Sin un caso que lo ponga rojo, el verde no significa nada.
 *
 * ── LO QUE HUBO QUE ABRIR PARA PODER PROBARLO, y por qué es correcto ──────
 * El auditor tenía UNA costura de entorno (`MEMIVO_AUDIT_CLIENT_SRC`) y su
 * universo se siembra desde las OTRAS DOS raíces: el contrato y los handlers
 * del API. Sin poder plantar esos dos árboles, la única forma de provocar un
 * hallazgo era tener un campo muerto de verdad en el paquete.
 *
 * Se le agregaron `MEMIVO_AUDIT_PACKAGE_SRC` y `MEMIVO_AUDIT_API_SRC`, con los
 * NOMBRES que `audit-endpoints.js` ya usaba: un solo vocabulario para toda la
 * familia, en vez de tres convenciones según quién escribió cada auditor.
 *
 * ── POR QUÉ SE LEE EL MENSAJE Y NO EL EXIT CODE ──────────────────────────
 * Es la misma trampa que documenta el arnés de `audit-endpoints.js`: sobre un
 * paquete sintético, la tabla real de `INTENTIONAL_WITHOUT_READER` habla de
 * campos que no existen, así que el auditor sale 1 por `phantomExcuses` en
 * TODOS estos casos —incluidos los que afirman que NO encontró un huérfano—.
 * Lo que separa un caso del otro es **qué rama habló**.
 *
 * ── LO QUE NO MIDE, DICHO (ORDEN §10) ────────────────────────────────────
 * · **No mide la tabla de excusas real.** Que cada entrada de
 *   `INTENTIONAL_WITHOUT_READER` siga correspondiendo a un campo vivo lo
 *   contesta el auditor corriendo sobre el árbol de verdad, que es su trabajo.
 * · **No mide el cierre transitivo completo** — un nivel de anidamiento, que es
 *   el que distingue «alcanza lo anidado» de «no alcanza». Más niveles serían
 *   el mismo caso escrito más largo.
 * · **No mide los payloads de socket emitidos sin `@SubscribeMessage`**: el
 *   propio auditor declara que no los ve, y un test que lo comprobara estaría
 *   congelando un hueco en vez de una conducta.
 */
const auditor = resolve(__dirname, '..', 'scripts', 'audit-response-fields.js');

/** Corre el auditor sobre tres árboles sintéticos y devuelve lo que reportó. */
function runAudit({ packageFiles = {}, clientFiles = {}, apiFiles = {} }) {
  const workspace = mkdtempSync(join(tmpdir(), 'memivo-response-fields-'));
  const roots = {
    package: join(workspace, 'contracts'),
    client: join(workspace, 'client'),
    api: join(workspace, 'api'),
  };

  for (const [clave, archivos] of [
    ['package', packageFiles],
    ['client', clientFiles],
    ['api', apiFiles],
  ]) {
    mkdirSync(roots[clave], { recursive: true });
    for (const [nombre, contenido] of Object.entries(archivos)) {
      const destino = join(roots[clave], nombre);
      mkdirSync(dirname(destino), { recursive: true });
      writeFileSync(destino, contenido, 'utf8');
    }
  }

  const run = spawnSync(process.execPath, [auditor, '--verbose'], {
    encoding: 'utf8',
    env: {
      ...process.env,
      MEMIVO_AUDIT_PACKAGE_SRC: roots.package,
      MEMIVO_AUDIT_CLIENT_SRC: roots.client,
      MEMIVO_AUDIT_API_SRC: roots.api,
    },
  });

  return { salida: run.stdout, error: run.stderr, code: run.status };
}

/**
 * Los huérfanos que el auditor nombró, leídos de la lista de `--verbose`.
 *
 * ⚠️ **Y NO del stderr, aunque ahí es donde el auditor los grita en la vida
 * real.** Sobre un paquete sintético, la rama de `phantomExcuses` habla primero
 * y hace `process.exit(1)`, así que la lista de huérfanos del stderr **nunca se
 * imprime**. La de `--verbose` sale antes de cualquier salida, y es la misma
 * lista.
 *
 * Es un detalle del auditor que vale escribir: quien lo corra sobre el árbol de
 * verdad teniendo a la vez una excusa fantasma y campos muertos **sólo va a ver
 * las excusas**; los muertos aparecen recién en la corrida siguiente, o ahora
 * mismo con `--verbose`.
 */
const huerfanos = (reporte) =>
  reporte.salida
    .split('\n')
    .filter((linea) => linea.trimStart().startsWith('·'))
    .map((linea) => linea.trim().replace(/^·\s*/, '').split(' (')[0]);

test('CONTROL POSITIVO: un campo de respuesta que nadie lee se reporta', () => {
  const reporte = runAudit({
    packageFiles: {
      'album/album-detail-response.interface.ts':
        'export interface AlbumDetailResponse { titulo: string; nadieMeLee: number; }',
    },
    clientFiles: {
      'AlbumScreen.tsx': 'const x = album.titulo;',
    },
  });

  assert.deepEqual(huerfanos(reporte), ['AlbumDetailResponse.nadieMeLee']);
});

test('un campo que el cliente SÍ lee no se reporta', () => {
  const reporte = runAudit({
    packageFiles: {
      'album/album-detail-response.interface.ts':
        'export interface AlbumDetailResponse { titulo: string; siMeLeen: number; }',
    },
    clientFiles: {
      'AlbumScreen.tsx': 'const a = album.titulo; const b = album.siMeLeen;',
    },
  });

  assert.deepEqual(huerfanos(reporte), []);
});

/**
 * LA SEMILLA POR CONDUCTA, que es la mitad que el auditor ganó después y la
 * que su docblock declara haber verificado rompiéndola.
 *
 * `SaldoDeCosas` no termina en ninguno de los siete sufijos, así que la red de
 * atrás no lo alcanza: si este caso se pone verde sin el reporte, la siembra
 * por handler dejó de funcionar y el auditor volvió a mirar sólo los nombres.
 */
test('un tipo SIN sufijo de respuesta se audita igual si un handler lo devuelve', () => {
  const reporte = runAudit({
    packageFiles: {
      'saldo/saldo-de-cosas.interface.ts':
        'export interface SaldoDeCosas { total: number; nadieMeLee: number; }',
    },
    clientFiles: { 'Pantalla.tsx': 'const t = saldo.total;' },
    apiFiles: {
      'saldo/saldo.controller.ts': [
        "import { SaldoDeCosas } from '@memivo/contracts';",
        'export class SaldoController {',
        "  @Get('saldo')",
        '  async traer(): Promise<SaldoDeCosas> {',
        '    return this.service.traer();',
        '  }',
        '}',
      ].join('\n'),
    },
  });

  assert.deepEqual(huerfanos(reporte), ['SaldoDeCosas.nadieMeLee']);
});

/**
 * CONTROL DEL CASO DE ARRIBA: sin el handler, ese mismo tipo es INVISIBLE.
 *
 * Sin esto, el caso anterior podría estar verde porque el auditor audita todo
 * lo que encuentra, y entonces no probaría nada sobre la siembra por conducta.
 */
test('CONTROL: el mismo tipo sin handler que lo devuelva NO se audita', () => {
  const reporte = runAudit({
    packageFiles: {
      'saldo/saldo-de-cosas.interface.ts':
        'export interface SaldoDeCosas { total: number; nadieMeLee: number; }',
    },
    clientFiles: { 'Pantalla.tsx': 'const t = saldo.total;' },
  });

  assert.deepEqual(huerfanos(reporte), []);
});

/**
 * EL CIERRE TRANSITIVO: un campo no es menos muerto por viajar anidado, y la
 * forma anidada es donde más se acumula — la primera versión del auditor era
 * ciega sobre 83 tipos alcanzables por ahí.
 */
test('los campos de un tipo ANIDADO en una respuesta también se auditan', () => {
  const reporte = runAudit({
    packageFiles: {
      'album/album-detail-response.interface.ts': [
        "import { Invitado } from './invitado.interface';",
        'export interface AlbumDetailResponse { invitados: Invitado[]; }',
      ].join('\n'),
      'album/invitado.interface.ts':
        'export interface Invitado { nombre: string; nadieMeLee: number; }',
    },
    clientFiles: {
      'AlbumScreen.tsx': 'const n = invitado.nombre; const i = album.invitados;',
    },
  });

  assert.deepEqual(huerfanos(reporte), ['Invitado.nadieMeLee']);
});

/**
 * LOS `*Request` QUEDAN AFUERA aunque se los alcance: sus campos los lee el
 * API, no la app. Exigirles un lector en el cliente sería pedir lo contrario de
 * lo que son.
 */
test('un `*Request` alcanzable NO se audita: sus campos los lee el API', () => {
  const reporte = runAudit({
    packageFiles: {
      'album/crear-album-request.interface.ts':
        'export interface CrearAlbumRequest { titulo: string; nadieMeLee: number; }',
    },
    clientFiles: { 'AlbumScreen.tsx': 'const t = body.titulo;' },
    apiFiles: {
      'album/album.controller.ts': [
        "import { CrearAlbumRequest } from '@memivo/contracts';",
        'export class AlbumController {',
        "  @Post('album')",
        '  async crear(): Promise<CrearAlbumRequest> {',
        '    return this.service.crear();',
        '  }',
        '}',
      ].join('\n'),
    },
  });

  assert.deepEqual(huerfanos(reporte), []);
});

/**
 * 🚨 EL SELECTOR ES PERMISIVO A PROPÓSITO, y congelarlo es el punto de este
 * caso.
 *
 * Basta con que el NOMBRE aparezca en el cliente, aunque sea sobre otro tipo.
 * La asimetría está escrita en el docblock del auditor y es su decisión de
 * diseño: un falso negativo deja un campo muerto un tiempo más; un falso
 * positivo hace que alguien borre un campo que la app SÍ lee, y eso es una
 * pantalla rota.
 *
 * Sin este caso, alguien que "endurezca" el selector creería estar arreglando
 * un hueco cuando está cambiando la política. El límite que esto cuesta —los
 * campos de nombre común como `roles` o `userId`— también está escrito allá.
 */
test('POLÍTICA: el nombre escrito sobre OTRO tipo alcanza para darlo por vivo', () => {
  const reporte = runAudit({
    packageFiles: {
      'album/album-detail-response.interface.ts':
        'export interface AlbumDetailResponse { position: number; }',
    },
    clientFiles: {
      // `position` acá es de un estilo, no del álbum. El auditor lo da por
      // leído igual, y eso es la política, no un defecto.
      'Estilos.ts': "export const s = { position: 'absolute' };",
    },
  });

  assert.deepEqual(huerfanos(reporte), []);
});

/**
 * CONTROL DEL INSTRUMENTO: el arnés planta árboles que el auditor realmente
 * lee.
 *
 * Sin esto, un `MEMIVO_AUDIT_PACKAGE_SRC` mal escrito dejaría al auditor
 * mirando CERO tipos, y todos los casos que afirman «no reportó nada» pasarían
 * sobre la nada.
 */
test('CONTROL: el auditor ve el paquete sintético y lo dice', () => {
  const reporte = runAudit({
    packageFiles: {
      'album/album-detail-response.interface.ts':
        'export interface AlbumDetailResponse { titulo: string; }',
    },
    clientFiles: { 'AlbumScreen.tsx': 'const x = album.titulo;' },
  });

  assert.match(reporte.salida, /1 tipos alcanzables desde una respuesta/);
});
