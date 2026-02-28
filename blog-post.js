// This script runs after blog.js is loaded, so we have access to allBlogPosts
// DOM elements
const postContent = document.getElementById('postContent');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const subscribeForm = document.getElementById('subscribeForm');

// Get post ID from URL
function getPostIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id')) || 1;
}

// Load and display the blog post
function loadBlogPost() {
    const postId = getPostIdFromURL();

    // Use allBlogPosts from blog.js
    const post = (typeof allBlogPosts !== 'undefined' ? allBlogPosts : blogPosts).find(p => p.id === postId);

    if (post) {
        // Update page title
        document.title = `${post.title} | AI Insights`;

        // Display post content
        postContent.innerHTML = post.content;
    } else {
        // Post not found
        postContent.innerHTML = `
            <div class="post-header">
                <h1 class="post-title">Article Not Found</h1>
                <p>Sorry, we couldn't find the article you're looking for.</p>
                <a href="blog.html" class="btn btn-primary">Back to Blog</a>
            </div>
        `;
    }

    // Handle image loading errors
    setTimeout(() => {
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', function() {
                this.src = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
                this.alt = 'Image failed to load - AI visualization placeholder';
            });
        });
    }, 100);
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }

    // Newsletter subscription form
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (email) {
                alert(`Thank you for subscribing with email: ${email}. You'll receive updates about the latest AI insights.`);
                emailInput.value = '';
            }
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadBlogPost();
    setupEventListeners();
});
