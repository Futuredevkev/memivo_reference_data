"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEARCH_TERM_MAX = void 0;
/**
 * Cuántos caracteres admite un término de búsqueda libre (`q` / `search`).
 *
 * ── EL DEFECTO QUE CIERRA DEL LADO DEL SERVIDOR ────────────────────────────
 * `q` y `search` eran los DOS únicos campos string sin tope que viajan en TODOS
 * los endpoints paginados, y no se quedan en el request: el término entra al
 * `ILIKE` server-side y, además, **es parte de la clave de cache**
 * (`encodeCachePart`). O sea que un término de 1 MB no costaba una query cara:
 * costaba una CLAVE de 1 MB en una instancia `allkeys-lru` de 256 MB. Un puñado
 * de requests desalojaba la cache entera de todos los usuarios, sin
 * autenticación privilegiada y sin que ningún tope lo frenara.
 *
 * ── POR QUÉ SUBE AL PAQUETE ────────────────────────────────────────────────
 * Vivía sólo en el api, y era el ÚNICO tope de texto que una persona tipea que
 * el cliente no podía leer aunque quisiera. El efecto era el buscador: un solo
 * componente montado en quince superficies, sin ningún tope al escribir,
 * contra un rechazo de 200 del otro lado. Con el número acá lo leen los dos —el
 * campo que frena y el DTO que rechaza—, que es la forma del resto de esta
 * carpeta.
 *
 * ── POR QUÉ 200 ────────────────────────────────────────────────────────────
 * Es el largo del campo indexado más largo contra el que se puede buscar
 * (`users.name` / `users.lastName`, o sea `PROFILE_NAME_MAX`). Un término más
 * largo que el campo más largo no puede matchear NADA: arriba de esto no hay
 * búsqueda posible, sólo costo. No se deriva de `PROFILE_NAME_MAX` a propósito
 * —el día que se agregue un campo buscable más largo, este número se decide
 * mirando el nuevo campo, no se mueve solo por un cambio de perfil—.
 *
 * ── QUÉ NO ACOTA ───────────────────────────────────────────────────────────
 * El buscador de stickers, que pega contra un catálogo de terceros y tiene su
 * propio tope más chico (`STICKER_QUERY_MAX_LENGTH`). Es el mismo componente
 * con otro destino, así que son dos números y no uno.
 */
exports.SEARCH_TERM_MAX = 200;
