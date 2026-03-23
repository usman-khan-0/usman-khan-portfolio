# ============================================
# RENDER BACKEND CONFIGURATION
# ============================================
# After deploying to Render, replace the URL below with your Render service URL
# Example: 'https://usman-portfolio-chatbot.onrender.com'
# Get your URL from Render dashboard after deployment

const RENDER_BACKEND_URL = 'YOUR_RENDER_URL_HERE'; // <-- CHANGE THIS AFTER DEPLOYMENT

// Use Render backend if URL is set, otherwise use local Vercel API
const CHATBOT_API_URL = RENDER_BACKEND_URL !== 'YOUR_RENDER_URL_HERE' 
    ? `${RENDER_BACKEND_URL}/api/chat` 
    : '/api/chat';

# ============================================
# INSTRUCTIONS:
# 1. Deploy backend to Render (see render-backend/README.md)
# 2. Copy your Render URL (e.g., https://xxx.onrender.com)
# 3. Replace 'YOUR_RENDER_URL_HERE' with your actual URL
# 4. Save this file and redeploy to Vercel
# ============================================
