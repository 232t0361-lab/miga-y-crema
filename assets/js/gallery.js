'use strict';

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
function showSlide(index) {
  slideIndex = (index + slides.length) % slides.length;
  $('carousel-image').src = 'assets/images/' + slides[slideIndex][0];
  $('carousel-image').alt = slides[slideIndex][1];
  $('carousel-position').textContent = `${slideIndex + 1} / ${slides.length}`;
}
function scheduleCarousel() {
  clearInterval(carouselTimer);
  if (!carouselPaused && !document.hidden && currentSession) carouselTimer = setInterval(() => showSlide(slideIndex + 1), 5000);
  $('carousel-pause').textContent = carouselPaused ? 'Reproducir' : 'Pausar';
  $('carousel-pause').setAttribute('aria-pressed', String(carouselPaused));
  $('carousel-position').setAttribute('aria-live', carouselPaused ? 'polite' : 'off');
}
$('carousel-prev').addEventListener('click', () => { showSlide(slideIndex - 1); scheduleCarousel(); });
$('carousel-next').addEventListener('click', () => { showSlide(slideIndex + 1); scheduleCarousel(); });
$('carousel-pause').addEventListener('click', () => { carouselPaused = !carouselPaused; scheduleCarousel(); });
document.addEventListener('visibilitychange', scheduleCarousel);
document.addEventListener('sessionchange', scheduleCarousel);
document.querySelectorAll('[data-story]').forEach(button => button.addEventListener('click', () => {
  $('story-image').src = button.dataset.story;
  $('story-image').alt = button.dataset.title;
  $('story-title').textContent = button.dataset.title;
  $('story-dialog').setAttribute('aria-label', button.dataset.title);
  $('story-dialog').showModal();
}));
scheduleCarousel();
