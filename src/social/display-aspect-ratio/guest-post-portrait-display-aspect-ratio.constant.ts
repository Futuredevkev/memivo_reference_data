/**
 * Presets de aspect ratio para mostrar posts de invitado (estilo feed). El campo
 * `displayAspectRatio` viaja por el wire: la API lo produce ajustándolo al preset
 * más cercano antes de persistir y el cliente lo re-ajusta al renderizar. AMBOS
 * lados deben snapear IGUAL para coincidir, por eso el catálogo y el algoritmo
 * viven acá. Los límites `@Min`/`@Max` de validación del servidor quedan del lado
 * de la API: el cliente no puede violarlos porque siempre snapea a un preset.
 */
export const GUEST_POST_PORTRAIT_DISPLAY_ASPECT_RATIO = 4 / 5;
