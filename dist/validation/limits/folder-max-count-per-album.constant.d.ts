/**
 * Cuántas carpetas admite un álbum.
 *
 * Es un límite DURO: el alta recuenta bajo un advisory lock por álbum, así que
 * dos altas simultáneas no pueden pasarlo. Sube al paquete porque el rechazo
 * decía «Alcanzaste el máximo de carpetas en este álbum» sin decir cuál, y el
 * número vivía sólo en el api: el cliente no lo podía nombrar sin escribirlo a
 * mano en tres idiomas.
 */
export declare const FOLDER_MAX_COUNT_PER_ALBUM = 100;
