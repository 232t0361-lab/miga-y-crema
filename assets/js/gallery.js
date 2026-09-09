'use strict';

// Fotos del carrusel que ya tenía el proyecto.
const slides = [
  ['menú de pasteles.png', 'Menú de pasteles'],
  ['mini_cheescake.jpg', 'Mini cheesecake artesanal'],
  ['desayuno_7.jpg', 'Desayuno para compartir'],
  ['desayuno_2.jpg', 'Un desayuno especial'],
  ['desayuno_0.jpg', 'Detalles para regalar'],
  ['desayuno 10.jpg', 'Desayuno para sorprender']
];
let slideIndex = 0;
let carouselTimer;
let carouselPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function showSlide(indice) {
  if (indice >= slides.length) indice = 0;
  if (indice < 0) indice = slides.length - 1;
  slideIndex = indice;
  document.getElementById('carousel-image').src = 'assets/images/' + slides[indice][0];
  document.getElementById('carousel-image').alt = slides[indice][1];
  document.getElementById('carousel-position').textContent = (indice + 1) + ' / ' + slides.length;
}

function scheduleCarousel() {
  clearInterval(carouselTimer);
  if (!carouselPaused && !document.hidden && currentSession) {
    carouselTimer = setInterval(function () {
      showSlide(slideIndex + 1);
    }, 5000);
  }
  const boton = document.getElementById('carousel-pause');
  if (carouselPaused) {
    boton.textContent = 'Reproducir';
    document.getElementById('carousel-position').setAttribute('aria-live', 'polite');
  } else {
    boton.textContent = 'Pausar';
    document.getElementById('carousel-position').setAttribute('aria-live', 'off');
  }
  boton.setAttribute('aria-pressed', String(carouselPaused));
}

document.getElementById('carousel-prev').addEventListener('click', function () {
  showSlide(slideIndex - 1);
  scheduleCarousel();
});
document.getElementById('carousel-next').addEventListener('click', function () {
  showSlide(slideIndex + 1);
  scheduleCarousel();
});
document.getElementById('carousel-pause').addEventListener('click', function () {
  carouselPaused = !carouselPaused;
  scheduleCarousel();
});
document.addEventListener('visibilitychange', scheduleCarousel);

// Cada círculo abre su foto en una ventana.
for (const boton of document.querySelectorAll('[data-story]')) {
  boton.addEventListener('click', function () {
    document.getElementById('story-image').src = boton.dataset.story;
    document.getElementById('story-image').alt = boton.dataset.title;
    document.getElementById('story-title').textContent = boton.dataset.title;
    document.getElementById('story-dialog').setAttribute('aria-label', boton.dataset.title);
    document.getElementById('story-dialog').showModal();
  });
}
scheduleCarousel();