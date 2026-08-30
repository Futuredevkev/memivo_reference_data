/**
 * Un formato de documento que el chat acepta: su MIME y las extensiones con
 * las que llega.
 *
 * Van juntos porque las dos caras se necesitan y no se pueden derivar una de
 * la otra: el selector del teléfono filtra por MIME, la clasificación del
 * `ResourceType` mira el MIME que declara el cliente, y `allowed_formats` —lo
 * único que Cloudinary aplica por request— se escribe en EXTENSIONES. Tenerlos
 * en tablas separadas era la garantía de que un formato entrara en una y no en
 * la otra.
 */
export interface ChatDocumentKind {
  readonly mimeType: string;
  /**
   * Las extensiones de este MIME. Son varias en los formatos de Office viejos
   * y una sola en el resto.
   */
  readonly extensions: readonly string[];
}
