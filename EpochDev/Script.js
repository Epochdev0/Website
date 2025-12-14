function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  const themeBtnImg = document.querySelector('.theme-toggle img');
  themeBtnImg.src = newTheme === 'dark' ? 'Pictures/FrontPage/light.png' : 'Pictures/FrontPage/moon.png';
  themeBtnImg.alt = newTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);

  const themeBtnImg = document.querySelector('.theme-toggle img');
  themeBtnImg.src = theme === 'dark' ? 'Pictures/FrontPage/light.png' : 'Pictures/FrontPage/moon.png';
  themeBtnImg.alt = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
}

document.addEventListener('DOMContentLoaded', loadTheme);

document.querySelector('.hero-arrow').addEventListener('click', e => {
  e.preventDefault();
  document.querySelector('#events').scrollIntoView({ behavior: 'smooth' });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});

// --------------------------------------------------
// 🧠 Eventbrite Hackathon Fetch (Ireland only, button-activated)
// --------------------------------------------------

function createHackathonButton() {
  const section = document.querySelector('#live-hackathons');
  if (!section) return;

  // Info text
  const info = document.createElement('p');
  info.className = 'section-subtitle';
  section.appendChild(info);

  // Button
  const btn = document.createElement('button');
  btn.className = 'apply-btn';
  btn.textContent = '🔍 Show Live Hackathons';
  section.appendChild(btn);

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.textContent = 'Loading...';
    await loadEventbriteHackathons();
    btn.style.display = 'none';
  });
}

async function loadEventbriteHackathons() {
  const token = 'EGSD2B4JWUL36LW6BV2K';
  const query = 'AI hackathon OR machine learning hackathon';
  const url = `https://corsproxy.io/?https://www.eventbriteapi.com/v3/events/search/?q=${encodeURIComponent(query)}&sort_by=date&location.address=Ireland&expand=venue`;

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();

    const container = document.querySelector('.live-hackathon-grid');
    if (!data.events || data.events.length === 0 || !container) {
      container.innerHTML = "<p style='margin-top:2rem;'>⚠️ No upcoming AI/ML hackathons found in Ireland right now — check back soon!</p>";
      return;
    }

    data.events.slice(0, 6).forEach(event => {
      const card = document.createElement('div');
      card.className = 'event-card';
      card.innerHTML = `
        <h3>${event.name.text}</h3>
        <p>${event.description?.text?.slice(0, 160) || 'Hackathon focused on AI/ML innovation.'}...</p>
        <div class="event-details">
          <div>📅 ${new Date(event.start.local).toDateString()}</div>
          <div>📍 ${event.venue?.address?.city || 'Online'}</div>
          <a href="${event.url}" target="_blank" class="book-btn">View Event</a>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading Eventbrite hackathons:', error);
    const container = document.querySelector('.live-hackathon-grid');
    container.innerHTML = "<p style='margin-top:2rem;'>🚫 Unable to load Eventbrite data (CORS or network issue).</p>";
  }
}


document.addEventListener('DOMContentLoaded', createHackathonButton);


(function(){
  const slider = document.getElementById('peSlider');
  if(!slider) return;

  const track = slider.querySelector('#peTrack');
  const cards = Array.from(track.querySelectorAll('.pe-card'));
  const prevBtn = slider.querySelector('.pe-nav--prev');
  const nextBtn = slider.querySelector('.pe-nav--next');
  const dotsWrap = slider.querySelector('.pe-dots');

  let index = 0;

  function perView(){
    return window.matchMedia('(min-width:1024px)').matches ? 3
         : window.matchMedia('(min-width:640px)').matches ? 2
         : 1;
  }

  function maxIndex(){
    return Math.max(0, cards.length - perView());
  }

  function buildDots(){
    if(!dotsWrap) return;
    dotsWrap.innerHTML = '';
    for(let i=0;i<=maxIndex();i++){
      const b = document.createElement('button');
      b.type = 'button';
      b.addEventListener('click', ()=>{ index=i; render(); });
      dotsWrap.appendChild(b);
    }
  }

  function render(){
    index = Math.max(0, Math.min(index, maxIndex()));
    const cardW = cards[0]?.getBoundingClientRect().width || 320;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 18);
    track.scrollTo({ left: index * (cardW + gap), behavior: 'smooth' });

    if(prevBtn) prevBtn.disabled = index === 0;
    if(nextBtn) nextBtn.disabled = index === maxIndex();

    if(dotsWrap){
      [...dotsWrap.children].forEach((d,i)=>d.classList.toggle('is-active', i===index));
    }
  }

  buildDots();
  render();

  prevBtn?.addEventListener('click', ()=>{ index--; render(); });
  nextBtn?.addEventListener('click', ()=>{ index++; render(); });

  window.addEventListener('resize', ()=>{ buildDots(); render(); }, {passive:true});
})();
