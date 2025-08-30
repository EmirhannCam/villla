/**
 * Villa Kartları için Slider Fonksiyonları
 * - Her villa kartı için ayrı slider oluşturur
 * - Ok navigasyonu ve dot navigasyon desteği
 * - Dokunmatik ekran desteği (swipe)
 * - Otomatik geçiş özelliği
 */

document.addEventListener('DOMContentLoaded', function() {
  // Tüm villa kartlarını seç
  const villaCards = document.querySelectorAll('.villa-card');
  
  // Her villa kartı için slider oluştur
  villaCards.forEach((card, cardIndex) => {
    const slider = card.querySelector('.villa-slider');
    if (!slider) return;
    
    const slidesEl = slider.querySelector('.villa-slides');
    const slideEls = slider.querySelectorAll('.villa-slide');
    const prevBtn = slider.querySelector('[data-prev]');
    const nextBtn = slider.querySelector('[data-next]');
    const dots = slider.querySelectorAll('.villa-slider-dot');
    
    // Eğer slide yoksa işlemi atla
    if (slideEls.length <= 1) return;
    
    let index = 0;
    let autoplayInterval;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Slide'ı belirtilen indekse götür
    function goToSlide(i) {
      index = (i + slideEls.length) % slideEls.length;
      slidesEl.style.transform = `translateX(-${index * 100}%)`;
      
      // Aktif dot'u güncelle
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === index);
      });
    }
    
    // Otomatik geçişi başlat
    function startAutoplay() {
      stopAutoplay(); // Önceki interval'ı temizle
      autoplayInterval = setInterval(() => {
        goToSlide(index + 1);
      }, 5000); // 5 saniyede bir geçiş
    }
    
    // Otomatik geçişi durdur
    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
      }
    }
    
    // Önceki ve sonraki butonları için event listener'lar
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide(index - 1);
        stopAutoplay();
        startAutoplay(); // Tıklamadan sonra otomatik geçişi yeniden başlat
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToSlide(index + 1);
        stopAutoplay();
        startAutoplay();
      });
    }
    
    // Dot'lar için event listener'lar
    dots.forEach((dot, dotIndex) => {
      dot.addEventListener('click', () => {
        goToSlide(dotIndex);
        stopAutoplay();
        startAutoplay();
      });
    });
    
    // Dokunmatik ekran desteği
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoplay();
    }, { passive: true });
    
    function handleSwipe() {
      const diff = touchStartX - touchEndX;
      const threshold = 50; // Minimum kaydırma mesafesi
      
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          // Sola kaydırma - sonraki slide
          goToSlide(index + 1);
        } else {
          // Sağa kaydırma - önceki slide
          goToSlide(index - 1);
        }
      }
    }
    
    // Fare üzerine geldiğinde otomatik geçişi durdur
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    
    // İlk slide'ı göster ve otomatik geçişi başlat
    goToSlide(0);
    startAutoplay();
  });
});