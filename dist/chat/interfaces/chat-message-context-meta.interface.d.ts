export interface ChatMessageContextMeta {
    limit: number;
    hasOlder: boolean;
    olderCursor: string | null;
    /**
     * Hay mensajes MÁS NUEVOS que la ventana. El consumidor lo usa para ofrecer
     * la vuelta al final vivo: sin eso, tocar una cita o una notificación deja al
     * usuario en una ventana de la que no se sale hacia abajo —los mensajes en
     * vivo dejan de insertarse— salvo enviando un mensaje o saliendo de la sala.
     *
     * `newerCursor` NO está: no existe endpoint que pagine hacia adelante, así que
     * el servidor pagaba una segunda query de fronteras y un encode de cursor para
     * un campo que nadie podía consumir. La vuelta al tail es un refetch del
     * listado, no una página más.
     */
    hasNewer: boolean;
}
