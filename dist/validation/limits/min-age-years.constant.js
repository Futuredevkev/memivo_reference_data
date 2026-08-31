"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MIN_AGE_YEARS = void 0;
/**
 * Edad mínima para registrarse en Memivo.
 *
 * ── POR QUÉ TIENE DOCBLOCK Y SUS HERMANOS NO ──────────────────────────────
 * Los otros topes de esta carpeta son de producto: si el título de un álbum
 * admite 60 o 80 caracteres no lo decide nadie afuera. Éste es **legal**, lo
 * publica el corpus de `memivo_api/docs/legal/` y lo mira la ficha de las
 * tiendas, así que moverlo no es cambiar un límite: es cambiar a quién admite
 * el producto.
 *
 * ── EL NÚMERO, Y DE DÓNDE SALE ────────────────────────────────────────────
 * **16**, decidido por el dueño el 31 de agosto de 2026. Antes decía 18, y el
 * corpus legal decía 13 en sus cuatro apariciones: las dos puntas estaban
 * separadas y **ninguna de las dos era el producto**. Alguien de 15 leía en los
 * Términos que podía registrarse y el registro lo rechazaba. La ola N3 movió
 * las dos hacia el mismo número.
 *
 * ── QUÉ SE MUEVE SOLO AL CAMBIAR ESTA LÍNEA, Y QUÉ NO ─────────────────────
 * **Sí:** toda la copy de la app, que está parametrizada por `{{count}}`, y la
 * validación de los dos lados del cable —`AgeValidator` en el api y
 * `validateMinAge` en el cliente— porque las dos leen de acá.
 *
 * **No: la prosa del corpus legal.** Los `.md` de `docs/legal/` y los tres
 * bloques del diccionario de la landing escriben la edad con letra, y ningún
 * `tsc` la alcanza. Se cambian a mano, junto con la `Versión:` y la fecha de
 * cada documento que se toque, que es lo que exige la regla 2 de
 * `memivo_api/docs/legal/README.md`.
 */
exports.MIN_AGE_YEARS = 16;
