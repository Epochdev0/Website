function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update button emoji
            const themeBtn = document.querySelector('.theme-toggle');
            themeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        }

        // Check for saved theme preference or use preferred color scheme
        function loadTheme() {
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            const theme = savedTheme || (prefersDark ? 'dark' : 'light');
            document.documentElement.setAttribute('data-theme', theme);
            
            // Set initial button emoji
            const themeBtn = document.querySelector('.theme-toggle');
            themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
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