export interface RegenerateBackupCodesResponse {
    /**
     * Los códigos NUEVOS, en claro y por única vez. Regenerar INVALIDA los
     * anteriores: es la salida para quien gastó los suyos o cree que se
     * filtraron, y hasta acá no existía ninguna (H-224).
     */
    backupCodes: string[];
    message: string;
}
