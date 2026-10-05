# Workspace de CI

`repositories.json` decide el corpus y `workspace.cjs` decide la adquisicion y
alineacion. GitHub Actions conserva su checkout nativo y la limpieza de sus
credenciales. El repositorio que dispara la corrida conserva
su SHA; los hermanos usan la candidata cuando existe y el HEAD remoto si falta.
Un checkout faltante o con origin desviado corta; no hay clonados manuales ni
alias de directorios que puedan ocultar un layout incorrecto.

El disparo cross-repo vive en la accion hermana `dispatch-ssot`: espera el id
devuelto por la API, nunca la primera corrida posterior a una fecha. Ejecuta el
workflow de la misma ref versionada de la accion, no el workflow viejo de `main`.
La respuesta sin id, el rechazo de autenticacion, un auditor rojo o una espera
agotada cortan el job. La capacidad esta documentada en
[GitHub workflow dispatch](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event).

El runtime de los gates y del dispatch vive en `.node-version` en la raiz de este
repositorio. Es un pin completo para que local y Actions no prueben
patches distintos sin advertirlo. No cambia el runtime del servidor desplegado ni
el motor JavaScript de los binarios moviles.
La adquisicion del workspace es bootstrap: usa el Node preinstalado del runner
antes de instalar el pin. No ejecuta gates ni requiere `fs.globSync`.

## Decision del 4 de octubre de 2026

Se eligio Node 24.16.0, el LTS instalado y probado en el workspace. La corrida
completa del cliente con ese runtime paso. Node 20, fuera de soporte, era el
runtime del workflow que fallo con el recorrido privado de `fs.globSync`.
Ese recorrido se elimino: el gate de copy usa ahora el dueño `sourceTree`.

La prueba alternativa con Node 22.23.3 encontro timeouts de desmontaje de React
que contaminaron suites posteriores; las suites sin reloj falso pasaron aisladas.
El perfil del proceso mostro una espera, no un bucle de JavaScript. No se establecio
la causa interna de esa diferencia y no se afirma compatibilidad del harness con
Node 22. No se ampliaron timeouts ni se deshabilitaron casos para elegir el pin.

Antes de cambiar el pin hay que repetir los quality completos, los auditores y
los carriles nativos con el runtime candidato. Referencias del soporte:
[Node LTS](https://nodejs.org/en/about/previous-releases) y
[minimo de Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/).

El dueño retiro Codemagic el 4 de octubre de 2026. Los builds moviles usan EAS;
esta accion prepara los jobs de calidad de GitHub, no publica builds de tienda.
