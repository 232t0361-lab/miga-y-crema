'use strict';
const $ = id => document.getElementById(id);
const money = value => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
const clean = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const products = postres.map((p, id) => ({...p, id, category: /desayuno|eventos/.test(clean(p.nombre)) ? 'desayunos' : /frappe|capuchino|soda|latte|cafe/.test(clean(p.nombre)) ? 'bebidas' : 'postres'}));
products.forEach(p => { const variants = products.filter(other => other.nombre === p.nombre); p.label = variants.length > 1 ? `${p.nombre} · Opción ${variants.findIndex(other => other.id === p.id) + 1}` : p.nombre; });
const categoryNames = {postres:'Postres artesanales', bebidas:'Bebidas', desayunos:'Desayunos y detalles'};
let cart = [];
try { const stored = JSON.parse(localStorage.getItem('miga_cart') || '[]'); if (Array.isArray(stored)) stored.forEach(item => { const product = products.find(p => p.nombre === item.nombre && p.imagen === String(item.imagen).replace(/^img\//, 'assets/images/')); if (product && Number.isInteger(item.cantidad) && item.cantidad > 0) { const existing = cart.find(i => i.id === product.id); if (existing) existing.cantidad = Math.min(99, existing.cantidad + item.cantidad); else cart.push({...product, cantidad:Math.min(99,item.cantidad)}); } }); } catch { cart = []; }
let category = 'todos';
let toastTimer;
function toast(message) { $('toast').textContent = message; $('toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').hidden = true, 2600); }
function renderProducts() {
 const query = clean($('search').value.trim());
 const filtered = products.filter(p => (category === 'todos' || p.category === category) && clean(p.nombre + ' ' + p.descripcion).includes(query));
 if ($('sort').value !== 'original') filtered.sort((a,b) => $('sort').value === 'asc' ? a.precio-b.precio : b.precio-a.precio);
 $('results').textContent = `${filtered.length} productos para disfrutar · Precios en MXN`;
 $('products').innerHTML = filtered.length ? filtered.map(p => `<article class="product"><div class="product-image"><img src="${escapeHTML(p.imagen)}" alt="${escapeHTML(p.label)}" loading="lazy"><span class="product-tag">${categoryNames[p.category]}</span></div><div class="product-body"><h3>${escapeHTML(p.label)}</h3><p>${escapeHTML(p.descripcion)}</p><label class="product-quantity">Cantidad<input id="quantity-${p.id}" type="number" min="1" max="99" value="1" step="1" aria-label="Cantidad de ${escapeHTML(p.label)}"></label><div class="product-bottom"><strong>${money(p.precio)}</strong><button class="add" data-add="${p.id}" aria-label="Agregar ${escapeHTML(p.label)}">+ Agregar</button></div></div></article>`).join('') : '<div class="empty"><strong>No encontramos ese antojo</strong>Prueba otro nombre o cambia de categoría.</div>';
}
function total() { return cart.reduce((sum,p) => sum+p.precio*p.cantidad,0); }
function saveCart() { try { localStorage.setItem('miga_cart', JSON.stringify(cart)); } catch { toast('Tu carrito funciona, pero este navegador no pudo guardarlo.'); } renderCart(); }
function renderCart() {
 $('cart-count').textContent = cart.reduce((sum,p) => sum+p.cantidad,0);
 $('cart-total').textContent = money(total());
 $('floating-count').textContent = $('cart-count').textContent;
 $('floating-total').textContent = money(total());
 $('floating-cart').setAttribute('aria-label', 'Ver mi carrito: ' + $('cart-count').textContent + ' productos, ' + money(total()));
 $('clear-cart').disabled = cart.length === 0;
 $('checkout-button').disabled = cart.length === 0;
 $('cart-items').innerHTML = cart.length ? cart.map(p => `<div class="cart-row"><img src="${escapeHTML(p.imagen)}" alt="${escapeHTML(p.label)}"><div class="cart-row-body"><h3>${escapeHTML(p.label)}</h3><span class="cart-row-price">${money(p.precio*p.cantidad)} · ${money(p.precio)} c/u</span><div class="quantity"><button data-change="${p.id}" data-delta="-1" aria-label="Quitar una unidad de ${escapeHTML(p.label)}">−</button><input type="number" min="1" max="99" step="1" value="${p.cantidad}" data-quantity="${p.id}" aria-label="Cantidad de ${escapeHTML(p.label)}"><button data-change="${p.id}" data-delta="1" ${p.cantidad >= 99 ? 'disabled' : ''} aria-label="Agregar una unidad de ${escapeHTML(p.label)}">+</button><button class="remove" data-remove="${p.id}" aria-label="Eliminar ${escapeHTML(p.label)}">Eliminar</button></div></div></div>`).join('') : '<div class="empty"><strong>Tu próximo antojo te espera</strong>Agrega algo rico del menú para empezar tu pedido.</div>';
}
document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => { category = button.dataset.category; document.querySelectorAll('[data-category]').forEach(tab => {tab.classList.toggle('active',tab === button);tab.setAttribute('aria-pressed',String(tab === button));});renderProducts(); }));
$('search').addEventListener('input', renderProducts);
$('sort').addEventListener('change', renderProducts);
$('products').addEventListener('click', event => { const button = event.target.closest('[data-add]'); if (!button) return; const product = products[Number(button.dataset.add)]; const item = cart.find(p => p.id === product.id); const input = $(`quantity-${product.id}`); const quantity = Number(input.value); if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) { input.reportValidity(); return; } if ((item?.cantidad || 0) + quantity > 99) return toast('Puedes agregar hasta 99 unidades por producto.'); if(item) item.cantidad += quantity; else cart.push({...product,cantidad:quantity}); saveCart(); toast(`${product.label} se agregó a tu pedido`); });
$('cart-items').addEventListener('click', event => { const button = event.target.closest('button'); if (!button) return; if (button.dataset.remove !== undefined) cart = cart.filter(p => p.id !== Number(button.dataset.remove)); if (button.dataset.change !== undefined) {const item = cart.find(p => p.id === Number(button.dataset.change)); if(item) item.cantidad = Math.min(99,item.cantidad+Number(button.dataset.delta)); cart = cart.filter(p => p.cantidad > 0); } saveCart(); });
$('open-cart').addEventListener('click', () => $('cart-dialog').showModal());
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => $(button.dataset.close).close()));
document.querySelectorAll('dialog').forEach(dialog => {dialog.setAttribute('aria-label',dialog.querySelector('h2').textContent);dialog.addEventListener('click', event => { const r = dialog.getBoundingClientRect(); if(event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close(); });});
$('checkout-button').addEventListener('click', () => { if (!cart.length) return; $('checkout-items').innerHTML = cart.map(p => `<div class="summary-item"><span>${p.cantidad} × ${escapeHTML(p.label)}</span><span>${money(p.precio*p.cantidad)}</span></div>`).join(''); $('checkout-total').textContent = money(total()); $('cart-dialog').close(); $('checkout-dialog').showModal(); });
$('edit-cart').addEventListener('click', () => { $('checkout-dialog').close(); $('cart-dialog').showModal(); });
$('delivery').addEventListener('change', () => {const delivery = $('delivery').value === 'domicilio';$('address-label').hidden = !delivery;$('address').required = delivery; });
$('checkout-form').addEventListener('submit', event => {
 event.preventDefault(); if(!cart.length) return;
 const data = new FormData(event.currentTarget);
 const nombre = data.get('nombre').trim(); const telefono = data.get('telefono').trim(); const direccion = data.get('direccion').trim();
 if (!nombre || telefono.replace(/\D/g,'').length < 10 || (data.get('entrega') === 'domicilio' && !direccion)) {toast('Revisa tu nombre, teléfono y dirección de entrega.');return;}
 const message = ['¡Hola, Miga y Crema! Me gustaría solicitar este pedido:', '', ...cart.map(p => `${p.cantidad} × ${p.label} — ${money(p.precio*p.cantidad)}`), '', `Subtotal: ${money(total())} MXN`, `Nombre: ${nombre}`, `Teléfono: ${telefono}`, `Entrega: ${data.get('entrega') === 'local' ? 'Recoger en el local' : 'A domicilio: '+direccion}`, `Pago: ${data.get('pago') === 'efectivo' ? 'Efectivo' : 'Transferencia bancaria'}`, data.get('notas').trim() ? `Notas: ${data.get('notas').trim()}` : '', '', '¿Me confirman disponibilidad, horario y total con envío si aplica?'].filter(line => line !== '').join('\n');
 if (!savePendingOrder(data)) return;
 window.open('https://wa.me/522321237364?text='+encodeURIComponent(message), '_blank', 'noopener,noreferrer');
});
renderProducts();renderCart();
