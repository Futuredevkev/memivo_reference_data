/**
 * Cuánto se guarda una historia en el Baúl de UN álbum.
 *
 * ── POR QUÉ ES UNA RESPUESTA Y NO UN CÁLCULO DEL CLIENTE ─────────────────
 * Porque el plazo lo decide el plan de QUIEN CREÓ el álbum, y el cliente no
 * tiene con qué saber quién lo creó ni qué plan tiene esa persona. Lo único que
 * la app conoce por su cuenta es el plan de la CUENTA QUE MIRA, que acá es el
 * eje equivocado dos veces: un invitado sin plan vería un plazo en el Baúl de
 * un álbum con plan —donde no se borra nada— y un organizador con plan no
 * vería ninguno en el Baúl de un álbum ajeno que sí se purga. Es el mismo
 * razonamiento —y el mismo molde— que el cupo de fotos profesionales del álbum.
 *
 * ── LO LEE CUALQUIER MIEMBRO, NO SÓLO QUIEN ADMINISTRA ───────────────────
 * El Baúl es memoria del ÁLBUM: lista el archivo de todos sus autores y su
 * gate de acceso es la membresía. El plazo tiene que verlo todo el que puede
 * abrirlo, porque a todos les alcanza — no es una estadística del organizador.
 *
 * ── `null` SIGNIFICA «NO SE BORRA NUNCA» ────────────────────────────────
 * Y no un número enorme: quien dibuja tiene que decidir explícitamente qué
 * mostrar cuando no hay plazo, que es NADA. Un aviso que dijera «se guardan
 * 36.500 días» sería peor que el silencio.
 *
 * ── NO ES AUTORIDAD ─────────────────────────────────────────────────────
 * Sirve para avisar antes de que pase algo. Quien decide si una historia se
 * borra es el servidor, en el barrido, contra el plan del creador leído en ese
 * mismo instante.
 */
export interface StoryVaultRetentionResponse {
  /**
   * Cuántos días se guarda en este álbum una historia publicada de ahora en
   * adelante. `null` = para siempre.
   *
   * Es una POLÍTICA, no una promesa sobre cada pieza que ya está: las
   * historias publicadas antes de que la política existiera —y las de una
   * época en la que el álbum tenía plan— no tienen fecha de borrado y no la van
   * a tener nunca. O sea que el número puede ser pesimista para una pieza
   * vieja, jamás optimista.
   */
  readonly retentionDays: number | null;
}
