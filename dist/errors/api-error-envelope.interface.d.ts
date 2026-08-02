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
 * Estos son los campos CANÓNICOS. El filtro además reenvía tal cual, en el
 * mismo nivel, cualquier campo NO canónico que traía el payload de la
 * excepción original (p.ej. `registrationChallengeToken` en
 * `AUTH_NOT_VERIFIED`) — ver `RESERVED_ERROR_BODY_KEYS` del lado del api, que
 * es la lista de claves canónicas que NUNCA se pisan con ese reenvío. Esta
 * interfaz no los modela con un índice `[key: string]: unknown` a propósito:
 * ese campo extra es específico de un errorCode puntual, así que quien lo
 * necesite lo lee con un cast acotado a ESE caso en vez de que cualquier
 * lectura del envelope quede tipada como potencialmente-cualquier-cosa.
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
}
