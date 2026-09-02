"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModerationErrorCode = void 0;
var ModerationErrorCode;
(function (ModerationErrorCode) {
    ModerationErrorCode["MODERATION_CASE_NOT_FOUND"] = "MODERATION_CASE_NOT_FOUND";
    ModerationErrorCode["MODERATION_BAN_NOT_FOUND"] = "MODERATION_BAN_NOT_FOUND";
    /** La pieza que el expediente manda remover no existe (o ya se removió). */
    ModerationErrorCode["MODERATED_CONTENT_NOT_FOUND"] = "MODERATED_CONTENT_NOT_FOUND";
    /**
     * Se pidió resolver un expediente que ya estaba resuelto.
     *
     * Antes esto contestaba `200` con el estado sin cambios, que es
     * indistinguible de haber funcionado. Una resolución es un HECHO fechado: el
     * segundo pedido no puede correr la fecha de algo que ya pasó, y tiene que
     * poder enterarse de que no escribió.
     */
    ModerationErrorCode["MODERATION_CASE_ALREADY_RESOLVED"] = "MODERATION_CASE_ALREADY_RESOLVED";
    /**
     * Se pidió abrir un hold legal que ya estaba abierto, o liberar uno que no
     * lo estaba.
     *
     * El hold es un registro append-only y su estado se deriva del último
     * evento, así que la transición inválida se puede nombrar. El defecto que
     * cierra es el mismo del código de arriba: contestar `200` sobre una
     * escritura que no pasó le hace creer a quien modera que reabrió un hold — y
     * de eso depende que el material no se destruya.
     */
    ModerationErrorCode["MODERATION_LEGAL_HOLD_TRANSITION_INVALID"] = "MODERATION_LEGAL_HOLD_TRANSITION_INVALID";
    /**
     * Falló bajar una pieza por moderación de plataforma, por algo IMPREVISTO.
     *
     * Los casos previsibles ya tienen nombre —`MODERATED_CONTENT_NOT_FOUND` para
     * la pieza que no está—; éste cubre lo demás: la base, Cloudinary, o alguno
     * de los cinco colaboradores que la remoción orquesta dentro de su
     * transacción.
     *
     * Sin él ese camino salía como `INTERNAL_SERVER_ERROR`, así que quien
     * atiende un reclamo legal de un tercero leía «error interno del servidor»
     * sobre la única superficie que Memivo tiene para bajar UNA pieza con
     * expediente.
     */
    ModerationErrorCode["MODERATED_CONTENT_REMOVAL_FAILED"] = "MODERATED_CONTENT_REMOVAL_FAILED";
})(ModerationErrorCode || (exports.ModerationErrorCode = ModerationErrorCode = {}));
