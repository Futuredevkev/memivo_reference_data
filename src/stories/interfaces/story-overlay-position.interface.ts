/**
 * Dónde se apoya un elemento sobre el media de una historia.
 *
 * Coordenadas normalizadas 0–1 **sobre el MEDIA**, no sobre la pantalla: la
 * historia se compone con recorte y zoom (`MediaComposition`), así que una
 * posición en píxeles de pantalla dejaría de significar lo mismo apenas cambie
 * el encuadre o el tamaño del dispositivo. El cliente proyecta media↔frame con
 * el par de helpers que ya usa para los tags.
 *
 * `0.5, 0.5` es el centro, y es el default de lo que se creó antes de que esto
 * existiera.
 *
 * Lo comparten los tags y las encuestas a propósito: dos overlays con el mismo
 * problema no pueden tener dos sistemas de coordenadas.
 */
export interface StoryOverlayPosition {
  /** Horizontal sobre el media, 0 = izquierda, 1 = derecha. */
  x: number;
  /** Vertical sobre el media, 0 = arriba, 1 = abajo. */
  y: number;
}
