function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Update button image
    const themeBtnImg = document.querySelector('.theme-toggle img');
    if (newTheme === 'dark') {
        themeBtnImg.src = 'Pictures/light.png';
        themeBtnImg.alt = 'Switch to light mode';
    } else {
        themeBtnImg.src = 'Pictures/moon.png';
        themeBtnImg.alt = 'Switch to dark mode';
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);

    // Set initial button image
    const themeBtnImg = document.querySelector('.theme-toggle img');
    if (theme === 'dark') {
        themeBtnImg.src = 'Pictures/light.png';
        themeBtnImg.alt = 'Switch to light mode';
    } else {
        themeBtnImg.src = 'Pictures/moon.png';
        themeBtnImg.alt = 'Switch to dark mode';
    }
}

        // Load theme when page loads
        document.addEventListener('DOMContentLoaded', loadTheme);

        // Smooth scroll to events section when arrow is clicked
        document.querySelector('.hero-arrow').addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('#events').scrollIntoView({
                behavior: 'smooth'
            });
        });

        // Optional: Add smooth scrolling for all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });