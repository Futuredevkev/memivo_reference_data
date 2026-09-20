"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URL_SCHEME_REGEX = void 0;
/**
 * Cualquier prefijo `esquema://` explícito: `https://`, pero también `file://`,
 * `content://`, `ph://`, `ftp://`, `ws://`.
 *
 * ── LAS DOS PREGUNTAS QUE CONTESTA, Y POR QUÉ SON LA MISMA ────────────────
 * Nació privado de la regla que valida una URL de perfil, que lo necesita para
 * rechazar un esquema que no es http(s) ANTES de que la normalización lo tape
 * poniéndole `https://` adelante.
 *
 * El cliente escribió el MISMO patrón, carácter por carácter, para otra cosa:
 * decidir si a una ruta local hay que anteponerle `file://`. Lo cazó el auditor
 * de duplicación entre repos, que compara por FORMA y no por nombre —los dos
 * símbolos se llamaban distinto—.
 *
 * Y no es coincidencia: las dos preguntan lo mismo, «¿esta cadena ya trae un
 * esquema?». Lo que cambia es qué se hace con la respuesta. Con dos copias, el
 * día que alguien ensanche una —para admitir un esquema con guion bajo, por
 * ejemplo— la otra se queda atrás y nadie se entera.
 *
 * ── LA FORMA SALE DE LA RFC 3986 ──────────────────────────────────────────
 * Una letra, después letras, dígitos, `+`, `.` o `-`, y `://`. Sin anclar al
 * final a propósito: lo que sigue al esquema es la ruta, que no se valida acá.
 */
exports.URL_SCHEME_REGEX = /^[a-z][a-z0-9+.-]*:\/\//i;
