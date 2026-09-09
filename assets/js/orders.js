'use strict';

// 1. Leer el historial guardado en este navegador.
function readOrders() {
  const guardados = JSON.parse(localStorage.getItem('miga_orders') || '[]');
  if (!Array.isArray(guardados)) throw new Error('No se pudo leer el historial');
  const pedidos = [];
  for (const pedido of guardados) {
    if (pedido && typeof pedido === 'object') pedidos.push(pedido);
  }
  return pedidos;
}

function visibleOrders() {
  if (!currentSession) return [];
  const pedidos = readOrders();
  if (esAdministrador()) return pedidos;
  const propios = [];
  for (const pedido of pedidos) {
    if (pedido.usuario === currentSession.email) propios.push(pedido);
  }
  return propios;
}

function orderRows(pedidos) {
  let filas = '';
  for (let i = pedidos.length - 1; i >= 0; i--) {
    const pedido = pedidos[i];
    filas += `
      <tr>
        <td>${escapeHTML(pedido.id)}</td>
        <td>${escapeHTML(pedido.cliente || 'Cliente')}</td>
        <td>${escapeHTML(new Date(pedido.fecha).toLocaleDateString('es-MX'))}</td>
        <td>${escapeHTML(pedido.metodo || 'Transferencia')}</td>
        <td>${money(Number(pedido.total) || 0)}</td>
        <td><button class="guest-button" data-order="${escapeHTML(pedido.id)}">Ver detalle</button></td>
      </tr>`;
  }
  if (pedidos.length === 0) filas = '<tr><td colspan="6">Aún no hay pedidos guardados.</td></tr>';
  return filas;
}

function renderOrders() {
  const tabla = document.getElementById('orders-tbody');
  tabla.innerHTML = '';
  document.getElementById('admin-carritos').textContent = '0';
  document.getElementById('admin-total-items').textContent = '0';
  try {
    const pedidos = visibleOrders();
    // La tabla del negocio solo se llena al entrar como administrador.
    if (esAdministrador()) {
      document.getElementById('admin-total-items').textContent = products.length;
      document.getElementById('admin-carritos').textContent = pedidos.length;
      tabla.innerHTML = orderRows(pedidos);
    }

    let contenido = '';
    for (let i = pedidos.length - 1; i >= 0; i--) {
      const pedido = pedidos[i];
      if (pedido.usuario !== currentSession.email) continue;
      contenido += `
        <article class="history-card">
          <h3>Pedido ${escapeHTML(pedido.id)}</h3>
          <p>${escapeHTML(new Date(pedido.fecha).toLocaleString('es-MX'))} · ${money(Number(pedido.total) || 0)}</p>
          <p>${escapeHTML(pedido.estado || 'Registro anterior; confirmar con el negocio')}</p>
          <button class="guest-button" data-order="${escapeHTML(pedido.id)}">Ver detalle</button>
        </article>`;
    }
    if (!contenido) contenido = '<p class="empty">Tus solicitudes aparecerán aquí cuando prepares un pedido por WhatsApp.</p>';
    document.getElementById('customer-orders').innerHTML = contenido;
  } catch {
    document.getElementById('customer-orders').textContent = 'No se pudo leer el historial local. No se han borrado tus datos.';
    if (esAdministrador()) tabla.innerHTML = '<tr><td colspan="6">No se pudo leer el historial local.</td></tr>';
  }
}

// 2. Guardar una solicitud sin borrar los pedidos anteriores.
function savePendingOrder(datos) {
  if (!currentSession) return false;
  const comprobante = document.getElementById('comprobante').files[0];
  const borrador = {
    usuario: currentSession.email,
    cliente: datos.get('nombre').trim(),
    telefono: datos.get('telefono').trim(),
    direccion: '',
    entrega: datos.get('entrega'),
    metodo: datos.get('pago'),
    notas: datos.get('notas').trim(),
    comprobante: '',
    total: total(),
    items: []
  };
  if (borrador.entrega === 'domicilio') borrador.direccion = datos.get('direccion').trim();
  if (comprobante) borrador.comprobante = comprobante.name;
  for (const producto of cart) borrador.items.push(Object.assign({}, producto));

  // Comparamos el contenido para no duplicar un pedido al pulsar dos veces.
  const contenido = JSON.stringify(borrador);
  try {
    const pedidos = readOrders();
    const ultimo = pedidos[pedidos.length - 1];
    if (!ultimo || ultimo.fingerprint !== contenido) {
      borrador.id = Date.now();
      borrador.fecha = new Date().toISOString();
      borrador.estado = 'Solicitud preparada · pendiente de enviar y confirmar';
      borrador.fingerprint = contenido;
      pedidos.push(borrador);
      localStorage.setItem('miga_orders', JSON.stringify(pedidos));
    }
    renderOrders();
  } catch {
    toast('No se pudo guardar el historial local. Tu carrito sigue disponible.');
    // El cliente todavía puede continuar su solicitud por WhatsApp.
  }
  return true;
}

// 3. Consultar un pedido completo.
function showOrder(id) {
  let encontrado = null;
  try {
    for (const pedido of visibleOrders()) {
      if (String(pedido.id) === id) encontrado = pedido;
    }
  } catch {
    return;
  }
  if (!encontrado) return;
  const pedido = encontrado;
  let entrega = pedido.direccion || 'Entrega por confirmar';
  if (pedido.entrega === 'local') entrega = 'Recoger en el local';
  let lista = '';
  if (Array.isArray(pedido.items)) {
    for (const producto of pedido.items) {
      const cantidad = Number(producto.cantidad) || 0;
      const precio = Number(producto.precio) || 0;
      lista += `<li>${cantidad} × ${escapeHTML(producto.label || producto.nombre)} — ${money(precio * cantidad)}</li>`;
    }
  }
  let contenido = `
    <h3>${escapeHTML(pedido.cliente || 'Cliente')}</h3>
    <p>${escapeHTML(pedido.telefono || '')}</p>
    <p>${escapeHTML(entrega)}</p>
    <p>Pago: ${escapeHTML(pedido.metodo || 'Transferencia')}</p>
    <p>${escapeHTML(pedido.estado || 'Registro anterior; confirmar con el negocio')}</p>
    <ul>${lista}</ul>
    <div class="total-line"><span>Subtotal</span><strong>${money(Number(pedido.total) || 0)}</strong></div>
    <p>${escapeHTML(pedido.notas || '')}</p>`;
  if (pedido.comprobante) {
    contenido += `<p>Comprobante seleccionado: ${escapeHTML(pedido.comprobante)}. El archivo se adjunta por WhatsApp.</p>`;
  }
  document.getElementById('order-detail').innerHTML = contenido;
  document.getElementById('order-dialog').showModal();
}

function abrirAdministracion() {
  if (!esAdministrador()) return;
  renderOrders();
  document.getElementById('admin-panel').showModal();
}

function eliminarHistorial() {
  if (!esAdministrador()) return;
  if (!confirm('¿Eliminar el historial local de pedidos de este navegador?')) return;
  try {
    localStorage.setItem('miga_orders', '[]');
    renderOrders();
  } catch {
    toast('No se pudo borrar el historial.');
  }
}

document.getElementById('open-admin').addEventListener('click', abrirAdministracion);
document.getElementById('open-orders').addEventListener('click', function () {
  if (!currentSession) return;
  renderOrders();
  document.getElementById('history-dialog').showModal();
});
for (const id of ['orders-tbody', 'customer-orders']) {
  document.getElementById(id).addEventListener('click', function (evento) {
    const boton = evento.target.closest('[data-order]');
    if (boton) showOrder(boton.dataset.order);
  });
}
document.getElementById('btn-clear-orders').addEventListener('click', eliminarHistorial);

// 4. Sincronizar el pago del carrito con el resumen.
function updatePaymentDetails() {
  const metodo = document.getElementById('payment-method').value;
  document.getElementById('transfer-details').hidden = metodo !== 'transferencia';
  document.getElementById('quick-payment').value = metodo;
}
document.getElementById('payment-method').addEventListener('change', updatePaymentDetails);
document.getElementById('quick-payment').addEventListener('change', function () {
  document.getElementById('payment-method').value = this.value;
  updatePaymentDetails();
});
document.getElementById('checkout-button').addEventListener('click', updatePaymentDetails);

// 5. Vista previa del comprobante. El archivo se adjunta aparte en WhatsApp.
let receiptURL;
function limpiarComprobante() {
  if (receiptURL) URL.revokeObjectURL(receiptURL);
  receiptURL = null;
  document.getElementById('receipt-preview').hidden = true;
  document.getElementById('receipt-preview').removeAttribute('href');
  document.getElementById('receipt-status').textContent = 'Selecciona un comprobante si ya pagaste. Adjúntalo manualmente en WhatsApp.';
}

function revisarComprobante() {
  limpiarComprobante();
  const archivo = document.getElementById('comprobante').files[0];
  if (!archivo) return;
  const tipos = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (!tipos.includes(archivo.type) || archivo.size > 10 * 1024 * 1024) {
    document.getElementById('comprobante').value = '';
    document.getElementById('receipt-status').textContent = 'Elige una imagen JPG, PNG, WebP o un PDF de hasta 10 MB.';
    return;
  }
  receiptURL = URL.createObjectURL(archivo);
  document.getElementById('receipt-preview').href = receiptURL;
  document.getElementById('receipt-preview').hidden = false;
  document.getElementById('receipt-status').textContent = archivo.name + ' seleccionado. Recuerda adjuntarlo en WhatsApp; no se envía automáticamente.';
}
document.getElementById('comprobante').addEventListener('change', revisarComprobante);

updatePaymentDetails();
renderOrders();