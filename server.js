// ==========================================================================
// CONTROL DEL CARRUSEL DE BANNERS (MIGA Y CREMA)
// ==========================================================================
let slideActual = 0;
let autoPlayCarrusel;

function mostrarSlide(idx) {
  const track = document.getElementById("carruselTrack");
  const slides = document.querySelectorAll(".carrusel-slide");
  const dots = document.querySelectorAll(".dot");
  
  if (!track || slides.length === 0) return; // Medida de seguridad por si no carga el DOM

  if (idx >= slides.length) {
    slideActual = 0;
  } else if (idx < 0) {
    slideActual = slides.length - 1;
  } else {
    slideActual = idx;
  }

  // Mueve el riel de imágenes al porcentaje correspondiente
  track.style.transform = `translateX(-${slideActual * 100}%)`;

  // Sincroniza y enciende la bolita activa
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
  }, 5000); // Cambia automáticamente de banner cada 5 segundos
}

function reiniciarAutoPlay() {
  clearInterval(autoPlayCarrusel);
  iniciarAutoPlay();
}

// Inicializa el carrusel automáticamente al cargar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  mostrarSlide(0);
  iniciarAutoPlay();
});
