"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STORY_UPLOAD_FILE_LIMIT = void 0;
/**
 * Cuántos archivos entran en UNA historia: uno.
 *
 * La diferencia con `MULTI_FILE_UPLOAD_LIMIT` no es de tamaño sino de
 * naturaleza: aquél es una cuota —cuántos deja elegir el picker y cuántos
 * acepta el finalize, un número que se puede subir el día que se quiera— y esto
 * es la FORMA de la historia. Una historia es una pieza de media con su
 * caption; dos archivos son dos historias. Subirlo no sería aflojar una cuota,
 * sería otro producto.
 *
 * Vivía en el api con esa misma decisión escrita y con una frase de más: que
 * por eso NO se publicaba. Las dos cosas no se seguían. Se publica porque el
 * rechazo por cantidad tiene que poder decir el número en los tres idiomas, y
 * eso lo decide el cliente; que el número no sea una cuota negociable sigue
 * siendo verdad y sigue escrito acá.
 */
exports.STORY_UPLOAD_FILE_LIMIT = 1;
