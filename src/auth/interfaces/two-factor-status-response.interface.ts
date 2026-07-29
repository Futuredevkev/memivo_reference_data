export interface TwoFactorStatusResponse {
  enabled: boolean;
  /**
   * Cuántos códigos de respaldo quedan sin usar (H-017).
   *
   * Sin este número la pantalla no puede avisar nada: los códigos se muestran
   * UNA sola vez al activar 2FA y después el usuario no tiene forma de saber si
   * le queda alguno. Quedarse sin códigos y perder el autenticador a la vez
   * deja la cuenta irrecuperable desde la app, así que el contador es la
   * profilaxis: se avisa antes, no después.
   *
   * `0` cuando 2FA está apagado.
   */
  remainingBackupCodes: number;
}
