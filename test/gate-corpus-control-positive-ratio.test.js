const test = require('node:test');
const assert = require('node:assert/strict');
const {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} = require('node:fs');
const { tmpdir } = require('node:os');
const { join, relative, resolve, sep } = require('node:path');

/**
 * CUÁNTOS GATES VERIFICAN QUE SU DETECTOR ENGANCHA, Y ESE NÚMERO SÓLO BAJA.
 *
 * ── EL DEFECTO QUE CIERRA ─────────────────────────────────────────────────
 * La revisión de cierre publicó que **el 72 % de los gates verifica que su
 * detector engancha**, y esa cifra es la que sostiene la frase «los cuatro
 * `quality` en verde significan algo». Medía otra cosa.
 *
 * Bajo la definición que hace falta —un ofensor sintético, o un caso que narra
 * un rechazo— el número real era **32 %**, no 72 %. El 72 % medía el PISO
 * ANTI-VACÍO, que es otra garantía: prueba que el scanner no corrió sobre el
 * vacío, no que atrape nada. Son 2,3× de diferencia entre dos cosas que se
 * llamaban igual.
 *
 * Y la lección de método, que vale más: **el instrumento que produjo el 72 %
 * vivía en un scratchpad**, así que nadie pudo auditar qué medía hasta que otro
 * lo reescribió desde cero. Por eso esto es un archivo del árbol.
 *
 * ── POR QUÉ UNA ETIQUETA Y NO INFERENCIA DEL TEXTO ───────────────────────
 * Porque inferir da **32 % o 75 % según el vocabulario que cubras**, y esa
 * inestabilidad es inaceptable en un instrumento que sostiene una recomendación.
 * El carril que lo midió se probó a sí mismo: su primera pasada perdió un gate
 * que SÍ tiene control positivo real, por buscar sólo vocabulario inglés.
 *
 * Así que la propiedad se AUTODECLARA y acá se verifica, que es el patrón que
 * este repo ya tiene con la etiqueta de gemelo:
 *
 *     (at)control-positivo en este archivo: el reconocedor engancha
 *     (at)control-positivo memivo_api/tests/fixtures/ofensor-de-barrel.ts
 *     (at)control-positivo ninguno — mide una constante publicada
 *
 * **No declarar cuenta como no tenerlo.** Igual que un gemelo roto.
 *
 * ── POR QUÉ EL TOPE ARRANCA EN 100 % Y NO EN EL 68 % QUE SE DISEÑÓ ───────
 * El diseño original lo ponía en 68 % —el complemento del 32 % medido—. Eso
 * exige que **144 gates ya estén etiquetados** el día que el archivo entra, y
 * hoy no hay ninguno: la etiqueta nace con este archivo. Arrancar en 68 %
 * habría dejado el gate ROJO desde el primer commit, y la salida barata de un
 * gate rojo que nadie puede poner en verde es apagarlo.
 *
 * Arranca entonces en el número que hoy es VERDAD, y baja con cada tanda de
 * etiquetado. La propiedad que importa —que no pueda empeorar— la da el
 * trinquete, no el valor inicial. Y hay dos reglas con dientes desde el minuto
 * cero: **toda etiqueta escrita tiene que ser verificable**, así que ninguna
 * puede podrirse mientras el porcentaje baja; y **el tope no puede quedar por
 * encima de lo medido**, así que apenas alguien etiqueta, el techo lo sigue.
 *
 * ── ALCANCE DECLARADO (ORDEN §10) ────────────────────────────────────────
 * · El corpus son las carpetas de gates de los CUATRO repos, declaradas abajo.
 *   No es «todo archivo de test»: son 1.644, y la mayoría prueba una función,
 *   no una propiedad del árbol.
 * · Mide DECLARACIÓN, no calidad. Una etiqueta que apunta a un caso flojo cuenta
 *   igual. Lo que este archivo puede afirmar es que alguien se hizo la pregunta
 *   y dejó dónde mirar — y que lo que dejó escrito sigue existiendo.
 * · No se degrada en silencio: si los repos hermanos no están, CORTA.
 *
 * @control-positivo en este archivo: el reconocedor engancha: sobre un repo sintético contesta 67 %
 */

const ROOT = resolve(__dirname, '..', '..');

/**
 * El corpus, declarado. Cada entrada es una carpeta de gates y el patrón de sus
 * archivos, porque los cuatro repos no usan el mismo sufijo ni la misma forma
 * de separar un gate de un test común.
 */
const CORPUS = [
  { repo: 'memivo_api', dir: 'tests', patron: /\.spec\.tsx?$/, soloSi: /(^|\/)config(\/|$)/ },
  { repo: 'memivo_client', dir: 'tests', patron: /\.test\.tsx?$/, soloSi: /(^|\/)config(\/|$)/ },
  { repo: 'memivo_landing', dir: 'test', patron: /\.test\.js$/, soloSi: null },
  { repo: 'memivo-reference-data', dir: 'test', patron: /\.test\.js$/, soloSi: null },
];

/**
 * El porcentaje de gates SIN control positivo válido. **Sólo puede BAJAR.**
 *
 * Subirlo es agregar gates sin hacerse la pregunta, y eso es exactamente lo que
 * el 72 % tapaba. Bajarlo es una decisión escrita en el diff.
 *
 * Historia, para que se vea el movimiento y no sólo el valor:
 *   · 31 ago 2026 — nace en 99 %: la etiqueta se inventa con este archivo.
 */
const TOPE_PORCENTAJE_SIN_CONTROL_POSITIVO = 99;

/**
 * La etiqueta.
 *
 * Se ARMA por pedazos en vez de escribirse como literal por un motivo concreto:
 * este archivo también está en el corpus, así que un literal haría que el censo
 * se leyera a sí mismo y capturara el resto del renglón como si fuera una
 * declaración. Y va con `String.raw` porque la forma con `\\s` se perdió un
 * backslash al escribirse y el reconocedor quedó buscando `positivos+` —un gate
 * que no engancha nada, que es justo lo que este archivo mide—.
 */
const ETIQUETA = new RegExp(['@control', '-positivo', String.raw`\s+([^\n*]+)`].join(''));

const clave = (absoluto) => relative(ROOT, absoluto).split(sep).join('/');

/** Los archivos de gate de una entrada del corpus, o `null` si el repo no está. */
const archivosDeGates = ({ repo, dir, patron, soloSi }) => {
  const raiz = join(ROOT, repo, dir);
  if (!existsSync(raiz)) return null;

  const out = [];
  const walk = (carpeta) => {
    for (const entry of readdirSync(carpeta, { withFileTypes: true })) {
      const full = join(carpeta, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules') continue;
        walk(full);
      } else if (patron.test(entry.name)) {
        const relativa = relative(raiz, full).split(sep).join('/');
        if (!soloSi || soloSi.test(relativa)) out.push(full);
      }
    }
  };
  walk(raiz);
  out.sort();
  return out;
};

/**
 * ¿Esta etiqueta es verificable, y verifica? Devuelve `null` si está bien, o el
 * motivo del rechazo.
 *
 * Es una función PURA sobre el texto, para que los casos de abajo la puedan
 * probar con valores fabricados: un validador que sólo se puede ejercitar
 * rompiendo el árbol se verifica una vez y nunca más.
 */
const motivoDeRechazo = (valor, fuente) => {
  const limpio = valor.trim().replace(/\s+/g, ' ');

  if (!limpio) return 'la etiqueta está vacía';

  if (/^ninguno\b/.test(limpio)) {
    const motivo = limpio.replace(/^ninguno\s*[—-]?\s*/, '');
    return motivo.length >= 10
      ? null
      : 'ninguno necesita un motivo de al menos diez caracteres, no una raya suelta';
  }

  const enEsteArchivo = /^en este archivo:\s*(.+)$/.exec(limpio);
  if (enEsteArchivo) {
    // Se busca en el archivo SIN sus renglones de etiqueta, y eso no es un
    // detalle: la etiqueta se cita a sí misma, así que buscar en el texto
    // completo acierta SIEMPRE. Medido — con la etiqueta apuntando a un caso
    // inventado el gate quedaba verde, o sea que la regla era una tautología.
    // Es la misma clase que este archivo entero persigue, y apareció acá por
    // verificarlo rompiéndolo.
    const sinLaEtiqueta = fuente
      .split('\n')
      .filter((linea) => !ETIQUETA.test(linea))
      .join('\n');

    return sinLaEtiqueta.includes(enEsteArchivo[1])
      ? null
      : 'dice ' + enEsteArchivo[1] + ' y ese texto no aparece en ningún caso del archivo';
  }

  const destino = join(ROOT, ...limpio.split('/'));
  if (!existsSync(destino) || !statSync(destino).isFile()) {
    return 'apunta a ' + limpio + ', que no es un archivo del árbol';
  }

  return null;
};

/** Un `{ archivo, fuente, valor }` por cada gate del corpus. */
const censo = () => {
  const gates = [];
  for (const entrada of CORPUS) {
    const archivos = archivosDeGates(entrada);
    if (archivos === null) return null;
    for (const archivo of archivos) {
      const fuente = readFileSync(archivo, 'utf8');
      const match = ETIQUETA.exec(fuente);
      gates.push({ archivo: clave(archivo), fuente, valor: match ? match[1] : null });
    }
  }
  return gates;
};

/** ¿La etiqueta dice, honestamente, que este gate NO tiene control positivo? */
const declaraQueNoTiene = (valor) => valor !== null && /^\s*ninguno\b/.test(valor);

/**
 * Los que NO tienen control positivo. Son TRES clases y las tres cuentan igual
 * para el porcentaje, que es lo que hace honesto al número:
 *
 *  · los que no declaran nada,
 *  · los que declaran algo que no verifica —una ruta borrada, un caso renombrado—,
 *  · y los que declaran `ninguno` con su motivo.
 *
 * La tercera es la que se puede leer mal. `ninguno` es una declaración HONESTA y
 * el gate la premia en la regla de validez —no la trata como etiqueta rota— pero
 * **no la cuenta como tener control**: lo que este porcentaje mide es cuántos
 * gates verifican que su detector engancha, y uno que declara que no lo verifica
 * no lo verifica. Confundir «lo declaró» con «lo tiene» es exactamente el error
 * que produjo el 72 %.
 */
const sinControlPositivo = (gates) =>
  gates.filter(
    ({ fuente, valor }) =>
      valor === null || declaraQueNoTiene(valor) || motivoDeRechazo(valor, fuente) !== null,
  );

/**
 * El porcentaje, extraído como función pura para poder probarlo con números
 * fabricados. Redondea HACIA ARRIBA: con 449 de 450 sin etiqueta, redondear
 * hacia abajo daría 99 y dejaría pasar un gate sin declarar como si fuera
 * progreso.
 */
const porcentajeSinControl = (sinControl, total) =>
  total === 0 ? 0 : Math.ceil((sinControl / total) * 100);

test('el gate mide algo: los cuatro repos son hermanos y su corpus se lee', () => {
  // Sin este piso, un layout que no sea el de los cuatro hermanos haría que las
  // reglas de abajo corran sobre CERO gates: verde por no mirar, que es el modo
  // de falla que este archivo persigue.
  const ausentes = CORPUS.filter((entrada) => archivosDeGates(entrada) === null).map(
    ({ repo, dir }) => `${repo}/${dir}`,
  );

  assert.deepEqual(
    ausentes,
    [],
    'Este gate necesita a los cuatro repos como directorios HERMANOS. No se ' +
      'degrada en silencio: un gate cross-repo que no puede leer a los otros no ' +
      'está pasando, está ciego.',
  );

  assert.ok(
    censo().length > 400,
    'el corpus devolvió muy pocos gates: el sospechoso es el recorrido, no el árbol.',
  );
});

test('toda etiqueta escrita es verificable, y verifica', () => {
  // Esta regla tiene dientes desde el primer día, aunque el tope todavía no:
  // mientras el porcentaje baja tanda por tanda, ninguna etiqueta ya escrita
  // puede pudrirse sin que esto se ponga rojo.
  const rotas = censo()
    .filter(({ valor }) => valor !== null)
    .map(({ archivo, fuente, valor }) => {
      const motivo = motivoDeRechazo(valor, fuente);
      return motivo ? `${archivo}: ${motivo}` : null;
    })
    .filter(Boolean);

  assert.deepEqual(rotas, []);
});

test('el porcentaje de gates SIN control positivo no puede subir', () => {
  const gates = censo();
  const sinControl = sinControlPositivo(gates);
  const porcentaje = porcentajeSinControl(sinControl.length, gates.length);

  assert.ok(
    porcentaje <= TOPE_PORCENTAJE_SIN_CONTROL_POSITIVO,
    `${sinControl.length} de ${gates.length} gates (${porcentaje} %) no declaran un ` +
      `control positivo válido, y el tope es ${TOPE_PORCENTAJE_SIN_CONTROL_POSITIVO} %. ` +
      'Etiquetá los que falten, o bajá el tope si de verdad bajó.',
  );
});

test('el trinquete APRIETA: el tope no puede quedar por encima de lo medido', () => {
  // La otra mitad, y es la que lo convierte en trinquete: sin esto el tope se
  // queda arriba para siempre y el gate deja de exigir apenas alguien etiqueta.
  const gates = censo();
  const porcentaje = porcentajeSinControl(sinControlPositivo(gates).length, gates.length);

  assert.ok(
    TOPE_PORCENTAJE_SIN_CONTROL_POSITIVO <= porcentaje,
    `El tope está en ${TOPE_PORCENTAJE_SIN_CONTROL_POSITIVO} % y lo medido es ` +
      `${porcentaje} %. Bajá el tope a ${porcentaje}: un trinquete que se queda ` +
      'arriba del árbol deja de trincar.',
  );
});

test('la comparación MIDE: con números fabricados contesta lo que tiene que contestar', () => {
  assert.equal(porcentajeSinControl(0, 450), 0);
  assert.equal(porcentajeSinControl(450, 450), 100);
  assert.equal(porcentajeSinControl(2, 3), 67);
  // Redondeo hacia arriba: uno solo sin etiquetar sobre 450 no es «cero por ciento».
  assert.equal(porcentajeSinControl(1, 450), 1);
  assert.equal(porcentajeSinControl(0, 0), 0);
});

test('el reconocedor engancha: sobre un repo sintético contesta 67 %', () => {
  // Control positivo del gate mismo, calcando `audit-consumers.test.js`: tres
  // archivos, uno con etiqueta válida, uno con «ninguno» justificado y uno sin
  // nada. Dos de tres sin control es 67 % — y si el recorrido o el validador se
  // rompen, este número deja de salir.
  const taller = mkdtempSync(join(tmpdir(), 'memivo-control-positivo-'));
  try {
    const gates = join(taller, 'tests', 'config');
    mkdirSync(gates, { recursive: true });

    const etiqueta = (valor) => `/** @control` + `-positivo ${valor} */\n`;

    writeFileSync(
      join(gates, 'con-etiqueta.spec.ts'),
      etiqueta('en este archivo: el reconocedor engancha') +
        "it('el reconocedor engancha', () => {});\n",
    );
    writeFileSync(
      join(gates, 'sin-ofensor.spec.ts'),
      etiqueta('ninguno — mide una constante publicada'),
    );
    writeFileSync(join(gates, 'pelado.spec.ts'), '// nada declarado\n');

    const leidos = readdirSync(gates)
      .sort()
      .map((nombre) => {
        const fuente = readFileSync(join(gates, nombre), 'utf8');
        const match = ETIQUETA.exec(fuente);
        return { fuente, valor: match ? match[1] : null };
      });

    assert.equal(leidos.length, 3);
    assert.equal(porcentajeSinControl(sinControlPositivo(leidos).length, leidos.length), 67);
  } finally {
    rmSync(taller, { recursive: true, force: true });
  }
});

test('y el validador RECHAZA lo que tiene que rechazar', () => {
  assert.equal(motivoDeRechazo('ninguno — mide una constante publicada', ''), null);
  assert.match(motivoDeRechazo('ninguno —', ''), /motivo/);
  assert.match(motivoDeRechazo('   ', ''), /vacía/);
  assert.equal(motivoDeRechazo('en este archivo: engancha', 'it("engancha")'), null);
  assert.match(motivoDeRechazo('en este archivo: engancha', 'otra cosa'), /no aparece/);

  // LA TAUTOLOGÍA, como caso propio. Un archivo cuyo único rastro del texto es
  // el renglón de la etiqueta NO cumple: la etiqueta se cita a sí misma, y ésta
  // era la forma en que la regla contestaba «sí» sobre un caso inventado.
  assert.match(
    motivoDeRechazo(
      'en este archivo: engancha',
      ' * @control' + '-positivo en este archivo: engancha\n',
    ),
    /no aparece/,
  );
  assert.match(motivoDeRechazo('memivo_api/tests/no-existe.spec.ts', ''), /no es un archivo/);
  assert.equal(motivoDeRechazo('memivo-reference-data/package.json', ''), null);
});
