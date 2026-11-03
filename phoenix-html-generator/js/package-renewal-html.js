document.addEventListener('DOMContentLoaded', function() {
  var sliders = document.querySelectorAll('.tpl-card-slider');
  sliders.forEach(function(slider) {
    var track = slider.querySelector('.tpl-card-track');
    var slides = slider.querySelectorAll('.tpl-card-slide');
    var dots = slider.querySelectorAll('.tpl-slider-dot');
    
    if (slides.length > 1) {
      var currentSlide = 0;
      var totalRealSlides = dots.length;

      // 무한 루프용 첫 번째 슬라이드 복제 추가
      var firstClone = slides[0].cloneNode(true);
      firstClone.removeAttribute('data-slide');
      firstClone.setAttribute('data-clone', 'true');
      track.appendChild(firstClone);

      var allSlides = track.querySelectorAll('.tpl-card-slide');

      function moveTo(index, withTransition = true) {
        if (!withTransition) {
          track.style.transition = 'none';
        } else {
          track.style.transition = 'transform 0.4s ease-in-out';
        }

        currentSlide = index;
        track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';

        var dotIndex = currentSlide >= totalRealSlides ? 0 : currentSlide;
        dots.forEach(function(d, i){ 
          d.classList.toggle('is-active', i === dotIndex); 
        });
      }

      setInterval(function() {
        currentSlide++;
        if (currentSlide >= allSlides.length - 1) {
          moveTo(currentSlide, true);
          setTimeout(function() {
            moveTo(0, false);
          }, 400);
        } else {
          moveTo(currentSlide, true);
        }
      }, 3000);

      var startX = 0;
      slider.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
      }, { passive: true });

      slider.addEventListener('touchend', function(e) {
        var endX = e.changedTouches[0].clientX;
        var diff = startX - endX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            currentSlide++;
            if (currentSlide >= totalRealSlides) {
              moveTo(currentSlide, true);
              setTimeout(function() { moveTo(0, false); }, 400);
              return;
            }
          } else {
            currentSlide--;
            if (currentSlide < 0) currentSlide = totalRealSlides - 1;
          }
          moveTo(currentSlide, true);
        }
      }, { passive: true });
    }
  });
});

document.addEventListener('click', function(e) {
  var openBtn = e.target.closest('#btn-open-sheet');
  var closeBtn = e.target.closest('#btn-close-sheet');
  var sheetBg = document.getElementById('sheet-bg');
  var sheet = document.getElementById('bottom-sheet');
  var accHeader = e.target.closest('.tpl-price-period-acc');
  var sliderButton = e.target.closest('.tpl-slider-dot');

  if (openBtn) {
    if(sheetBg) sheetBg.classList.add('active');
    if(sheet) sheet.classList.add('active');
  }

  if (closeBtn || e.target === sheetBg) {
    if(sheetBg) sheetBg.classList.remove('active');
    if(sheet) sheet.classList.remove('active');
  }

  if (sliderButton) {
    var slider = sliderButton.closest('.tpl-card-slider');
    if (slider) {
      var track = slider.querySelector('.tpl-card-track');
      var dots = slider.querySelectorAll('.tpl-slider-dot');
      var next = Number(sliderButton.getAttribute('data-slide-to'));
      if (track) {
        track.style.transform = 'translateX(-' + (next * 100) + '%)';
      }
      dots.forEach(function(d, i){ d.classList.toggle('is-active', i === next); });
    }
  }

  if (accHeader) {
    var group = accHeader.closest('.tpl-price-group');
    if (group) group.classList.toggle('active');
  }
});