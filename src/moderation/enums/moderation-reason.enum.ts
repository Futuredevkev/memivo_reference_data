/**
 * Por qué moderación actúa sobre una persona.
 *
 * ── POR QUÉ ESTÁ ACÁ Y NO EN `reports/` ────────────────────────────────────
 * Nació como `ProfileReportReason`, en `reports/enums/`, cuando su único lector
 * era la denuncia que levanta un usuario. Cuando el dueño pidió que **la app
 * diga el motivo de una suspensión**, el mismo catálogo pasó a tener un segundo
 * lector —la sanción— y el nombre se volvió mentira: decía «denuncia» y se
 * usaba para banear.
 *
 * Las dos salidas malas estaban a la vista. Usarlo igual deja un símbolo cuyo
 * nombre no describe la mitad de sus usos; copiarlo a un `BanReasonCategory`
 * deja **dos catálogos del mismo hecho** que se desincronizan en el primer
 * miembro nuevo. Se generalizó, que es Apéndice B de ORDEN: si sirve dos veces,
 * se extrae.
 *
 * ── EL VALOR NO CAMBIÓ, Y ESO ES A PROPÓSITO ───────────────────────────────
 * Los ocho miembros son los mismos y con los mismos literales, así que la
 * columna de Postgres no se reescribe: la migración sólo renombra el TIPO
 * (`ALTER TYPE … RENAME TO`), que no toca ninguna fila. Un `enum` cuyo literal
 * cambia obliga a migrar datos, y no había motivo para pagarlo.
 *
 * ── DÓNDE SE LEE ───────────────────────────────────────────────────────────
 * La denuncia lo escribe cuando alguien reporta; el ban lo escribe cuando
 * moderación sanciona. Y el cliente lo TRADUCE: es la única mitad del motivo
 * que puede viajar al cartel de la app, porque la otra —el texto libre que
 * tipea quien modera— no tiene idioma y sólo puede ir por mail.
 */
export enum ModerationReason {
  HARASSMENT = 'harassment',
  INAPPROPRIATE_CONTENT = 'inappropriate_content',
  IMPERSONATION = 'impersonation',
  SPAM_OR_SCAM = 'spam_or_scam',
  CHILD_EXPLOITATION = 'child_exploitation',
  SAFETY_CONCERN = 'safety_concern',
  /**
   * Reclamo de derechos de autor sobre una pieza publicada.
   *
   * Es la única razón que NACIÓ exigiendo evidencia estructurada: sin la pieza
   * no hay reclamo que se pueda accionar —«tenés algo mío» pide decir *qué*—, y
   * por eso su fila de {@link PROFILE_REPORT_CONTENT_REQUIREMENT_BY_REASON} es
   * `REQUIRED`. La denuncia sigue siendo contra la PERSONA; la pieza viaja como
   * evidencia de esa denuncia.
   *
   * El camino del titular de derechos que NO es usuario de Memivo no es éste:
   * es el correo publicado en los términos §10.1, que termina en el mismo
   * expediente por la vía de administración.
   */
  COPYRIGHT = 'copyright',
  OTHER = 'other',
}
