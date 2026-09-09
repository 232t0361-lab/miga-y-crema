'use strict';

// Cuentas para probar los dos roles durante la presentación del proyecto.
const usuariosDemo = [
  { correo: 'admin@admin.com', clave: 'admin123', rol: 'admin' },
  { correo: 'cliente@demo.com', clave: 'cliente123', rol: 'user' }
];

// La sesión indica quién entró. No guardamos la contraseña.
let currentSession = null;
try {
  const guardada = JSON.parse(sessionStorage.getItem('miga_session') || 'null');
  if (guardada && typeof guardada.email === 'string') {
    if (guardada.role === 'user' || guardada.role === 'admin') currentSession = guardada;
  }
} catch {
  currentSession = null;
}

function esAdministrador() {
  return currentSession !== null && currentSession.role === 'admin';
}

// El cliente nunca ve el botón ni la ventana de administración.
function applySession() {
  const haySesion = currentSession !== null;
  const administrador = esAdministrador();
  document.getElementById('login-screen').hidden = haySesion;
  document.getElementById('main-app').hidden = !haySesion;
  document.getElementById('open-admin').hidden = !administrador;
  document.getElementById('admin-panel').hidden = !administrador;
  if (!administrador) document.getElementById('admin-panel').close();
  document.getElementById('open-orders').textContent = 'Mis pedidos';

  // Estos archivos se cargan después de auth.js; al iniciar todavía no están listos.
  if (typeof renderOrders === 'function') renderOrders();
  if (typeof scheduleCarousel === 'function') scheduleCarousel();
}

function signIn(correo, rol) {
  currentSession = { email: correo, role: rol };
  try {
    sessionStorage.setItem('miga_session', JSON.stringify(currentSession));
  } catch {
    // Se puede usar la página aunque el navegador no permita guardar la sesión.
  }
  document.getElementById('login-pass').value = '';
  document.getElementById('login-error').hidden = true;
  applySession();
  window.scrollTo(0, 0);
}

function iniciarSesion(evento) {
  evento.preventDefault();
  if (!evento.currentTarget.reportValidity()) return;
  const correo = document.getElementById('login-email').value.trim().toLowerCase();
  const clave = document.getElementById('login-pass').value;

  for (const usuario of usuariosDemo) {
    if (correo === usuario.correo && clave === usuario.clave) {
      signIn(usuario.correo, usuario.rol);
      return;
    }
  }
  document.getElementById('login-error').textContent = 'El correo o la contraseña son incorrectos.';
  document.getElementById('login-error').hidden = false;
}

function entrarComoDemo() {
  document.getElementById('login-email').value = 'cliente@demo.com';
  document.getElementById('login-pass').value = 'cliente123';
  document.getElementById('login-form').requestSubmit();
}

function entrarComoCliente() {
  let invitado;
  try {
    invitado = localStorage.getItem('miga_guest');
    if (!invitado) {
      invitado = 'cliente-' + Date.now() + '@demo.local';
      localStorage.setItem('miga_guest', invitado);
    }
  } catch {
    invitado = 'cliente@demo.local';
  }
  signIn(invitado, 'user');
}

function cerrarSesion() {
  for (const ventana of document.querySelectorAll('dialog[open]')) ventana.close();
  clearTimeout(toastTimer);
  document.getElementById('toast').hidden = true;
  currentSession = null;
  try {
    sessionStorage.removeItem('miga_session');
  } catch {
    // La sesión de esta página se cierra igualmente.
  }
  document.getElementById('login-form').reset();
  document.getElementById('checkout-form').reset();
  document.getElementById('address-label').hidden = true;
  document.getElementById('address').required = false;
  updatePaymentDetails();
  limpiarComprobante();
  applySession();
  window.scrollTo(0, 0);
  document.getElementById('login-email').focus();
}

function vaciarCarrito() {
  if (cart.length === 0) return;
  if (confirm('¿Deseas vaciar el carrito?')) {
    cart = [];
    saveCart();
    toast('Carrito vaciado');
  }
}

function escribirCantidad(evento) {
  const entrada = evento.target.closest('[data-quantity]');
  if (!entrada) return;
  const producto = buscarEnCarrito(Number(entrada.dataset.quantity));
  if (!producto) return;
  const cantidad = Number(entrada.value);
  if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 99) {
    entrada.reportValidity();
    entrada.value = producto.cantidad;
    return;
  }
  producto.cantidad = cantidad;
  saveCart();
}

document.getElementById('login-form').addEventListener('submit', iniciarSesion);
document.getElementById('login-demo-client').addEventListener('click', entrarComoDemo);
document.getElementById('login-as-user').addEventListener('click', entrarComoCliente);
document.getElementById('btn-logout').addEventListener('click', cerrarSesion);
document.getElementById('clear-cart').addEventListener('click', vaciarCarrito);
document.getElementById('cart-items').addEventListener('change', escribirCantidad);
document.getElementById('floating-cart').addEventListener('click', function () {
  document.getElementById('cart-dialog').showModal();
});

applySession();
