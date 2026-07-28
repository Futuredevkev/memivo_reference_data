/**
 * Invitaciones PENDIENTES de un grupo. El consumidor la usa para deshabilitar y
 * marcar «invitación pendiente» a quien ya fue invitado, así que la lista tiene
 * un techo duro del lado del servidor.
 */
export interface InvitedChatMembersResponse {
  invitedUserIds: string[];
  /**
   * `true` cuando había más invitaciones pendientes que el techo del servidor y
   * la lista viene cortada. Sin esta señal el corte es invisible: los que quedan
   * afuera aparecen como seleccionables y el organizador los reinvita sin
   * enterarse.
   */
  truncated: boolean;
}
