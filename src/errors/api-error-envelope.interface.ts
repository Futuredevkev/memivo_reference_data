/**
 * Forma canónica del body de CUALQUIER respuesta de error de la API. La arma
 * `GlobalExceptionFilter` (memivo_api, las dos ramas: `HttpException` y
 * excepción no controlada) y es el único shape que el cliente debe esperar
 * al leer `error.response.data`.
 *
 * Antes vivía redeclarada a mano como `ApiError` en
 * `memivo_client/src/utils/error-handler.ts`, sin nada que impidiera que las
 * dos definiciones divergieran — si el filtro sumaba o sacaba un campo
 * canónico, el cliente sólo se enteraba en runtime, leyendo `undefined`
 * donde esperaba un string. Publicado acá (ficha #154) para que el filtro y
 * el `ErrorHandler` del cliente importen el MISMO contrato.
 *
 * ── LOS CAMPOS OPCIONALES SE DECLARAN ACÁ, UNO POR UNO (N-401) ─────────────
 * Los seis primeros son los CANÓNICOS: viajan en todas las respuestas de error
 * y son los que `RESERVED_ERROR_BODY_KEYS` declara propiedad del sobre. Los
 * opcionales de abajo son los que un `errorCode` puntual le cuelga a SU
 * respuesta, y hasta el 20 de agosto viajaban por un `Record<string, unknown>`
 * que el filtro esparcía adentro del literal. Una bolsa sin tipar satisface
 * cualquier opcional, así que el compilador no podía verlos: una clave con
 * typo se publicaba sola, y la política que decidía qué se reenvía era una
 * SEGUNDA lista —`FORWARDABLE_ERROR_BODY_FIELDS`, del lado del api— que ya
 * había divergido de esta interfaz (autorizaba `registrationChallengeToken`
 * cuando el sobre no lo declaraba).
 *
 * Hoy esa política se llavea por {@link ForwardableErrorFields}, o sea por los
 * campos de ESTA interfaz: agregar uno opcional acá y no darle dueño allá pone
 * `tsc` en rojo, y nombrar allá un campo que acá no existe también. **Lo que
 * sigue valiendo es que NO hay índice `[key: string]: unknown`**: un sobre
 * abierto vuelve a dejar que cualquier excepción publique un campo sola, que
 * es el defecto que este eje cerró.
 */
export interface ApiErrorEnvelope {
  success: false;
  statusCode: number;
  errorCode: string;
  message: string | string[];
  timestamp: string;
  path: string;
  /** Sólo presente cuando errorCode === USER_BANNED. */
  isPermanent?: boolean;
  /** Sólo presente cuando errorCode === USER_BANNED y el ban es temporal. */
  expiresAt?: string | null;
  /**
   * Sólo presente cuando errorCode === AUTH_NOT_VERIFIED: es lo que el cliente
   * canjea por un reenvío del código de verificación, y el 401 del login es su
   * ÚNICO canal (`memivo_client/src/store/auth/authFlowSlice.ts`).
   *
   * Se declara acá porque ya viajaba: la política del api lo autorizaba desde
   * que existe la lista cerrada, y esta interfaz no lo decía. Mientras eso fue
   * así, el api publicaba un campo que el sobre negaba tener y el cliente lo
   * leía con una forma escrita a mano — el mismo hecho en tres lugares.
   */
  registrationChallengeToken?: string;
}
