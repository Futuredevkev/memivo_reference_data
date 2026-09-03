import type { ModeratedContentType } from '../../album';
import type { ModerationReason } from '../../moderation';
/**
 * El cuerpo con el que se crea una denuncia de perfil.
 *
 * ── EL SUJETO ES LA PERSONA, Y LOS DOS CAMPOS DE ABAJO SON EVIDENCIA ───────
 * `reportedUserId` es lo que se denuncia. `contentType` y `contentId` señalan
 * la pieza que ORIGINÓ la denuncia, y no la convierten en su sujeto: no existe
 * forma de crear una denuncia sin persona, el expediente acumula historial
 * contra ella, y una denuncia contra una cosa se cerraría al borrar la cosa sin
 * dejar rastro del reincidente.
 *
 * Por eso los campos NO se llaman `reportedContentId`: el prefijo `reported`
 * nombra al sujeto de la denuncia en esta interfaz, y usarlo acá diría que la
 * pieza es lo denunciado. La copia legal publicada afirma, textual, que «una
 * foto, un mensaje o una publicación no se reportan por separado», y sigue
 * siendo verdad con estos dos campos puestos.
 *
 * Cuál razón admite pieza —y cuál la exige— no se decide acá ni en el
 * validador: lo dice
 * {@link PROFILE_REPORT_CONTENT_REQUIREMENT_BY_REASON}, que es el dueño único
 * de esa pregunta para el cliente y para el servidor.
 *
 * Los dos viajan juntos o no viaja ninguno: un tipo sin id no señala nada y un
 * id sin tipo no se puede resolver contra ninguna tabla.
 */
export interface CreateProfileReportRequest {
    reportedUserId: string;
    reason: ModerationReason;
    description?: string;
    contentType?: ModeratedContentType;
    contentId?: string;
}
