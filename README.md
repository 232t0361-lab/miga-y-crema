# Miga y Crema

Tienda de repostería con HTML, CSS y JavaScript, sin herramientas de compilación ni nuevas dependencias.

## Abrir el proyecto

Abre `index.html` en el navegador o usa el servidor local que ya utilices. `miga.html` conserva la entrada anterior y lleva a la misma aplicación. Mantén el mismo origen/puerto para conservar los datos del navegador.

## Estructura

```text
index.html                 Pantallas y entrada principal
miga.html                  Entrada compatible con la dirección anterior
assets/
  css/style.css            Diseño y adaptación a pantallas pequeñas
  js/catalogo.js           Catálogo original y precios
  js/app.js                Menú, búsqueda, carrito y resumen de WhatsApp
  js/auth.js               Login, sesión y controles del carrito
  js/orders.js             Historial, administración y comprobante
  js/gallery.js            Historias y carrusel
  images/                  Fotografías utilizadas por la aplicación
  documents/               Menú PDF
docs/
  archive/original/        Fuentes recuperadas del último commit anterior
  archive/root-images/     Imágenes que estaban sueltas en la raíz
  archive/                CSS y supuesto servidor anteriores
  previews/               Capturas de diseño
  funcionalidades.md      Correspondencia con las funciones anteriores
tests/                     Pruebas de regresión en navegador
package.json               Dependencias originales conservadas
package-lock.json          Versiones originales conservadas
```

## Login de demostración

- Administrador: `admin@admin.com` / `admin123` (credenciales originales del proyecto).
- Cliente: correo válido y contraseña no vacía, como en la versión original, o botón **Entrar como cliente**.
- La sesión dura en la pestaña y se conserva al recargar. Cerrar sesión no vacía el carrito.

Este login es una demostración del lado del navegador; no autentica cuentas reales ni protege datos en un servidor. No introduzcas contraseñas personales. No se guardan contraseñas.

## Pedidos y almacenamiento

Se conservan las claves `miga_cart` y `miga_orders`. Los carritos con imágenes en las rutas anteriores `img/` se migran al cargarlos. Los pedidos anteriores aparecen en el panel del administrador, incluso si no tienen el campo de usuario de las solicitudes nuevas. Las solicitudes nuevas aparecen también en **Mis pedidos** del cliente correspondiente.

El botón de WhatsApp guarda una solicitud local pendiente y abre su resumen. No confirma un envío ni un pago. El carrito se conserva para poder corregir o reintentar. El comprobante se puede seleccionar y revisar, pero debe adjuntarse manualmente en WhatsApp. Los datos de BBVA se conservaron de la página anterior.

## Servidor y tarjeta

El `server.js` original contenía código del carrusel que usa `document`, no un servidor Express. Se conserva en `docs/archive/` y no se necesita para abrir esta aplicación.

La versión antigua `miga.html` mostraba Mercado Pago, pero llamaba a `/create_preference` en un servidor inexistente. La opción de tarjeta permanece visible como pendiente de configuración. No se presenta como cobro funcional. Las dependencias originales de Express, CORS, Multer y Mercado Pago se conservan sin cambios; habilitar pagos reales requiere completar el servidor y su configuración.

## Verificación

Abre `tests/regression.html` para ejecutar las pruebas. Usa almacenamiento aislado en la página de prueba y simula WhatsApp: no envía mensajes ni modifica el carrito o historial de la aplicación.

`tests/review-browser.ps1` ejecuta la revisión móvil de 390 px con Edge en Windows y guarda capturas en `docs/previews/`. Es una utilidad de verificación; la aplicación solo usa HTML, CSS y JavaScript. `tests/regression.html` es una copia de la estructura de `index.html` con almacenamiento simulado y el script de pruebas: debe actualizarse si cambias esa estructura.
