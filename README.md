# @memivo/reference-data

**Fuente única de verdad** de los datos de referencia compartidos entre
`memivo_client` y `memivo_api`. Hoy: la lista canónica de códigos de país
ISO-3166-1 alpha-2. Mañana: monedas, idiomas soportados, etc.

Existe para que la lista de códigos **no viva duplicada** en los dos repos (y no
puedan divergir → nunca un país que el cliente ofrece y el server rechaza).

## Consumo

Ambos repos lo instalan como dependencia de git (repo público, sin registry ni
tokens):

```jsonc
// package.json de memivo_client y memivo_api
"dependencies": {
  "@memivo/reference-data": "github:Futuredevkev/memivo_reference_data#v1.0.1"
}
```

```ts
import { ISO_COUNTRY_CODES } from '@memivo/reference-data';
```

- **client** re-exporta `ISO_COUNTRY_CODES` como `ISO_CODES` para armar el picker.
- **api** re-exporta como `VALID_COUNTRY_CODES` para el `@IsIn(...)` de los DTOs.

## Publicar un cambio

1. Editar `src/`, correr `npm run build && npm test`.
2. Commitear **incluyendo `dist/`** (se commitea a propósito: así el consumidor
   instala sin toolchain de build).
3. `git tag vX.Y.Z && git push --tags`.
4. Bumpear el `#vX.Y.Z` en el `package.json` de ambos repos + `npm install`.

## Build

`dist/` es CommonJS + `.d.ts`, consumible por Metro (client) y NestJS (api).

```bash
npm install   # trae typescript (devDep)
npm run build # tsc → dist/
npm test      # node --test (zero deps)
```
