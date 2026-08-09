/**
 * Qué está mirando el usuario AHORA. El cliente lo reporta por socket y el
 * servidor lo usa para saltear pushes que serían redundantes con la pantalla
 * abierta (`viewsSuppressNotification`).
 *
 * Cada campo es un EJE de contexto, y qué tipo de notificación mira cuál lo
 * declara `NOTIFICATION_DELIVERY_POLICY` — no se decide acá ni en el consumidor.
 * Agregar un eje es agregar un campo acá: `ActiveViewKey` se deriva solo y la
 * tabla de política pasa a poder referenciarlo.
 */
export interface ActiveView {
    albumId: string | null;
    chatGroupId: string | null;
    postId: string | null;
    storyId: string | null;
}
