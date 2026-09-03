import type { ResourceType } from '../media/enums';
import type { UploadIntentContext } from '../media/types';

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
   * canjea por un reenvío del código de verificación.
   *
   * ── VIAJA POR DOS CANALES Y SÓLO UNO ESTABA DECLARADO ───────────────────
   * El REGISTRO lo devuelve en su respuesta de ÉXITO, y eso el contrato ya lo
   * decía: {@link AuthResponse}. El LOGIN de una cuenta sin verificar lo
   * devuelve en el body de un 401, y ése era el canal que nadie declaraba —el
   * api lo autorizaba en su política de reenvío y esta interfaz lo negaba—, así
   * que el cliente lo leía con una forma escrita a mano. Los dos caminos
   * terminan en `memivo_client/src/store/auth/authFlowSlice.ts`. Declararlo acá
   * empareja los dos canales bajo el mismo contrato.
   */
  registrationChallengeToken?: string;
  /**
   * QUÉ SE ESTABA SUBIENDO cuando el tope de peso o el de formato lo frenó.
   *
   * ── POR QUÉ VIAJA LA LLAVE Y NO EL NÚMERO ────────────────────────────────
   * El tope de bytes y la lista de formatos de cada recurso los publica este
   * mismo paquete ({@link RESOURCE_UPLOAD_LIMITS}), así que mandarlos por el
   * cable les daría DOS orígenes en el cliente: el cuerpo del error por el
   * camino del servidor, y el contrato por el camino del chequeo previo —que no
   * tiene servidor del cual leerlos—. Con la llave, los dos caminos terminan
   * leyendo la misma fila y no se pueden desincronizar.
   *
   * El eje es el RECURSO y no el contexto de subida porque la regla es del
   * recurso: un `chat_media` admite 5 MB si es imagen y 100 MB si es video.
   *
   * Presente sólo con `FILES_TOO_LARGE` y `FILES_UNSUPPORTED_FORMAT`.
   */
  resourceType?: ResourceType;
  /**
   * DESDE DÓNDE se estaba subiendo cuando el tope de CANTIDAD lo frenó.
   *
   * Es otro eje que {@link ApiErrorEnvelope.resourceType}, y a propósito:
   * cuántos archivos entran no es propiedad del recurso sino del contexto —una
   * publicación admite diez, sean fotos o videos— y eso lo decide
   * {@link UPLOAD_CONTEXT_FILE_LIMITS}. Llavear las dos reglas por el mismo
   * campo sería elegir el eje equivocado para una de las dos.
   *
   * Presente sólo con `FILES_TOO_MANY`.
   */
  uploadContext?: UploadIntentContext;
}
