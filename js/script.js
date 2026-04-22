/* ============================================
   mk - Main JavaScript
   ============================================ */

// Mobile Navigation Toggle
function toggleMobileNav(event) {
    // Prevent any default behavior
    if (event) event.preventDefault();
    
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.nav-overlay');
    const body = document.body;
    
    const isOpen = navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
    
    if (overlay) {
        overlay.classList.toggle('active');
    }
    
    body.classList.toggle('menu-open', isOpen);
    
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.setAttribute('aria-label', isOpen ? 'Navigation schließen' : 'Navigation öffnen');
}

function closeMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.nav-overlay');
    const body = document.body;
    
    navLinks.classList.remove('active');
    navToggle.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    body.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Navigation öffnen');
}

// Initialize mobile navigation
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const overlay = document.querySelector('.nav-overlay');
    
    // Click handler on burger button
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileNav);
        // Also support touchstart for faster mobile response
        navToggle.addEventListener('touchstart', toggleMobileNav, { passive: false });
    }
    
    // Close menu when clicking overlay
    if (overlay) {
        overlay.addEventListener('click', closeMobileNav);
        overlay.addEventListener('touchstart', closeMobileNav, { passive: false });
    }
    
    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileNav();
        }
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