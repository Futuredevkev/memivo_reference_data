"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLAN_LIMITS = void 0;
const plan_tier_enum_1 = require("../enums/plan-tier.enum");
/**
 * LA TABLA DE TOPES POR PLAN — el dueño único de todo número que cambia según
 * lo que alguien paga.
 *
 * ── POR QUÉ ESTÁ ACÁ Y NO EN `validation/limits/` ──────────────────────────
 * Porque `validation/limits/` tiene un gate sin allowlist
 * (`test/limits-have-one-door.test.js`) que prohíbe que un archivo de esa
 * carpeta importe a un hermano: un tope de ahí es un número que se sostiene
 * solo, y lo único que los junta es el barrel. Esta tabla es lo contrario —un
 * agregado que EXISTE para que `tsc` obligue a decidir— y el propio gate
 * declara la salida: un `Record<Union, …>` en otra carpeta es un agregado
 * legítimo.
 *
 * ── POR QUÉ LOS NÚMEROS SON ÉSTOS, Y CÓMO SE RETUNEAN ──────────────────────
 * Salen de criterio y de benchmarks, no de una curva: cuando se escribieron, la
 * base estaba casi vacía y no había uso que leer. Son constantes RETUNEABLES a
 * propósito, y el instrumento que las valida ya existe: el panel de métricas de
 * monetización mide las mismas palancas por usuario, en bandas. El día que haya
 * gente, el número se corrige ahí y no acá de memoria.
 *
 * ⚠️ **El 100 de fotos profesionales está abierto a revisión del dueño**: una
 * entrega real de boda son 300–800 fotos, así que 100 corta en la primera
 * entrega seria. Queda escrito y no escondido.
 *
 * ── NADA HACIA ATRÁS, Y NADA PEOR DESPUÉS DE CANCELAR ──────────────────────
 * Los topes gobiernan lo que se CREA, nunca lo que ya existe: un álbum que
 * quedó por encima de su cupo —porque lo heredó una cuenta sin plan, o porque
 * el número bajó— conserva todo su contenido, no se congela, no se oculta y no
 * se degrada. Lo único que cambia es que lo NUEVO se rige por el plan de hoy.
 */
exports.PLAN_LIMITS = {
    [plan_tier_enum_1.PlanTier.FREE]: {
        albumsCreatedWhileFree: 3,
        professionalPhotosPerAlbum: 100,
        albumQrCodeBirthTtlDays: 30,
        albumStats: false,
        professionalVideo: false,
        storyVaultRetentionDays: 90,
    },
    [plan_tier_enum_1.PlanTier.PRO]: {
        // `null` en las dos que topean por cantidad: el plan pago no tiene tope
        // duro en ninguna palanca, y por eso el número que una frase de rechazo
        // necesita decir es SIEMPRE el del plan gratis.
        albumsCreatedWhileFree: null,
        professionalPhotosPerAlbum: null,
        albumQrCodeBirthTtlDays: 180,
        albumStats: true,
        professionalVideo: true,
        // `null` = sin purga. El Baúl de un álbum con plan no se vacía nunca.
        storyVaultRetentionDays: null,
    },
};
