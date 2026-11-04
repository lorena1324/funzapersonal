# Registro de Asistencia por Turno · INLOTRANS PEPSICO MP

- **`index.html`**: el formulario donde el supervisor registra la fecha, el turno (T1, T2 o T3) y las personas que asistieron (nombre, cédula y cargo).
- **`admin.html`**: el panel de administración, protegido con un PIN. Muestra quién vino en cada turno, permite filtrar por fecha, turno o nombre, descargar la información a Excel (CSV) y eliminar registros.
- **Almacenamiento**: Google Sheets, a través de Google Apps Script. Mientras no lo configures, todo se guarda solo en el navegador (modo prueba).

## 1. Conectar con Google Sheets (una sola vez)

1. Crea una hoja de cálculo nueva en Google Sheets, por ejemplo **"Asistencia INLOTRANS PEPSICO MP"**.
2. Abre **Extensiones → Apps Script**.
3. Borra el contenido de `Code.gs` y pega el de [`apps-script/Code.gs`](apps-script/Code.gs). Guarda.
4. Haz clic en **Implementar → Nueva implementación**:
   - Tipo: **Aplicación web**
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**
5. Autoriza los permisos y copia la **URL de la aplicación web**. Termina en `/exec`.
6. Pega esa URL en [`config.js`](config.js), en `APPS_SCRIPT_URL`.
7. Cambia `ADMIN_PIN` en `config.js` por tu propio PIN.

La hoja **Asistencia** se crea sola con el primer registro, con una fila por persona.

> Si después cambias `Code.gs`, ve a **Implementar → Gestionar implementaciones → Editar → Nueva versión**. Si no lo haces, los cambios no se aplican.

## 2. Publicar con GitHub Pages

En el repositorio, entra a **Settings → Pages**. En *Source* elige **Deploy from a branch**, rama `main` y carpeta `/ (root)`. Queda disponible en:

- Formulario: `https://lorena1324.github.io/funzapersonal/`
- Admin: `https://lorena1324.github.io/funzapersonal/admin.html`

## Nota de seguridad

El PIN del admin está en `config.js`, que es público, así que solo evita entradas casuales y no es una protección real. Cualquiera que tenga la URL del Apps Script puede leer los datos. Para controlar el acceso de verdad, comparte solo la hoja de Google con las personas autorizadas y revisa la información desde ahí.
