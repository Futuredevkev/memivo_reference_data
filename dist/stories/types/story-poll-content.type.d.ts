import type { CreateStoryPollRequest } from '../interfaces/create-story-poll-request.interface';
/**
 * El CONTENIDO de una encuesta de historia, sin dónde va.
 *
 * Existe porque las dos cosas se deciden en momentos distintos y con gestos
 * distintos: la pregunta y las opciones se escriben en un formulario, y la
 * posición se elige arrastrando la encuesta sobre la foto. Separarlas evita que
 * el formulario tenga que inventar coordenadas para poder devolver algo.
 *
 * Se deriva de `CreateStoryPollRequest` en vez de declararse aparte para que
 * agregarle un campo al contrato no deje este tipo atrás en silencio.
 */
export type StoryPollContent = Omit<CreateStoryPollRequest, 'x' | 'y'>;
