/**
 * Resultado agregado de una opción. Cuenta votos, nunca votantes:
 * no existe forma de expresar QUIÉN votó esta opción.
 */
export interface PollOptionResult {
  id: string;
  text: string;
  position: number;
  votesCount: number;
}
