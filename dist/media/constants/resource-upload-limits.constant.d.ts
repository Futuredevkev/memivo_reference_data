import { ResourceType } from '../enums';
import type { PublicResourceUploadLimit } from './internal/public-resource-upload-limit.interface';
/**
 * Todo lo que un tipo de recurso acota al subirse: cuánto puede pesar, cuánto
 * puede durar y qué extensiones acepta.
 *
 * ── POR QUÉ EL FORMATO ENTRÓ A ESTA TABLA (y no a una hermana) ─────────────
 * El reparto tipo → lista vivía en `RESOURCE_CONFIG`, del lado del api, así que
 * el cliente podía decir el PESO que un recurso admite y no los FORMATOS. El
 * mensaje de «formato no soportado» quedaba sin poder nombrar los que sí
 * entran, que es exactamente la clase de defecto que esta ola vino a cerrar:
 * anunciar una regla sin decirla. Publicarlo como tabla APARTE habría dejado
 * dos filas por recurso en dos archivos, y una fila nueva podría declarar el
 * peso y olvidarse del formato sin que nada se pusiera rojo. Acá el tipo lo
 * impide.
 */
export declare const RESOURCE_UPLOAD_LIMITS: Readonly<Record<ResourceType, PublicResourceUploadLimit>>;
