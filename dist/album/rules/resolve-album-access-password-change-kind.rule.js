"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAlbumAccessPasswordChangeKind = void 0;
/**
 * QUÉ LE PASÓ a la contraseña de acceso, a partir del antes y el después.
 *
 * ── POR QUÉ ES UNA REGLA COMPARTIDA Y NO UN TERNARIO EN EL SERVICIO ───────
 * Porque los tres nombres son los mismos que el cliente usa para elegir la
 * frase del registro de actividad. Escritos como literales del lado del
 * servidor, una punta puede cambiar «changed» por «updated» y la otra seguir
 * compilando, dibujando el caso que no es.
 *
 * ── EL CASO QUE NO EXISTE, Y POR QUÉ CONTESTA `removed` ───────────────────
 * «No había y sigue sin haber» no debería llegar acá —el endpoint sólo corre
 * sobre un cambio real— pero el tipo lo admite, así que hay que contestarlo. Se
 * responde `removed` porque es lo que describe el estado final: no hay
 * contraseña. Inventar un cuarto desenlace para algo inalcanzable obligaría a
 * cada lector a dibujar una frase que nadie va a ver.
 */
const resolveAlbumAccessPasswordChangeKind = (input) => {
    if (!input.has)
        return 'removed';
    return input.had ? 'changed' : 'enabled';
};
exports.resolveAlbumAccessPasswordChangeKind = resolveAlbumAccessPasswordChangeKind;
