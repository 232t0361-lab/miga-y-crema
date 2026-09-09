# Miga y Crema

Tienda de repostería con HTML, CSS y JavaScript, sin herramientas de compilación ni dependencias de npm.

## Abrir el proyecto

Abre `index.html` en el navegador o usa el servidor local que ya utilices. No necesitas instalar paquetes. Mantén el mismo origen/puerto para conservar los datos del navegador.

## Estructura

```text
index.html                 Pantallas y entrada principal
assets/
  css/style.css            Diseño y adaptación a pantallas pequeñas
  js/catalogo.js           Catálogo, categorías y precios
  js/app.js                Menú, búsqueda, carrito y resumen de WhatsApp
  js/auth.js               Login, sesión y controles del carrito
  js/orders.js             Historial, administración y comprobante
  js/gallery.js            Historias y carrusel
  images/                  Fotografías utilizadas por la aplicación
  documents/               Menú PDF
docs/
  previews/               Capturas de diseño
  funcionalidades.md      Funciones disponibles
  guia-del-codigo.md      Explicación del código para la tesis
tests/                     Pruebas de regresión en navegador
```

## Login de demostración

- Administrador: `admin@admin.com` / `admin123`.
- Cliente demo: `cliente@demo.com` / `cliente123`, o botón **Probar cliente demo**. Tiene acceso al menú, carrito y sus pedidos, sin administración.
- El formulario valida las credenciales de estas dos cuentas. **Continuar como invitado** permite entrar sin cuenta.
- La sesión dura en la pestaña y se conserva al recargar. Cerrar sesión no vacía el carrito.

El botón **Administración** aparece solo en la sesión del administrador y abre una ventana separada. El panel no forma parte del menú público. **Mis pedidos** muestra las solicitudes del cliente que inició sesión.

Este login es una demostración del lado del navegador; no autentica cuentas reales ni protege datos en un servidor. No introduzcas contraseñas personales. No se guardan contraseñas.

## Pedidos y almacenamiento

Se conservan las claves `miga_cart` y `miga_orders`. Los carritos con imágenes en las rutas anteriores `img/` se migran al cargarlos. Los pedidos anteriores aparecen en el panel del administrador, incluso si no tienen el campo de usuario de las solicitudes nuevas. Las solicitudes nuevas aparecen también en **Mis pedidos** del cliente correspondiente.

El botón de WhatsApp guarda una solicitud local pendiente y abre su resumen. No confirma un envío ni un pago. El carrito se conserva para poder corregir o reintentar. El comprobante se puede seleccionar y revisar, pero debe adjuntarse manualmente en WhatsApp.

## Pagos

Están disponibles efectivo y transferencia BBVA para acordar el pago con el negocio. La opción de tarjeta aparece como pendiente de configuración y no realiza cobros. Esta versión no incluye un servidor de pagos.

## Verificación

Abre `tests/regression.html` para ejecutar las pruebas. Usa almacenamiento aislado en la página de prueba y simula WhatsApp: no envía mensajes ni modifica el carrito o historial de la aplicación.

`tests/review-browser.ps1` ejecuta la revisión móvil de 390 px con Edge en Windows y guarda capturas en `docs/previews/`. Es una utilidad de verificación; la aplicación solo usa HTML, CSS y JavaScript. `tests/regression.html` es una copia de la estructura de `index.html` con almacenamiento simulado y el script de pruebas: debe actualizarse si cambias esa estructura.
