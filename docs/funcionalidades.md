# Funciones conservadas y recuperadas

| Función anterior | Ubicación actual |
| --- | --- |
| Login de cliente y administrador | Pantalla inicial, `assets/js/auth.js` |
| Entrar como cliente y cerrar sesión | Pantalla inicial y encabezado |
| Catálogo completo y precios | `assets/js/catalogo.js` |
| Categorías, búsqueda y orden por precio | Menú |
| Cantidad al agregar un producto | Tarjeta de producto |
| Carrito, cantidades, eliminar y vaciar | Botón flotante y diálogo del carrito |
| Persistencia del carrito | `miga_cart`, con compatibilidad de rutas antiguas |
| Pago rápido | Selector en el carrito, sincronizado con el resumen |
| Recoger o recibir a domicilio | Formulario del pedido |
| Efectivo y transferencia BBVA | Resumen, con datos bancarios originales |
| Comprobante | Selección y vista previa local; adjuntar por WhatsApp |
| Pedido por WhatsApp | Solicitud con productos, importes y datos del cliente |
| Historial y estadísticas del administrador | Administración, con lectura de pedidos antiguos |
| Detalle y eliminar historial | Panel del administrador |
| Historias ampliadas | Círculos de postres, bebidas y desayunos |
| Carrusel | Seis imágenes originales, controles y pausa |
| Mapa, redes y descarga PDF | Ubicación, pie de página y menú |
| Mercado Pago de la página antigua | Opción visible pendiente de servidor; código original respaldado |

Los respaldos en `archive/original/` son fuentes históricas, no entradas de la aplicación. Las imágenes sueltas se guardaron sin eliminar duplicados ni sobrescribir variantes. `archive/server.js` y `archive/miga.css` conservan los archivos que estaban en la raíz antes de organizarla.
