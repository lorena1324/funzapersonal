# Registro de Asistencia por Turno · INLOTRANS PEPSICO MP

- **`index.html`**: el formulario para registrar asistencia. Se escoge la fecha y el turno (T1, T2 o T3) y se digita la cédula de cada persona. El nombre y la labor se llenan solos desde `personal.js`.
- **`admin.html`**: el panel de administración, protegido con un PIN que se cambia en `config.js`. Muestra quién vino en cada turno, permite filtrar, descargar en Excel (CSV) y eliminar registros.
- **Almacenamiento**: dentro del aplicativo, en la memoria del navegador del equipo donde se usa. No hay ninguna base de datos externa.

## Importante sobre el almacenamiento

- Los registros quedan guardados **en el equipo y el navegador** donde se llena el formulario. El panel admin muestra lo que se registró en ese mismo equipo y navegador.
- Si se borran los datos de navegación, o si se usa el modo incógnito, los registros se pierden. Por eso hay que usar **Descargar copia de seguridad** en el panel admin con frecuencia.
- Para pasar los registros a otro equipo, descarga la copia de seguridad en el primero y cárgala en el segundo con **Cargar copia de seguridad**. No se duplican registros.

## Personal

Edita `personal.js` para agregar o quitar personas. Cada persona va en una línea: `["cédula", "NOMBRE", "LABOR"]`.

## Publicar con GitHub Pages

Entra a **Settings → Pages**, elige la rama `main` y la carpeta `/ (root)`.

- Formulario: `https://lorena1324.github.io/funzapersonal/`
- Admin: `https://lorena1324.github.io/funzapersonal/admin.html`
