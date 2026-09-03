export interface PublicResourceUploadLimit {
    maxFileSize: number;
    maxDurationSeconds?: number;
    /**
     * Las extensiones que ese tipo de recurso acepta.
     *
     * Vive acá, en la misma fila que el tope de bytes, y no en una tabla aparte,
     * porque las dos contestan la misma pregunta —«¿qué se puede subir como
     * esto?»— y separarlas es lo que dejaría que una fila nueva declare el peso y
     * se olvide del formato. Es además lo que el api firma como `allowed_formats`
     * en la subida directa, que es el único tope que Cloudinary aplica por
     * request.
     */
    formats: readonly string[];
}
