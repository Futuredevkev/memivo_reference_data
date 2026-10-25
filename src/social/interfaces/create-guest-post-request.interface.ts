export interface CreateGuestPostRequest {
  description: string;
  /**
   * Pedido de avisarle a todo el álbum con esta publicación. Es un PEDIDO, no
   * una autoridad: el servidor decide si quien publica organiza el álbum y si
   * el tope lo deja, y si no, publica igual y dice por qué no avisó.
   */
  announce?: boolean;
}
