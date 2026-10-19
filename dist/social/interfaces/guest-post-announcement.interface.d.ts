/**
 * La marca «Aviso» de una publicación: quien la organiza le avisó a todo el
 * álbum con ella.
 *
 * Es un objeto y no un booleano porque lo que la marca necesita es el
 * instante: la publicación puede avisar después de creada (desde su menú), así
 * que su fecha no dice cuándo avisó. Y es `null` cuando no avisó: el campo es
 * requerido en la forma del post para que ninguna proyección se olvide de
 * llenarlo.
 */
export interface GuestPostAnnouncement<TTimestamp = string> {
    readonly announcedAt: TTimestamp;
}
