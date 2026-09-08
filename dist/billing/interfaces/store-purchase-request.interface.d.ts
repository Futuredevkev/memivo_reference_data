import type { StorePlatform } from '../enums/store-platform.enum';
/**
 * LO QUE LA APP MANDA cuando la tienda le confirmó una compra.
 *
 * ── DOS CAMPOS, Y NINGUNO DE LOS DOS EXPRESA AUTORIDAD ────────────────────
 * No viaja el plan, ni el tier, ni el precio, ni hasta cuándo llega el período,
 * ni el identificador del producto. Nada de eso lo puede afirmar el teléfono:
 * el servidor le pregunta a la tienda por el comprobante y **lo que la tienda
 * conteste es lo único que mueve un derecho**. Lo que la app aporta es la otra
 * mitad, la que la tienda no sabe: QUIÉN es, y eso viaja en la sesión de la
 * petición, no en el cuerpo.
 *
 * Es la misma división que ya gobierna el cobro web —el aviso llega firmado y
 * sin identidad, y la identidad la pone la app con su sesión—, con una
 * diferencia a favor: acá el comprobante lo trae la app en el mismo viaje, así
 * que no hace falta ningún identificador de un solo uso que atar.
 *
 * ── SE LLAMABA `…Submission`, Y ESE SUFIJO LO VOLVÍA INVISIBLE ───────────
 * Los dos instrumentos que cruzan un DTO del api contra su contrato resuelven
 * la contraparte por CONVENCIÓN DE NOMBRE, y su lista es cerrada:
 * `Request | Input | Payload` en el gate del api, y el mismo recorte en el
 * auditor de consumidores de este paquete. Con `Submission` —una CUARTA forma
 * de nombrar un cuerpo de entrada, que no conocía nadie— `StorePurchaseDto` se
 * salteaba los dos enteros: quedó sin `implements` y el body del endpoint que
 * otorga un plan PAGADO era el único de la ola que podía divergir de su
 * contrato sin que se pusiera rojo nada. Se renombró en vez de ensanchar las
 * dos listas: el nombre es más barato que dos gates tocados, y `Request` es lo
 * que usan las otras dos puertas nuevas de esta misma serie.
 *
 * ── POR QUÉ ESTE MISMO CUERPO SIRVE PARA COMPRAR Y PARA RESTAURAR ─────────
 * Porque son el mismo hecho: «la tienda dice que esta cuenta de tienda tiene
 * este comprobante». Que sea de hace un minuto o de hace ocho meses lo decide
 * la tienda al contestar, no la app al contarlo. Un endpoint aparte para
 * restaurar habría sido un segundo camino para la misma escritura, con su
 * propia forma de equivocarse.
 */
export interface StorePurchaseRequest {
    /**
     * A QUÉ TIENDA hay que preguntarle. No dice qué otorgar.
     *
     * Un valor mentido consigue que se le pregunte a la tienda equivocada, y esa
     * tienda no reconoce el comprobante: la compra se rechaza. No hay forma de
     * usar este campo para conseguir un plan.
     */
    readonly platform: StorePlatform;
    /**
     * EL COMPROBANTE, tal como la tienda se lo dio a la app. Opaco de punta a
     * punta.
     *
     * En una de las dos tiendas es un mensaje firmado que se verifica solo; en la
     * otra es una referencia que sólo sirve preguntándole a la tienda. La app no
     * distingue: lo recibe del SDK y lo reenvía sin mirarlo, y el servidor decide
     * cómo verificarlo según la plataforma. Que las dos formas quepan en un solo
     * campo es lo que evita dos endpoints y dos cuerpos.
     *
     * **No se loguea, ni se guarda en el teléfono, ni se muestra.** Identifica
     * una transacción de pago de una persona concreta.
     */
    readonly purchaseToken: string;
}
