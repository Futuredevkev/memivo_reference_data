/**
 * Estado de una historia. NO es una columna: se deriva de `expiresAt` contra el
 * reloj, así que la partición es total y no existe ventana intermedia.
 */
export enum StoryState {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}
