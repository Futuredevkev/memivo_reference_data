/**
 * EL NOMBRE VISIBLE de una persona: nombre y apellido, cada uno recortado, con
 * un espacio entre medio y sin bordes.
 *
 * ── EL DEFECTO QUE CIERRA ──────────────────────────────────────────────────
 * La derivación vivía escrita DOS veces, una por punta, y no daban lo mismo: la
 * app recortaba cada parte antes de juntarlas y el servidor juntaba primero y
 * recortaba el resultado. Con un `name` guardado como «Ana » la app decía
 * «Ana López» y el servidor «Ana  López», con dos espacios. Mientras el nombre
 * sólo se dibujaba nadie lo notaba; con menciones deja de ser cosmético, porque
 * el servidor verifica que el texto escrito por la app diga EXACTAMENTE ese
 * nombre (`mentionMatchesText`). Dos derivaciones son dos respuestas a esa
 * pregunta, y una mención válida en la app se rechazaría en el servidor.
 *
 * ── LO QUE NO DECIDE ───────────────────────────────────────────────────────
 * El RESPALDO para una persona sin nombre —«Usuario», un `fullName` de una forma
 * parcial, un texto vacío—. Eso es presentación y cada punta lo resuelve con su
 * idioma y su forma; lo que se publica acá es la identidad escrita, que es lo
 * que las dos tienen que ver igual. Sin nombre ni apellido devuelve `''`, y
 * quien necesite un respaldo lo pone arriba.
 */
export declare const formatPersonDisplayName: (person: {
    readonly name?: string | null;
    readonly lastName?: string | null;
}) => string;
