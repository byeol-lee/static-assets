document.addEventListener('DOMContentLoaded', function() {
  var sliders = document.querySelectorAll('.tpl-card-slider');
  sliders.forEach(function(slider) {
    var slides = slider.querySelectorAll('.tpl-card-slide');
    var track = slider.querySelector('.tpl-card-track');
    var dots = slider.querySelectorAll('.tpl-slider-dot');
    
    if (slides.length > 1) {
      var currentSlide = 0;
      
      function moveTo(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        currentSlide = index;
        if (track) {
          track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
        }
        dots.forEach(function(d, i){ d.classList.toggle('is-active', i === currentSlide); });
      }

      setInterval(function() {
        moveTo(currentSlide + 1);
      }, 3000);

      var startX = 0;
      slider.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
      }, { passive: true });

      slider.addEventListener('touchend', function(e) {
        var endX = e.changedTouches[0].clientX;
        var diff = startX - endX;
        if (Math.abs(diff) > 50) {
          moveTo(diff > 0 ? currentSlide + 1 : currentSlide - 1);
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