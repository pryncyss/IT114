// Get DOM elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Toggle menu on hamburger click
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Prevent scrolling when menu is open
function toggleScroll() {
    document.body.style.overflow = 
        navLinks.classList.contains('active') ? 'hidden' : 'auto';
}

hamburger.addEventListener('click', toggleScroll);
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', toggleScroll);
});