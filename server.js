<div class="carrusel-wrapper" id="inicio">
        <div class="carrusel-container">
          <button class="carrusel-btn prev" onclick="cambiarSlide(-1)">❮</button>
          <button class="carrusel-btn next" onclick="cambiarSlide(1)">❯</button>
          
          <div class="carrusel-track" id="carruselTrack">
            <div class="carrusel-slide"><img src="img/anuncio1.jpg" alt="Promoción 1"></div>
            <div class="carrusel-slide"><img src="img/anuncio2.jpg" alt="Promoción 2"></div>
            <div class="carrusel-slide"><img src="img/anuncio3.jpg" alt="Promoción 3"></div>
          </div>
        </div>
        <div class="carrusel-dots" id="carruselDots">
          <span class="dot active" onclick="irAlSlide(0)"></span>
          <span class="dot" onclick="irAlSlide(1)"></span>
          <span class="dot" onclick="irAlSlide(2)"></span>
        </div>
      </div>
