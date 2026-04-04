// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');

    if (toggle && links) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('open');
        });

        // Close menu when a link is clicked
        links.querySelectorAll('a:not(.coming-soon)').forEach(link => {
            link.addEventListener('click', () => {
                links.classList.remove('open');
            });
        });
    }

    // Tooltip for coming soon links
    document.querySelectorAll('.coming-soon').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
        });
        link.setAttribute('title', 'Coming soon');
    });
});
