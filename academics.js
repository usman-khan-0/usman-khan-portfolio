/* ============================================
   ACADEMICS PAGE - JAVASCRIPT
   Optional enhancements for user experience
   ============================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Animate elements on scroll
    initScrollAnimations();
    
    // Add active state to navigation
    updateActiveNav();
    
    // Initialize semester cards interaction
    initSemesterCards();
    
    console.log('Academics page initialized successfully');
});

/* ============================================
   SMOOTH SCROLLING
   ============================================ */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all semester cards
    document.querySelectorAll('.semester-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });
    
    // Observe other sections
    document.querySelectorAll('.overview-card, .faculty-card, .facility-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });
}

// Add CSS class for animation
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

/* ============================================
   ACTIVE NAVIGATION
   ============================================ */
function updateActiveNav() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });
}

/* ============================================
   SEMESTER CARDS INTERACTION
   ============================================ */
function initSemesterCards() {
    const semesterCards = document.querySelectorAll('.semester-card');
    
    semesterCards.forEach(card => {
        // Add click to expand/collapse courses (optional feature)
        const header = card.querySelector('.semester-header');
        const coursesList = card.querySelector('.courses-list');
        
        if (header && coursesList) {
            header.style.cursor = 'pointer';
            
            // Optional: Add expand/collapse functionality
            // Uncomment below to enable
            /*
            header.addEventListener('click', function() {
                const isExpanded = card.classList.contains('expanded');
                
                if (isExpanded) {
                    card.classList.remove('expanded');
                    coursesList.style.maxHeight = '0';
                    coursesList.style.opacity = '0';
                } else {
                    card.classList.add('expanded');
                    coursesList.style.maxHeight = coursesList.scrollHeight + 'px';
                    coursesList.style.opacity = '1';
                }
            });
            */
        }
        
        // Highlight ongoing semester
        if (card.classList.contains('ongoing')) {
            card.style.animation = 'pulse-border 2s ease-in-out infinite';
        }
    });
}

// Add pulse animation for ongoing semester
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes pulse-border {
        0%, 100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
        }
        50% {
            box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
        }
    }
`;
document.head.appendChild(pulseStyle);

/* ============================================
   PERFORMANCE GRAPH (if image exists)
   ============================================ */
function checkPerformanceGraph() {
    const graphPlaceholder = document.querySelector('.graph-placeholder');
    const graphPath = 'assets/graph.png';
    
    // Check if graph image exists
    fetch(graphPath, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                // Image exists, replace placeholder
                const img = document.createElement('img');
                img.src = graphPath;
                img.alt = 'Academic Performance Graph';
                img.className = 'performance-graph';
                img.style.animation = 'fadeInUp 0.6s ease-out';
                
                graphPlaceholder.replaceWith(img);
            }
        })
        .catch(() => {
            // Image doesn't exist, keep placeholder
            console.log('Performance graph not found. Using placeholder.');
        });
}

// Check for graph on load
checkPerformanceGraph();

/* ============================================
   PRINT FUNCTIONALITY
   ============================================ */
function printAcademicProfile() {
    window.print();
}

// Add print button functionality if exists
const printButton = document.querySelector('.print-button');
if (printButton) {
    printButton.addEventListener('click', printAcademicProfile);
}

/* ============================================
   SCROLL TO TOP BUTTON (Optional)
   ============================================ */
function initScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        z-index: 999;
    `;
    
    document.body.appendChild(scrollButton);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.style.display = 'flex';
        } else {
            scrollButton.style.display = 'none';
        }
    });
    
    // Scroll to top on click
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    scrollButton.addEventListener('mouseenter', () => {
        scrollButton.style.transform = 'translateY(-5px)';
        scrollButton.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
    });
    
    scrollButton.addEventListener('mouseleave', () => {
        scrollButton.style.transform = 'translateY(0)';
        scrollButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    });
}

// Initialize scroll to top button
initScrollToTop();

/* ============================================
   STATISTICS COUNTER (Optional Enhancement)
   ============================================ */
function animateCounters() {
    const stats = [
        { element: '.total-credits', target: 136, suffix: ' Credits' },
        { element: '.completed-semesters', target: 3, suffix: ' Semesters' },
        { element: '.courses-completed', target: 18, suffix: ' Courses' }
    ];
    
    stats.forEach(stat => {
        const element = document.querySelector(stat.element);
        if (element) {
            let current = 0;
            const increment = stat.target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= stat.target) {
                    element.textContent = stat.target + stat.suffix;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current) + stat.suffix;
                }
            }, 20);
        }
    });
}

/* ============================================
   EXPORT FUNCTIONALITY
   ============================================ */
// Function to export academic data as JSON (for future use)
function exportAcademicData() {
    const academicData = {
        university: "Air University",
        department: "Mechanical & Aerospace Engineering",
        degree: "Bachelor of Engineering",
        status: {
            completed: 3,
            ongoing: 1,
            planned: 4
        },
        totalCredits: 136,
        // Add more data as needed
    };
    
    const dataStr = JSON.stringify(academicData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'academic-data.json';
    link.click();
    
    URL.revokeObjectURL(url);
}

/* ============================================
   MOBILE MENU (if needed)
   ============================================ */
function initMobileMenu() {
    const nav = document.querySelector('.nav-menu');
    if (!nav) return;
    
    // Add mobile menu toggle if needed
    // This is a placeholder for future mobile navigation
}

// Initialize mobile menu
initMobileMenu();

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Log page load time
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
});
