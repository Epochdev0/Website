
(function(){
  const slider = document.querySelector('.slider');
  const track  = slider.querySelector('.slider__track');
  const slides = Array.from(slider.querySelectorAll('.slide'));
  const btnPrev = slider.querySelector('.slider__btn--prev');
  const btnNext = slider.querySelector('.slider__btn--next');
  const dotsWrap = slider.querySelector('.slider__dots');

  let index = 0;
  const last = slides.length - 1;

  // Build dots
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role','tab');
    b.setAttribute('aria-label', `Go to slide ${i+1}`);
    b.addEventListener('click', () => go(i));
    dotsWrap.appendChild(b);
  });

  const dots = Array.from(dotsWrap.children);

  function render(){
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d,i)=>d.setAttribute('aria-selected', i===index ? 'true':'false'));
  }

  function go(i){
    index = (i + slides.length) % slides.length;
    render();
  }

  btnPrev.addEventListener('click', () => go(index-1));
  btnNext.addEventListener('click', () => go(index+1));

  // Keyboard support
  slider.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowLeft') go(index-1);
    if(e.key === 'ArrowRight') go(index+1);
  });
  slider.tabIndex = 0;

  // Touch/drag swipe
  let startX = 0, dx = 0, dragging = false;
  const viewport = slider.querySelector('.slider__viewport');
  viewport.addEventListener('pointerdown', (e)=>{
    dragging = true; startX = e.clientX; dx = 0;
    viewport.setPointerCapture(e.pointerId);
  });
  viewport.addEventListener('pointermove', (e)=>{
    if(!dragging) return;
    dx = e.clientX - startX;
    track.style.transform = `translateX(calc(-${index*100}% + ${dx}px))`;
  });
  viewport.addEventListener('pointerup', ()=>{
    if(!dragging) return;
    dragging = false;
    const threshold = viewport.clientWidth * 0.15;
    if(Math.abs(dx) > threshold){
      go(index + (dx < 0 ? 1 : -1));
    } else {
      render();
    }
  });

  // Optional autoplay (pause on hover)
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer = null;
  function startAuto(){
    if(prefersReduced) return;
    stopAuto();
    timer = setInterval(()=> go(index+1), 4500);
  }
  function stopAuto(){ if(timer){ clearInterval(timer); timer=null; } }

  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);
  // start if you want autoplay
  startAuto();

  // Init
  render();
})();

