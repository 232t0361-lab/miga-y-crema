# Guía para explicar el proyecto

La aplicación utiliza HTML para la estructura, CSS para el diseño y JavaScript para las acciones. No necesita un framework ni un proceso de compilación.

## Cómo está dividido

- `index.html`: contiene el login, el menú, el carrito y las ventanas de pedidos.
- `catalogo.js`: contiene el arreglo de productos. Cada uno tiene nombre, precio, imagen, descripción, categoría y tipo.
- `app.js`: muestra los productos, busca por nombre, calcula cantidades y prepara el resumen del pedido.
- `auth.js`: comprueba el acceso de demostración y muestra las opciones que corresponden al cliente o al administrador.
- `orders.js`: guarda y consulta los pedidos; también permite revisar el comprobante.
- `gallery.js`: cambia las imágenes del carrusel y abre las historias.

## Categorías del menú

`categoria` indica el filtro principal: `postres`, `bebidas` o `desayunos`.

`tipo` indica el título bajo el que se muestra el producto: `postres`, `calientes`, `frias` o `desayunos`. Estos valores están escritos en el catálogo para que sea sencillo cambiar un producto de sección. Se mantuvo la clasificación de bebidas de la versión original.

`renderProducts()` recorre los productos con un ciclo, selecciona los que coinciden con la búsqueda y los muestra debajo de su título. Cuando se ordena por precio, se respeta cada sección.

## Ejemplo: agregar al carrito

1. El cliente escribe una cantidad y pulsa Agregar.
2. `agregarProducto()` comprueba que la cantidad esté entre 1 y 99.
3. `buscarEnCarrito()` revisa si el producto ya está agregado.
4. Si existe, se suma la cantidad; si no, se agrega un elemento al arreglo `cart`.
5. `saveCart()` guarda el arreglo y `renderCart()` actualiza el contenido y el botón flotante.

El subtotal se calcula recorriendo el carrito y sumando `precio * cantidad` para cada producto.

## Cliente y administrador

Las dos cuentas están en el arreglo `usuariosDemo` de `auth.js`: `cliente@demo.com` / `cliente123` y `admin@admin.com` / `admin123`. El formulario recorre ese arreglo y comprueba correo y contraseña. El botón de cliente demo usa el mismo formulario. El acceso como invitado sigue disponible.

`esAdministrador()` revisa el rol de la sesión. `applySession()` muestra u oculta el botón de administración. `abrirAdministracion()` vuelve a comprobar el rol antes de abrir la ventana. La tabla general de pedidos no se llena para un cliente.

Esta separación corresponde a la interfaz de la demostración. Un sistema con cuentas reales necesita comprobar las credenciales y los permisos en un servidor; esconder un botón no reemplaza esa comprobación.

## Datos guardados

`localStorage` conserva el carrito y el historial dentro del navegador. `sessionStorage` conserva la sesión de la pestaña. Se usan `JSON.stringify()` y `JSON.parse()` para convertir entre arreglos/objetos y texto.

Los comentarios del código explican cada bloque. Las funciones se mantienen separadas para poder explicar una acción a la vez sin mezclar el catálogo, la sesión y los pedidos.
