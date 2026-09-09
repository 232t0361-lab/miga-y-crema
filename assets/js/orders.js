'use strict';

function readOrders() {
  const saved = JSON.parse(localStorage.getItem('miga_orders') || '[]');
  if (!Array.isArray(saved)) throw new Error('Invalid order history');
  return saved.filter(order => order && typeof order === 'object');
}

function visibleOrders() {
  const orders = readOrders();
  return currentSession?.role === 'admin' ? orders : orders.filter(order => order.usuario === currentSession?.email);
}

function orderRows(orders) {
  return orders.slice().reverse().map(order => `<tr><td>${escapeHTML(order.id)}</td><td>${escapeHTML(order.cliente || 'Cliente')}</td><td>${escapeHTML(new Date(order.fecha).toLocaleDateString('es-MX'))}</td><td>${escapeHTML(order.metodo || 'Transferencia')}</td><td>${money(Number(order.total) || 0)}</td><td><button class="guest-button" data-order="${escapeHTML(order.id)}">Ver detalle</button></td></tr>`).join('') || '<tr><td colspan="6">Aún no hay pedidos guardados.</td></tr>';
}

function renderOrders() {
  try {
    const orders = visibleOrders();
    $('admin-total-items').textContent = products.length;
    $('admin-carritos').textContent = currentSession?.role === 'admin' ? orders.length : 0;
    $('orders-tbody').innerHTML = currentSession?.role === 'admin' ? orderRows(orders) : '';
    $('customer-orders').innerHTML = orders.length ? orders.slice().reverse().map(order => `<article class="history-card"><h3>Pedido ${escapeHTML(order.id)}</h3><p>${escapeHTML(new Date(order.fecha).toLocaleString('es-MX'))} · ${money(Number(order.total) || 0)}</p><p>${escapeHTML(order.estado || 'Registro anterior; confirmar con el negocio')}</p><button class="guest-button" data-order="${escapeHTML(order.id)}">Ver detalle</button></article>`).join('') : '<p class="empty">Tus solicitudes aparecerán aquí cuando prepares un pedido por WhatsApp.</p>';
  } catch {
    $('customer-orders').textContent = 'No se pudo leer el historial local. No se han borrado tus datos.';
    $('orders-tbody').innerHTML = '<tr><td colspan="6">No se pudo leer el historial local.</td></tr>';
  }
}

// Preserve previous records and avoid duplicate saves when reopening the same WhatsApp draft.
function savePendingOrder(data) {
  if (!currentSession) return false;
  const draft = {
    usuario: currentSession.email,
    cliente: data.get('nombre').trim(),
    telefono: data.get('telefono').trim(),
    direccion: data.get('entrega') === 'domicilio' ? data.get('direccion').trim() : '',
    entrega: data.get('entrega'),
    metodo: data.get('pago'),
    notas: data.get('notas').trim(),
    comprobante: $('comprobante').files[0]?.name || '',
    total: total(),
    items: cart.map(item => ({ ...item }))
  };
  const fingerprint = JSON.stringify(draft);
  try {
    const orders = readOrders();
    const last = orders[orders.length - 1];
    if (last?.fingerprint !== fingerprint) {
      orders.push({ ...draft, id: Date.now(), fecha: new Date().toISOString(), estado: 'Solicitud preparada · pendiente de enviar y confirmar', fingerprint });
      localStorage.setItem('miga_orders', JSON.stringify(orders));
    }
    renderOrders();
  } catch {
    toast('No se pudo guardar el historial local. Tu carrito sigue disponible.');
    return true; // Storage failure must not prevent a WhatsApp request.
  }
  return true;
}

function showOrder(id) {
  let order;
  try { order = visibleOrders().find(item => String(item.id) === id); } catch { return; }
  if (!order) return;
  const items = Array.isArray(order.items) ? order.items : [];
  $('order-detail').innerHTML = `<h3>${escapeHTML(order.cliente || 'Cliente')}</h3><p>${escapeHTML(order.telefono || '')}</p><p>${escapeHTML(order.entrega === 'local' ? 'Recoger en el local' : order.direccion || 'Entrega por confirmar')}</p><p>Pago: ${escapeHTML(order.metodo || 'Transferencia')}</p><p>${escapeHTML(order.estado || 'Registro anterior; confirmar con el negocio')}</p><ul>${items.map(item => `<li>${Number(item.cantidad) || 0} × ${escapeHTML(item.label || item.nombre)} — ${money((Number(item.precio) || 0) * (Number(item.cantidad) || 0))}</li>`).join('')}</ul><div class="total-line"><span>Subtotal</span><strong>${money(Number(order.total) || 0)}</strong></div><p>${escapeHTML(order.notas || '')}</p>${order.comprobante ? `<p>Comprobante seleccionado: ${escapeHTML(order.comprobante)}. El archivo se adjunta por WhatsApp.</p>` : ''}`;
  $('order-dialog').showModal();
}

$('open-orders').addEventListener('click', () => {
  renderOrders();
  if (currentSession?.role === 'admin') $('admin-panel').scrollIntoView({ behavior: 'smooth' });
  else $('history-dialog').showModal();
});
[$('orders-tbody'), $('customer-orders')].forEach(container => container.addEventListener('click', event => {
  const button = event.target.closest('[data-order]');
  if (button) showOrder(button.dataset.order);
}));
$('btn-clear-orders').addEventListener('click', () => {
  if (currentSession?.role !== 'admin' || !confirm('¿Eliminar el historial local de pedidos de este navegador?')) return;
  try { localStorage.setItem('miga_orders', '[]'); renderOrders(); } catch { toast('No se pudo borrar el historial.'); }
});
document.addEventListener('sessionchange', renderOrders);

function updatePaymentDetails() {
  $('transfer-details').hidden = $('payment-method').value !== 'transferencia';
  $('quick-payment').value = $('payment-method').value;
}
$('payment-method').addEventListener('change', updatePaymentDetails);
$('quick-payment').addEventListener('change', () => {
  $('payment-method').value = $('quick-payment').value;
  updatePaymentDetails();
});
$('checkout-button').addEventListener('click', updatePaymentDetails);
let receiptURL;
$('comprobante').addEventListener('change', () => {
  if (receiptURL) URL.revokeObjectURL(receiptURL);
  $('receipt-preview').hidden = true;
  const file = $('comprobante').files[0];
  if (!file) {
    $('receipt-status').textContent = 'Selecciona un comprobante si ya pagaste. Adjúntalo manualmente en WhatsApp.';
    return;
  }
  if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type) || file.size > 10 * 1024 * 1024) {
    $('comprobante').value = '';
    $('receipt-status').textContent = 'Elige una imagen JPG, PNG, WebP o un PDF de hasta 10 MB.';
    return;
  }
  receiptURL = URL.createObjectURL(file);
  $('receipt-preview').href = receiptURL;
  $('receipt-preview').hidden = false;
  $('receipt-status').textContent = `${file.name} seleccionado. Recuerda adjuntarlo en WhatsApp; no se envía automáticamente.`;
});
updatePaymentDetails();
renderOrders();
