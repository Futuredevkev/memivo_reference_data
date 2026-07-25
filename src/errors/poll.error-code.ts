/**
 * Códigos de error del módulo de encuestas (polls)
 */
export enum PollErrorCode {
  // Options
  POLL_MIN_OPTIONS = 'POLL_MIN_OPTIONS',
  POLL_MAX_OPTIONS = 'POLL_MAX_OPTIONS',
  POLL_OPTION_EMPTY = 'POLL_OPTION_EMPTY',
  POLL_OPTIONS_UNIQUE = 'POLL_OPTIONS_UNIQUE',
  POLL_OPTION_INVALID = 'POLL_OPTION_INVALID',

  // Duration
  POLL_MIN_DURATION = 'POLL_MIN_DURATION',
  POLL_MAX_DURATION = 'POLL_MAX_DURATION',

  // Poll Status
  POLL_NOT_FOUND = 'POLL_NOT_FOUND',
  POLL_NOT_ACTIVE = 'POLL_NOT_ACTIVE',
  POLL_EXPIRED = 'POLL_EXPIRED',
  // `POLL_ALREADY_VOTED` se ELIMINÓ: votar de nuevo no es un error. Re-tocar la
  // misma opción es idempotente y tocar otra cambia el voto, así que el código
  // no tenía quién lo emitiera — sólo una traducción en tres idiomas para un
  // mensaje que nadie iba a ver.
}
