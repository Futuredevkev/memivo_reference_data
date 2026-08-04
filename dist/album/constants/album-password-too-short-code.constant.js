"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALBUM_PASSWORD_TOO_SHORT_CODE = void 0;
/**
 * Código que el API emite cuando la contraseña de álbum no llega al mínimo, y que el
 * cliente mapea a copy traducida.
 *
 * **Esto viaja por el cable**, y por eso vive acá y no en cada repo: es un
 * CÓDIGO, no un mensaje —el texto que ve la persona lo resuelve el cliente por
 * i18n—, así que los dos lados tienen que coincidir byte a byte.
 *
 * Nació DOS VECES el mismo día, una en cada repo, y el modo de falla es
 * silencioso: renombrarlo de un lado deja los tres `tsc` en verde, los dos
 * auditores del paquete también —miden identidad de símbolos importados, no
 * literales— y el usuario recibe el código crudo en pantalla en vez de su
 * frase. Los límites que estos códigos reportan (`ALBUM_ACCESS_PASSWORD_*`) ya
 * viajaban por el paquete; los códigos se habían quedado atrás.
 */
exports.ALBUM_PASSWORD_TOO_SHORT_CODE = 'ALBUM_PASSWORD_TOO_SHORT';
