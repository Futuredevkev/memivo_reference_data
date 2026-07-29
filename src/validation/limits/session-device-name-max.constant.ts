/**
 * Tope de `deviceName` en el alta de sesión. Es un límite de CABLE y por eso
 * vive acá: lo escribe el sistema operativo (el nombre que el usuario le puso
 * al equipo) y, si se pasa, el ValidationPipe rechaza con 400 los CUATRO
 * endpoints que crean sesión — o sea que la persona no puede entrar por ningún
 * camino, con el mensaje crudo de class-validator en inglés. El consumidor
 * tiene que poder truncar antes de mandarlo.
 */
export const SESSION_DEVICE_NAME_MAX_LENGTH = 120;
