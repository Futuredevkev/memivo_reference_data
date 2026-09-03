"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_UPLOAD_IMAGE_DIMENSION_PX = void 0;
/**
 * El lado máximo, en píxeles, de una imagen que se acepta subir.
 *
 * ── POR QUÉ ES UN TOPE APARTE DEL DE BYTES ────────────────────────────────
 * Porque acota otra cosa: un PNG de 20.000 × 20.000 puede pesar menos que el
 * tope de su recurso y aun así reventar la memoria de cualquier decodificador
 * que lo abra. Los dos topes corren juntos y son independientes.
 *
 * Sube a este paquete porque su rechazo tiene que poder decir el número, y el
 * cliente no lo tenía: el api ya lo interpolaba en su `message` en inglés
 * —«8000x8000px»— y esa frase no llega a pantalla. Es el mismo valor para todos
 * los tipos de recurso, así que no entra en `RESOURCE_UPLOAD_LIMITS`: no es
 * propiedad del recurso.
 */
exports.MAX_UPLOAD_IMAGE_DIMENSION_PX = 8000;
