/**
 * ¿ESTA CADENA EMPIEZA CON UN ESQUEMA DE URI EXPLÍCITO?
 *
 * `https://`, pero también `file://`, `content://`, `ph://`, `ftp://`, `ws://`.
 *
 * ── LAS DOS PREGUNTAS QUE CONTESTA, Y POR QUÉ SON LA MISMA ────────────────
 * Nació privado de la regla que valida una URL de perfil, que lo necesita para
 * rechazar un esquema que no es http(s) ANTES de que la normalización lo tape
 * poniéndole `https://` adelante: sin eso, `ftp://algo` se convertía en
 * `https://ftp://algo` y pasaba el gate.
 *
 * El cliente escribió el MISMO patrón, carácter por carácter, para otra cosa:
 * decidir si a una ruta local hay que anteponerle `file://`. Preguntar por
 * `file://` en vez de por CUALQUIER esquema era el defecto que lo motivó: a un
 * `content://media/…` de Android —o a un `ph://` de iOS— se le anteponía igual
 * y salía `file://content://media/…`, una URI que ninguna API sabe abrir, con
 * un fallo MUDO que no tira y devuelve una cadena rota.
 *
 * Lo cazó el auditor de duplicación entre repos, que compara por FORMA y no por
 * nombre —los dos símbolos se llamaban distinto—.
 *
 * Y no es coincidencia: las dos preguntan lo mismo, «¿esta cadena ya trae un
 * esquema?». Lo que cambia es qué se hace con la respuesta. Con dos copias, el
 * día que alguien ensanche una —para admitir un esquema con guion bajo, por
 * ejemplo— la otra se queda atrás y nadie se entera.
 *
 * ── LA FORMA SALE DE LA RFC 3986 ──────────────────────────────────────────
 * Una letra, después letras, dígitos, `+`, `.` o `-`, y `://`. Sin anclar al
 * final a propósito: lo que sigue al esquema es la ruta, que no se valida acá.
 *
 * ── LO QUE NO ES ──────────────────────────────────────────────────────────
 * No dice si el esquema es ACEPTABLE, sólo si hay uno. Quién puede pasar es
 * decisión de cada superficie: el perfil exige http(s) y para eso está
 * [HTTP_SCHEME_REGEX]; una ruta local acepta el que le dé el sistema.
 */
export const URL_SCHEME_REGEX = /^[a-z][a-z0-9+.-]*:\/\//i;
