/**
 * Estado de un reporte de perfil. Viaja por el cable en la superficie de
 * moderación, así que su fuente de verdad es el paquete y no el servidor.
 */
export enum ProfileReportStatus {
  OPEN = 'open',
  REVIEWED = 'reviewed',
  DISMISSED = 'dismissed',
}
