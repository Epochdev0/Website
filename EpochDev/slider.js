(function () {
  document.querySelectorAll('.slider').forEach((slider) => {
    const track = slider.querySelector('.slider__track');
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const btnPrev = slider.querySelector('.slider__btn--prev');
    const btnNext = slider.querySelector('.slider__btn--next');
    const dotsWrap = slider.querySelector('.slider__dots');
    const viewport = slider.querySelector('.slider__viewport');

    if (!track || slides.length === 0) return;

    let index = 0;

    // Build dots (PER slider)
    let dots = [];
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'dot';
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-label', `Go to slide ${i + 1}`);
        b.addEventListener('click', (e) => { e.preventDefault(); go(i); });
        dotsWrap.appendChild(b);
      });
      dots = Array.from(dotsWrap.children);
    }

    function render() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => {
        d.classList.toggle('is-active', i === index);
        d.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
      if (btnPrev) btnPrev.disabled = index === 0;
      if (btnNext) btnNext.disabled = index === slides.length - 1;
    }

    function go(i) {
      index = Math.max(0, Math.min(slides.length - 1, i));
      render();
    }

    // Buttons
    if (btnPrev) btnPrev.addEventListener('click', (e) => { e.preventDefault(); go(index - 1); });
    if (btnNext) btnNext.addEventListener('click', (e) => { e.preventDefault(); go(index + 1); });

    // Keyboard support
    slider.tabIndex = 0;
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') go(index - 1);
      if (e.key === 'ArrowRight') go(index + 1);
    });

    // Touch/drag swipe (PER slider)
    let startX = 0, dx = 0, dragging = false;

    if (viewport) {
      viewport.addEventListener('pointerdown', (e) => {
        dragging = true; startX = e.clientX; dx = 0;
        viewport.setPointerCapture(e.pointerId);
      });

      viewport.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        dx = e.clientX - startX;
        track.style.transform = `translateX(calc(-${index * 100}% + ${dx}px))`;
      });

      const endDrag = () => {
        if (!dragging) return;
        dragging = false;
        const threshold = viewport.clientWidth * 0.15;
        if (Math.abs(dx) > threshold) go(index + (dx < 0 ? 1 : -1));
        else render();
      };

      viewport.addEventListener('pointerup', endDrag);
      viewport.addEventListener('pointercancel', endDrag);
    }

    // Autoplay (PER slider)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let timer = null;

    function startAuto() {
      if (prefersReduced) return;
      stopAuto();
      timer = setInterval(() => go(index + 1), 4500);
    }
    function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }

    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);
    startAuto();

    // Init
    render();
  });
})();
