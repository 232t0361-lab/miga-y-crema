'use strict';

// Preserve the original classroom/demo login. No password is stored.
let currentSession = null;
try {
  const saved = JSON.parse(sessionStorage.getItem('miga_session') || 'null');
  if (saved && typeof saved.email === 'string' && ['user', 'admin'].includes(saved.role)) currentSession = saved;
} catch { /* A new session starts at the login screen. */ }

function applySession() {
  const signedIn = Boolean(currentSession);
  $('login-screen').hidden = signedIn;
  $('main-app').hidden = !signedIn;
  $('admin-panel').hidden = currentSession?.role !== 'admin';
  $('open-orders').textContent = currentSession?.role === 'admin' ? 'Administración' : 'Mis pedidos';
  document.dispatchEvent(new Event('sessionchange'));
}

function signIn(email, role) {
  currentSession = { email, role };
  try { sessionStorage.setItem('miga_session', JSON.stringify(currentSession)); } catch { /* Session remains usable in memory. */ }
  $('login-pass').value = '';
  $('login-error').hidden = true;
  applySession();
  window.scrollTo(0, 0);
}

$('login-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const email = $('login-email').value.trim().toLowerCase();
  const password = $('login-pass').value;
  if (email === 'admin@admin.com') {
    if (password !== 'admin123') {
      $('login-error').textContent = 'La contraseña de administrador es incorrecta.';
      $('login-error').hidden = false;
      return;
    }
    signIn(email, 'admin');
  } else {
    signIn(email, 'user');
  }
});

$('login-as-user').addEventListener('click', () => {
  let guestId;
  try {
    guestId = localStorage.getItem('miga_guest');
    if (!guestId) {
      guestId = `cliente-${Date.now()}@demo.local`;
      localStorage.setItem('miga_guest', guestId);
    }
  } catch { guestId = 'cliente@demo.local'; }
  signIn(guestId, 'user');
});

$('btn-logout').addEventListener('click', () => {
  document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
  clearTimeout(toastTimer);
  $('toast').hidden = true;
  currentSession = null;
  try { sessionStorage.removeItem('miga_session'); } catch { /* In-memory logout still succeeds. */ }
  $('login-form').reset();
  $('checkout-form').reset();
  $('address-label').hidden = true;
  $('address').required = false;
  updatePaymentDetails();
  $('comprobante').dispatchEvent(new Event('change'));
  applySession();
  window.scrollTo(0, 0);
  $('login-email').focus();
});

$('floating-cart').addEventListener('click', () => $('cart-dialog').showModal());
$('clear-cart').addEventListener('click', () => {
  if (cart.length && confirm('¿Deseas vaciar el carrito?')) {
    cart = [];
    saveCart();
    toast('Carrito vaciado');
  }
});

$('cart-items').addEventListener('change', event => {
  const input = event.target.closest('[data-quantity]');
  if (!input) return;
  const item = cart.find(product => product.id === Number(input.dataset.quantity));
  if (!item) return;
  const quantity = Number(input.value);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    input.reportValidity();
    input.value = item.cantidad;
    return;
  }
  item.cantidad = quantity;
  saveCart();
});

applySession();
