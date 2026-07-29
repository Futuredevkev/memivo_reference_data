export interface ConfirmProfileChangesRequest {
    /**
     * Código enviado a la dirección ACTUAL. Protege contra el secuestro de
     * sesión: quien robó un token pero no el buzón no puede confirmar nada.
     */
    code: string;
    /**
     * Código enviado a la dirección NUEVA. Obligatorio **sólo** cuando el cambio
     * pendiente incluye el email, y es lo que prueba que esa dirección existe y
     * es alcanzable — hoy el email nuevo nunca se verificaba, así que un typo
     * dejaba la cuenta apuntando a un buzón inexistente y sin camino de vuelta.
     *
     * Son DOS códigos y no uno repartido a las dos direcciones: con un solo
     * código, quien robó la sesión pone su propio email, recibe el código ahí y
     * confirma solo — la protección de la dirección vieja se perdería justo en el
     * ataque contra el que existe.
     */
    newEmailCode?: string;
}
