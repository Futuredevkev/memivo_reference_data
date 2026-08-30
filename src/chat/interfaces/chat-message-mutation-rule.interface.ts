import type { ChatEditableContent } from '../enums';

/**
 * Qué le puede hacer alguien a un mensaje YA MANDADO, según su tipo.
 *
 * ── POR QUÉ LOS DOS CAMPOS VIVEN EN LA MISMA REGLA ─────────────────────────
 * Porque contestan la misma clase de pregunta —qué de este mensaje sigue
 * siendo maleable después de salir— y separarlos en dos tablas obligaría a
 * mantener DOS `Record` totales sobre el mismo enum, que es el churn que la
 * exhaustividad por tipos existe para evitar: quien agregue un
 * `ChatMessageType` tendría que acordarse de dos lugares en vez de romper el
 * build en uno.
 *
 * ── Y NO SON EL MISMO CAMPO ────────────────────────────────────────────────
 * Es exactamente la advertencia que `ChatMessageContentRule` ya se hizo sobre
 * su propio par: hoy sólo `TEXT` se reescribe y sólo `SYSTEM` no se borra, así
 * que los dos campos NO dan el mismo conjunto ni de casualidad. Una encuesta se
 * borra y no se rehace; un aviso de sistema no se hace ninguna de las dos.
 *
 * ── LO QUE ESTA REGLA NO CONTESTA ──────────────────────────────────────────
 * QUIÉN. El tipo dice si la operación existe para esa forma de mensaje; la
 * autoridad —ser el autor, ser el creador del grupo, ser admin— la resuelven
 * las puertas que leen esta tabla, porque depende de la persona y del chat, no
 * del tipo.
 */
export interface ChatMessageMutationRule {
  /** Qué parte del mensaje puede reescribir su autor. */
  readonly edits: ChatEditableContent;
  /** Si el mensaje admite que se lo borre, con la autoridad que sea. */
  readonly deletable: boolean;
}
