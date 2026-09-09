'use strict';

// 1. Funciones pequeñas que se usan en distintas partes de la página.
function money(cantidad) {
  return cantidad.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN'
  });
}

// Quita los acentos para encontrar "café" aunque se escriba "cafe".
function clean(texto) {
  return String(texto).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// Muestra los textos como texto, sin interpretarlos como etiquetas HTML.
function escapeHTML(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

let toastTimer;
function toast(mensaje) {
  const aviso = document.getElementById('toast');
  aviso.textContent = mensaje;
  aviso.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    aviso.hidden = true;
  }, 2600);
}

// 2. Preparamos el catálogo. La categoría y el tipo están en catalogo.js.
const products = [];
for (let i = 0; i < postres.length; i++) {
  const producto = Object.assign({}, postres[i]);
  producto.id = i;
  producto.category = producto.categoria;
  producto.label = producto.nombre;

  // Algunos desayunos tienen el mismo nombre: distinguimos sus opciones.
  let coincidencias = 0;
  let opcion = 0;
  for (let j = 0; j < postres.length; j++) {
    if (postres[j].nombre === producto.nombre) {
      coincidencias++;
      if (j <= i) opcion++;
    }
  }
  if (coincidencias > 1) {
    producto.label = producto.nombre + ' · Opción ' + opcion;
  }
  products.push(producto);
}

const seccionesMenu = [
  { tipo: 'postres', titulo: 'Postres artesanales' },
  { tipo: 'calientes', titulo: 'Bebidas calientes' },
  { tipo: 'frias', titulo: 'Bebidas frías' },
  { tipo: 'desayunos', titulo: 'Desayunos y detalles' }
];
let category = 'todos';
let cart = [];

// Conservamos los carritos que ya estaban guardados, incluso con rutas img/.
function cargarCarrito() {
  try {
    const guardados = JSON.parse(localStorage.getItem('miga_cart') || '[]');
    if (!Array.isArray(guardados)) return;

    for (const guardado of guardados) {
      if (!guardado || !Number.isInteger(guardado.cantidad) || guardado.cantidad < 1) continue;
      const imagen = String(guardado.imagen).replace(/^img\//, 'assets/images/');
      for (const producto of products) {
        if (producto.nombre !== guardado.nombre || producto.imagen !== imagen) continue;
        let existente = buscarEnCarrito(producto.id);
        if (existente) {
          existente.cantidad = Math.min(99, existente.cantidad + guardado.cantidad);
        } else {
          const nuevo = Object.assign({}, producto);
          nuevo.cantidad = Math.min(99, guardado.cantidad);
          cart.push(nuevo);
        }
        break;
      }
    }
  } catch {
    cart = [];
  }
}

function buscarEnCarrito(id) {
  for (const producto of cart) {
    if (producto.id === id) return producto;
  }
  return null;
}

// 3. Dibujamos las tarjetas, agrupadas bajo sus títulos.
function tarjetaProducto(producto, titulo) {
  return `
    <article class="product">
      <div class="product-image">
        <img src="${escapeHTML(producto.imagen)}" alt="${escapeHTML(producto.label)}" loading="lazy">
        <span class="product-tag">${titulo}</span>
      </div>
      <div class="product-body">
        <h3>${escapeHTML(producto.label)}</h3>
        <p>${escapeHTML(producto.descripcion)}</p>
        <label class="product-quantity">Cantidad
          <input id="quantity-${producto.id}" type="number" min="1" max="99" value="1" step="1"
            aria-label="Cantidad de ${escapeHTML(producto.label)}">
        </label>
        <div class="product-bottom">
          <strong>${money(producto.precio)}</strong>
          <button class="add" data-add="${producto.id}" aria-label="Agregar ${escapeHTML(producto.label)}">+ Agregar</button>
        </div>
      </div>
    </article>`;
}

function renderProducts() {
  const busqueda = clean(document.getElementById('search').value.trim());
  const orden = document.getElementById('sort').value;
  const encontrados = [];

  for (const producto of products) {
    const coincideCategoria = category === 'todos' || producto.category === category;
    const coincideTexto = clean(producto.nombre + ' ' + producto.descripcion).includes(busqueda);
    if (coincideCategoria && coincideTexto) encontrados.push(producto);
  }

  // El precio se ordena dentro de cada sección, sin mezclar frías y calientes.
  if (orden === 'asc') {
    encontrados.sort(function (a, b) { return a.precio - b.precio; });
  }
  if (orden === 'desc') {
    encontrados.sort(function (a, b) { return b.precio - a.precio; });
  }

  let contenido = '';
  for (const seccion of seccionesMenu) {
    let tarjetas = '';
    let cantidad = 0;
    for (const producto of encontrados) {
      if (producto.tipo === seccion.tipo) {
        tarjetas += tarjetaProducto(producto, seccion.titulo);
        cantidad++;
      }
    }
    if (cantidad > 0) {
      contenido += `
        <section class="menu-group" aria-labelledby="titulo-${seccion.tipo}">
          <div class="menu-group-heading">
            <h3 id="titulo-${seccion.tipo}">${seccion.titulo}</h3>
            <span>${cantidad} productos</span>
          </div>
          <div class="products">${tarjetas}</div>
        </section>`;
    }
  }

  if (encontrados.length === 0) {
    contenido = '<div class="empty"><strong>No encontramos ese antojo</strong>Prueba otro nombre o cambia de categoría.</div>';
  }
  document.getElementById('results').textContent = encontrados.length + ' productos para disfrutar · Precios en MXN';
  document.getElementById('products').innerHTML = contenido;
}

function cambiarCategoria(boton) {
  category = boton.dataset.category;
  for (const opcion of document.querySelectorAll('[data-category]')) {
    const seleccionada = opcion === boton;
    opcion.classList.toggle('active', seleccionada);
    opcion.setAttribute('aria-pressed', String(seleccionada));
  }
  renderProducts();
}

// 4. Agregar, quitar y guardar productos del carrito.
function total() {
  let suma = 0;
  for (const producto of cart) suma += producto.precio * producto.cantidad;
  return suma;
}

function saveCart() {
  try {
    localStorage.setItem('miga_cart', JSON.stringify(cart));
  } catch {
    toast('Tu carrito funciona, pero este navegador no pudo guardarlo.');
  }
  renderCart();
}

function agregarProducto(id) {
  const producto = products[id];
  const entrada = document.getElementById('quantity-' + id);
  const cantidad = Number(entrada.value);
  if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 99) {
    entrada.reportValidity();
    return;
  }

  const existente = buscarEnCarrito(id);
  let cantidadActual = 0;
  if (existente) cantidadActual = existente.cantidad;
  if (cantidadActual + cantidad > 99) {
    toast('Puedes agregar hasta 99 unidades por producto.');
    return;
  }
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    const nuevo = Object.assign({}, producto);
    nuevo.cantidad = cantidad;
    cart.push(nuevo);
  }
  saveCart();
  toast(producto.label + ' se agregó a tu pedido');
}

function quitarProducto(id) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      cart.splice(i, 1);
      break;
    }
  }
}

function renderCart() {
  let cantidad = 0;
  let contenido = '';
  for (const producto of cart) {
    cantidad += producto.cantidad;
    let deshabilitado = '';
    if (producto.cantidad >= 99) deshabilitado = 'disabled';
    contenido += `
      <div class="cart-row">
        <img src="${escapeHTML(producto.imagen)}" alt="${escapeHTML(producto.label)}">
        <div class="cart-row-body">
          <h3>${escapeHTML(producto.label)}</h3>
          <span class="cart-row-price">${money(producto.precio * producto.cantidad)} · ${money(producto.precio)} c/u</span>
          <div class="quantity">
            <button data-change="${producto.id}" data-delta="-1" aria-label="Quitar una unidad de ${escapeHTML(producto.label)}">−</button>
            <input type="number" min="1" max="99" step="1" value="${producto.cantidad}"
              data-quantity="${producto.id}" aria-label="Cantidad de ${escapeHTML(producto.label)}">
            <button data-change="${producto.id}" data-delta="1" ${deshabilitado} aria-label="Agregar una unidad de ${escapeHTML(producto.label)}">+</button>
            <button class="remove" data-remove="${producto.id}" aria-label="Eliminar ${escapeHTML(producto.label)}">Eliminar</button>
          </div>
        </div>
      </div>`;
  }
  if (cart.length === 0) {
    contenido = '<div class="empty"><strong>Tu próximo antojo te espera</strong>Agrega algo rico del menú para empezar tu pedido.</div>';
  }
  document.getElementById('cart-items').innerHTML = contenido;
  document.getElementById('cart-count').textContent = cantidad;
  document.getElementById('floating-count').textContent = cantidad;
  document.getElementById('cart-total').textContent = money(total());
  document.getElementById('floating-total').textContent = money(total());
  document.getElementById('floating-cart').setAttribute('aria-label', 'Ver mi carrito: ' + cantidad + ' productos, ' + money(total()));
  document.getElementById('clear-cart').disabled = cart.length === 0;
  document.getElementById('checkout-button').disabled = cart.length === 0;
}

// 5. Resumen y solicitud por WhatsApp.
function abrirResumen() {
  if (cart.length === 0) return;
  let contenido = '';
  for (const producto of cart) {
    contenido += `
      <div class="summary-item">
        <span>${producto.cantidad} × ${escapeHTML(producto.label)}</span>
        <span>${money(producto.precio * producto.cantidad)}</span>
      </div>`;
  }
  document.getElementById('checkout-items').innerHTML = contenido;
  document.getElementById('checkout-total').textContent = money(total());
  document.getElementById('cart-dialog').close();
  document.getElementById('checkout-dialog').showModal();
}

function prepararPedido(evento) {
  evento.preventDefault();
  if (cart.length === 0) return;
  const datos = new FormData(evento.currentTarget);
  const nombre = datos.get('nombre').trim();
  const telefono = datos.get('telefono').trim();
  const direccion = datos.get('direccion').trim();
  const domicilio = datos.get('entrega') === 'domicilio';

  if (!nombre || telefono.replace(/\D/g, '').length < 10 || (domicilio && !direccion)) {
    toast('Revisa tu nombre, teléfono y dirección de entrega.');
    return;
  }

  let mensaje = '¡Hola, Miga y Crema! Me gustaría solicitar este pedido:\n';
  for (const producto of cart) {
    mensaje += producto.cantidad + ' × ' + producto.label + ' — ' + money(producto.precio * producto.cantidad) + '\n';
  }
  mensaje += '\nSubtotal: ' + money(total()) + ' MXN';
  mensaje += '\nNombre: ' + nombre;
  mensaje += '\nTeléfono: ' + telefono;
  if (domicilio) mensaje += '\nEntrega: A domicilio: ' + direccion;
  else mensaje += '\nEntrega: Recoger en el local';
  if (datos.get('pago') === 'efectivo') mensaje += '\nPago: Efectivo';
  else mensaje += '\nPago: Transferencia bancaria';
  if (datos.get('notas').trim()) mensaje += '\nNotas: ' + datos.get('notas').trim();
  mensaje += '\n¿Me confirman disponibilidad, horario y total con envío si aplica?';

  if (!savePendingOrder(datos)) return;
  window.open('https://wa.me/522321237364?text=' + encodeURIComponent(mensaje), '_blank', 'noopener,noreferrer');
}

// 6. Conectamos los botones con las funciones anteriores.
for (const boton of document.querySelectorAll('[data-category]')) {
  boton.addEventListener('click', function () { cambiarCategoria(boton); });
}
document.getElementById('search').addEventListener('input', renderProducts);
document.getElementById('sort').addEventListener('change', renderProducts);
document.getElementById('products').addEventListener('click', function (evento) {
  const boton = evento.target.closest('[data-add]');
  if (boton) agregarProducto(Number(boton.dataset.add));
});
document.getElementById('cart-items').addEventListener('click', function (evento) {
  const boton = evento.target.closest('button');
  if (!boton) return;
  if (boton.dataset.remove !== undefined) quitarProducto(Number(boton.dataset.remove));
  if (boton.dataset.change !== undefined) {
    const producto = buscarEnCarrito(Number(boton.dataset.change));
    if (producto) {
      producto.cantidad = Math.min(99, producto.cantidad + Number(boton.dataset.delta));
      if (producto.cantidad < 1) quitarProducto(producto.id);
    }
  }
  saveCart();
});
document.getElementById('open-cart').addEventListener('click', function () {
  document.getElementById('cart-dialog').showModal();
});
for (const boton of document.querySelectorAll('[data-close]')) {
  boton.addEventListener('click', function () {
    document.getElementById(boton.dataset.close).close();
  });
}
for (const ventana of document.querySelectorAll('dialog')) {
  ventana.setAttribute('aria-label', ventana.querySelector('h2').textContent);
  ventana.addEventListener('click', function (evento) {
    const limites = ventana.getBoundingClientRect();
    const fuera = evento.clientX < limites.left || evento.clientX > limites.right || evento.clientY < limites.top || evento.clientY > limites.bottom;
    if (evento.target === ventana && fuera) ventana.close();
  });
}
document.getElementById('checkout-button').addEventListener('click', abrirResumen);
document.getElementById('edit-cart').addEventListener('click', function () {
  document.getElementById('checkout-dialog').close();
  document.getElementById('cart-dialog').showModal();
});
document.getElementById('delivery').addEventListener('change', function () {
  const domicilio = this.value === 'domicilio';
  document.getElementById('address-label').hidden = !domicilio;
  document.getElementById('address').required = domicilio;
});
document.getElementById('checkout-form').addEventListener('submit', prepararPedido);

cargarCarrito();
renderProducts();
renderCart();