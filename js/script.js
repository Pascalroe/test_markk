/* ============================================
   mk - Main JavaScript
   ============================================ */

// Mobile Navigation Toggle
function toggleMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
}

// Close mobile nav when clicking a link
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navToggle = document.querySelector('.nav-toggle');
            const navLinksContainer = document.querySelector('.nav-links');
            navToggle.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });
});

// FAQ Toggle
function toggleFaq(button) {
    const item = button.closest('.faq-item');
    const isActive = item.classList.contains('active');
    
    // Close all items
    document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
    });
    
    // Open clicked if it wasn't active
    if (!isActive) {
        item.classList.add('active');
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});