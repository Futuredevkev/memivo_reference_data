# @memivo/contracts

Fuente única de verdad de los contratos públicos que deben interpretar igual
`memivo_api` y `memivo_client`.

El repositorio conserva el nombre histórico `memivo_reference_data`, pero el
paquete es `@memivo/contracts`. Además de países ISO contiene catálogos, eventos
y payloads de sockets, códigos de error, validaciones públicas, límites de
uploads y shapes de transporte compartidos.

## Qué pertenece acá

Un valor o tipo entra al paquete cuando cumple al menos una de estas reglas:

1. API lo produce y cliente lo consume.
2. Cliente lo envía y API lo valida.
3. Ambos lados toman decisiones de runtime usando el mismo catálogo.
4. Es una regla pública que la UI anticipa y el servidor hace cumplir.

No pertenecen acá entidades ORM, decoradores ni clases ejecutables de Nest,
servicios, SQL, límites operativos, configuración de Sentry, transforms
privados de Cloudinary ni parámetros puramente visuales del cliente. El shape
wire de un DTO sí pertenece: la clase del API implementa la interfaz compartida
y el cliente consume esa misma interfaz.

## Estructura

Cada dominio mantiene sus categorías separadas y expone un barrel `index.ts`:

```text
src/
  album/          enums + interfaces
  auth/           constants + enums + interfaces
  chat/           constants + enums + interfaces
  common/         enums + interfaces
  errors/         un catálogo por dominio + consolidado
  highlights/     interfaces
  media/          constants + enums + interfaces + types
  notifications/  enums + interfaces
  reactions/      constants + enums + interfaces
  reference-data/ catálogos estáticos + type guards
  reports/        enums + interfaces
  sockets/        constants + interfaces
  stories/        interfaces
  validation/     límites + patrones + contraseñas comunes
```

El root exporta todo y también hay subpaths estables, por ejemplo
`@memivo/contracts/auth`, `@memivo/contracts/errors`,
`@memivo/contracts/media` y `@memivo/contracts/sockets`.

## Consumo

Las dependencias de release se instalan por tag y sobre HTTPS, para que
instalaciones, VPS y CI no dependan de una clave SSH:

```json
{
  "dependencies": {
    "@memivo/contracts": "github:Futuredevkev/memivo_reference_data#v4.0.0"
  }
}
```

```ts
import { ErrorCode, ISO_COUNTRY_CODES } from '@memivo/contracts';
import { RegistrationPayload } from '@memivo/contracts/auth';
import { RESOURCE_UPLOAD_LIMITS } from '@memivo/contracts/media';
import { ALBUM_SOCKET_EVENTS } from '@memivo/contracts/sockets';
```

Durante desarrollo coordinado de los tres repos puede usarse temporalmente
`file:../memivo-reference-data`; nunca debe quedar así en una rama de release.

## Calidad y publicación

```bash
npm install
npm run build
npm test
npm run audit:consumers
npm run audit:transport
```

`audit:consumers` recorre los AST de API y cliente y falla ante contratos
duplicados no clasificados, códigos de error desconocidos o literales, errores
sin traducción, exports compartidos muertos o valores de runtime que eluden el
catálogo. `audit:consumers:verbose` muestra cada frontera intencional (por
ejemplo, entidad ORM vs modelo normalizado o `Platform.OS` vs plataforma de
sesión).

`audit:transport` revisa las superficies de transporte: exige tipos de retorno
**nombrados** en los controllers y prohíbe payloads de socket, respuestas de
axios y query params declarados como object literals inline.

> Un símbolo nuevo aparece en `unusedSharedExports` hasta que un consumidor lo
> importa. Publicar un contrato antes que el código que lo usa deja ese gate en
> rojo a propósito; se cierra cuando aterrizan los consumidores, no silenciándolo.

El build limpia `dist/` antes de compilar. `dist/` se commitea a propósito: es
CommonJS con declaraciones `.d.ts`, por lo que Metro y NestJS pueden instalar el
paquete directamente desde Git sin ejecutar TypeScript.

Para publicar:

1. Modificar `src/` y tests.
2. Ejecutar build, tests y las dos auditorías.
3. Commitear también `dist/`.
4. Crear y pushear el tag semántico.
5. Actualizar API y cliente al mismo tag HTTPS y regenerar sus lockfiles.
6. Verificar instalación limpia y los builds de ambos consumidores.
