import type { UserPlanTier } from '../../../billing';
/**
 * QUIEN HIZO LA ACCIÓN de una notificación, en la forma del cable.
 *
 * Lleva el plan ({@link UserPlanTier}) porque la campanita dibuja el tick de
 * quien paga al lado de su nombre. El nombre de quien actúa es el rótulo que
 * abre la fila, con su avatar al frente —la actividad de Instagram pone ahí el
 * verificado—, y no una referencia escrita adentro de una frase.
 *
 * Hasta el 14 sep 2026 no lo extendía: la campanita se había clasificado como
 * una referencia, y con esa vara es un rótulo.
 */
export interface NotificationActor extends UserPlanTier {
    id: string;
    name: string;
    lastName: string;
    avatar: {
        url: string;
    } | null;
}
