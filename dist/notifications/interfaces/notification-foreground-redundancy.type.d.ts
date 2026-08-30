/**
 * Por qué una push sobra con la app en PRIMER PLANO, sin mirar qué pantalla
 * está abierta. Es una decisión distinta de `redundantWhenViewing` y sólo la
 * evalúa el cliente: el servidor no sabe si la app está en foreground.
 *
 * Es un motivo y no un booleano a propósito — el gate de la tabla no puede
 * pedir lo mismo a los tres casos:
 *
 * - `self-confirmed` y `echoed-in-app` EXIGEN `replacedBy`: se calla la push
 *   porque otra superficie ya lo dice, y esa superficie tiene que estar
 *   nombrada. Silenciar sin sustituto es perder el evento.
 * - `re-engagement` NO exige `replacedBy`: no hay nada que sustituir. El único
 *   fin de la push era traer al usuario a la app y ya está adentro, así que el
 *   objetivo está cumplido y no queda información sin entregar. Si además el
 *   tipo es contextual, manda la regla del otro eje y el sustituto vuelve a ser
 *   obligatorio — los dos ejes se evalúan por separado.
 */
export type NotificationForegroundRedundancy = 
/** Se muestra igual: tener la app abierta no la vuelve redundante. */
'none'
/** La disparó el propio usuario y la app ya le muestra el resultado. */
 | 'self-confirmed'
/** Sólo existe para traerlo de vuelta a la app; ya está adentro. */
 | 're-engagement'
/** Evento de otro que el socket ya explicó in-app (toast global). */
 | 'echoed-in-app';
