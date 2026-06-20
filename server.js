// ==========================================================================
// SISTEMA AUTOMÁTICO Y MANUAL DEL CARRUSEL (MIGA Y CREMA)
// ==========================================================================
let slideActual = 0;
let autoPlayCarrusel;

function mostrarSlide(idx) {
  const track = document.getElementById("carruselTrack");
  const slides = document.querySelectorAll(".carrusel-slide");
  const dots = document.querySelectorAll(".dot");
  
  if (!track || slides.length === 0) return;

  // Lógica cíclica infinita
  if (idx >= slides.length) {
    slideActual = 0;
  } else if (idx < 0) {
    slideActual = slides.length - 1;
  } else {
    slideActual = idx;
  }

  // Mueve el contenedor horizontalmente usando porcentajes exactos
  track.style.transform = `translateX(-${slideActual * 100}%)`;

  // Cambia el estado visual de la bolita activa inferior
  dots.forEach((dot, i) => {
    if (dot) {
      dot.classList.toggle("active", i === slideActual);
    }
  });
}

function cambiarSlide(delta) {
  mostrarSlide(slideActual + delta);
  reiniciarAutoPlay();
}

function irAlSlide(idx) {
  mostrarSlide(idx);
  reiniciarAutoPlay();
}

function iniciarAutoPlay() {
  autoPlayCarrusel = setInterval(() => {
    cambiarSlide(1);
  }, 4000); // Cambia automáticamente de imagen cada 4 segundos
}

function reiniciarAutoPlay() {
  clearInterval(autoPlayCarrusel);
  iniciarAutoPlay();
}

// ARRANQUE FORZADO: Esto activa el movimiento al momento de abrir la web
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    mostrarSlide(0);
    iniciarAutoPlay();
  });
} else {
  mostrarSlide(0);
  iniciarAutoPlay();
}
