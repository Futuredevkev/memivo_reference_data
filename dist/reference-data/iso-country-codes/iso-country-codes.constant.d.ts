/**
 * Fuente ÚNICA de verdad de los códigos de país ISO-3166-1 alpha-2 que Memivo
 * soporta. La consumen `memivo_client` (arma el selector de país) y `memivo_api`
 * (valida el país elegido con `@IsIn`). NO duplicar esta lista en los repos:
 * ambos re-exportan desde acá para que jamás puedan divergir.
 *
 * Agrupados por continente/región solo para lectura; el orden no importa (el
 * cliente ordena por nombre localizado y el server solo valida pertenencia).
 */
export declare const ISO_COUNTRY_CODES: readonly ["AD", "AL", "AM", "AT", "AZ", "BA", "BE", "BG", "BY", "CH", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GB", "GE", "GR", "HR", "HU", "IE", "IS", "IT", "LI", "LT", "LU", "LV", "MC", "MD", "ME", "MK", "MT", "NL", "NO", "PL", "PT", "RO", "RS", "RU", "SE", "SI", "SK", "SM", "UA", "VA", "AO", "BF", "BI", "BJ", "BW", "CD", "CF", "CG", "CI", "CM", "CV", "DJ", "DZ", "EG", "ER", "ET", "GA", "GH", "GM", "GN", "GQ", "GW", "KE", "KM", "LR", "LS", "LY", "MA", "MG", "ML", "MR", "MU", "MW", "MZ", "NA", "NE", "NG", "RW", "SC", "SD", "SL", "SN", "SO", "SS", "ST", "SZ", "TD", "TG", "TN", "TZ", "UG", "ZA", "ZM", "ZW", "AE", "AF", "BD", "BH", "BN", "BT", "CN", "HK", "ID", "IL", "IN", "IQ", "IR", "JO", "JP", "KG", "KH", "KP", "KR", "KW", "KZ", "LA", "LB", "LK", "MM", "MN", "MV", "MY", "NP", "OM", "PH", "PK", "PS", "QA", "SA", "SG", "SY", "TH", "TJ", "TL", "TM", "TR", "TW", "UZ", "VN", "YE", "AG", "AI", "AR", "AS", "AW", "BB", "BM", "BO", "BR", "BS", "BZ", "CA", "CK", "CL", "CO", "CR", "CU", "DM", "DO", "EC", "GD", "GL", "GT", "GY", "HN", "HT", "JM", "KN", "KY", "LC", "MX", "NI", "PA", "PE", "PY", "SR", "SV", "TT", "US", "UY", "VC", "VE", "AU", "FJ", "FM", "KI", "NR", "NZ", "PG", "PW", "SB", "TO", "TV", "VU", "WS"];
