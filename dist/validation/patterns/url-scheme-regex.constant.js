"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URL_SCHEME_REGEX = void 0;
/**
 * ¿ESTA CADENA EMPIEZA CON UN ESQUEMA DE URI EXPLÍCITO?
 *
 * `ftp://`, `file://`, `content://`, `ph://`, `ws://`, `https://` — cualquiera.
 * La forma sale de la RFC 3986: una letra, después letras, dígitos, `+`, `.` o
 * `-`, y `://`. Sin anclar al final a propósito: lo que sigue al esquema es la
 * ruta, y esta pregunta no la valida.
 *
 * ── LAS DOS PREGUNTAS QUE CONTESTA, Y POR QUÉ SON LA MISMA ────────────────
 *
 * Nació escrita dos veces, con dos nombres, en dos repos, y las dos copias
 * decían exactamente el mismo regex:
 *
 *  · **En el servidor**, para rechazar un esquema que NO es http(s) antes de
 *    que la normalización lo tape agregándole `https://` adelante. Sin esto, un
 *    `ftp://algo` se convertía en `https://ftp://algo` y pasaba el gate.
 *  · **En el cliente**, para saber si a una ruta local hay que anteponerle
 *    `file://`. Preguntar por `file://` en vez de por CUALQUIER esquema era el
 *    defecto: a un `content://media/…` de Android —o a un `ph://` de iOS— se le
 *    anteponía igual y salía `file://content://media/…`, una URI que ninguna
 *    API sabe abrir. Y el fallo es MUDO: no tira, devuelve una cadena rota.
 *
 * Las dos son la misma pregunta —«¿ya trae esquema?»— y por eso tienen un solo
 * dueño. Que fueran dos las descubrió `audit-consumers`, que aparea símbolos
 * entre repos por FIRMA y no por nombre: los dos nombres eran distintos, así que
 * ningún gate de un solo repo podía verlo.
 *
 * ── LO QUE NO ES ──────────────────────────────────────────────────────────
 *
 * No dice si el esquema es ACEPTABLE, sólo si hay uno. Quién puede pasar es
 * decisión de cada superficie: el perfil exige http(s) y para eso está
 * [HTTP_SCHEME_REGEX]; una ruta local acepta el que le dé el sistema.
 */
exports.URL_SCHEME_REGEX = /^[a-z][a-z0-9+.-]*:\/\//i;
