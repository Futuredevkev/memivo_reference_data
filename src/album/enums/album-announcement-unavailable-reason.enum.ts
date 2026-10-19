/**
 * POR QUÉ quien pide no puede avisarle a todo el álbum ahora.
 *
 * ── POR QUÉ LO DICE EL SERVIDOR Y NO LO DEDUCE LA APP ────────────────────
 * El tope es del álbum —un aviso por publicación, un intervalo mínimo entre
 * avisos y un máximo por día— y lo cuenta el servidor bajo lock. La app sólo
 * dibuja: apaga el interruptor, elige la frase y muestra la hora. Si la
 * dedujera mirando sus propios datos tendría una segunda copia de la regla,
 * que es la que diverge el día que el tope cambie.
 *
 * Viaja en tres lugares con el MISMO significado: el estado del álbum que ve
 * quien organiza, el motivo por el que una publicación se creó sin aviso, y el
 * rechazo de la puerta explícita. Es la misma pregunta en los tres.
 */
export enum AlbumAnnouncementUnavailableReason {
  /**
   * Quien pide no organiza el álbum. La app no le ofrece la opción, así que
   * sólo llega cuando alguien la manda a mano o cuando le sacaron el rol entre
   * que abrió la pantalla y publicó.
   */
  NOT_ORGANIZER = 'NOT_ORGANIZER',
  /**
   * El álbum está oculto. En un álbum oculto los invitados no tienen acceso,
   * así que un aviso «a todos» le llegaría sólo a quien organiza: se dice que
   * no se puede en vez de avisar a medias.
   */
  ALBUM_HIDDEN = 'ALBUM_HIDDEN',
  /** Hubo un aviso hace menos del intervalo mínimo. Viaja con su próximo instante. */
  COOLDOWN = 'COOLDOWN',
  /** Se llegó al máximo de avisos de la ventana. Viaja con su próximo instante. */
  DAILY_LIMIT = 'DAILY_LIMIT',
  /** Esta publicación ya avisó. Un aviso por publicación, siempre. */
  ALREADY_ANNOUNCED = 'ALREADY_ANNOUNCED',
}
