import type { EmailRequest } from './email-request.interface';
/**
 * El reset NO lleva `confirmPassword` (P6), por el mismo motivo que el alta:
 * quien llegó hasta acá ya probó que controla el buzón —tuvo que transcribir el
 * código que le llegó— así que un typo en la contraseña nueva se arregla
 * repitiendo el flujo, no bloqueando el que está en curso. El ojo de «mostrar
 * contraseña» cubre el typo mientras se escribe.
 */
export interface ResetPasswordRequest extends EmailRequest {
    code: string;
    password: string;
}
