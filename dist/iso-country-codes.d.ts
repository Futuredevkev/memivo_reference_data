/**
 * Fuente ÚNICA de verdad de los códigos de país ISO-3166-1 alpha-2 que Memivo
 * soporta. La consumen `memivo_client` (arma el selector de país) y `memivo_api`
 * (valida el país elegido con `@IsIn`). NO duplicar esta lista en los repos:
 * ambos re-exportan desde acá para que jamás puedan divergir.
 *
 * Agrupados por continente/región solo para lectura; el orden no importa (el
 * cliente ordena por nombre localizado y el server solo valida pertenencia).
 */
export declare const ISO_COUNTRY_CODES: readonly string[];
