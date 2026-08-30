"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveNotificationContextId = void 0;
const METADATA_SOURCE_PREFIX = 'metadata.';
const asNonEmptyString = (value) => typeof value === 'string' && value.length > 0 ? value : null;
/**
 * El id que hay que comparar contra el contexto activo, siguiendo las fuentes
 * que declara la política EN ORDEN: gana la primera que traiga un string no
 * vacío. `null` si el tipo no es contextual o si ninguna fuente resolvió.
 *
 * Los nombres de `NotificationContextIdSource` son las rutas: `'metadata.groupId'`
 * lee `metadata.groupId`. No hay una segunda tabla que mapee nombre → ruta, así
 * que no hay dos cosas que puedan desincronizarse.
 *
 * Esta función la corren los DOS lados. Antes eran dos cadenas de `??`
 * escritas a mano, una en `get-suppression-target.helper` (api) y otra en
 * `notification-foreground.helper` (cliente), que había que mantener idénticas
 * de memoria — y una divergencia ahí no rompe nada visible: simplemente deja de
 * suprimir, o suprime de más, en silencio.
 */
const resolveNotificationContextId = (policy, resourceId, metadata) => {
    // `unknown` y no `Record<string, unknown>` a propósito: del lado del servidor
    // metadata es una UNIÓN de interfaces cerradas (sin index signature) y del
    // lado del cliente es lo que venga en el payload de la push. Estrecharlo acá
    // adentro, una vez, evita un cast en cada llamador.
    const bag = metadata && typeof metadata === 'object'
        ? metadata
        : undefined;
    for (const source of policy.contextIdSources) {
        const raw = source === 'resourceId'
            ? resourceId
            : bag?.[source.slice(METADATA_SOURCE_PREFIX.length)];
        const id = asNonEmptyString(raw);
        if (id !== null)
            return id;
    }
    return null;
};
exports.resolveNotificationContextId = resolveNotificationContextId;
