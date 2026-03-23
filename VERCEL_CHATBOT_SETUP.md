# =====================================
# VERCEL CHATBOT SETUP - NO CARD REQUIRED
# =====================================
# 
# Your Vercel backend is already configured!
# Just follow these 3 simple steps:
#
# STEP 1: Add GROQ_API_KEY to Vercel Dashboard
# ----------------------------------------------
# 1. Go to https://vercel.com/dashboard
# 2. Click on your portfolio project
# 3. Go to Settings → Environment Variables
# 4. Click "Add New"
# 5. Add:
#    - Name: GROQ_API_KEY
#    - Value: (your Groq API key from https://console.groq.com/keys)
#    - Environments: Check all 3 boxes (Preview, Production, Development)
# 6. Click Save
#
# STEP 2: Push the latest changes to GitHub
# ----------------------------------------------
# Run these commands in your project folder:
#
#    git add api/requirements.txt vercel.json index.html
#    git commit -m "Fix Vercel chatbot backend configuration"
#    git push
#
# STEP 3: Wait for Vercel to redeploy
# ----------------------------------------------
# Vercel will automatically redeploy (takes 1-2 minutes)
# Watch the deployment progress in Vercel dashboard
#
# STEP 4: Test your chatbot
# ----------------------------------------------
# 1. Open your portfolio website
# 2. Click the chatbot icon (bottom-right corner)
# 3. Ask: "What are your skills?"
# 4. ✅ You should get a response!
#
# =====================================
# TROUBLESHOOTING
# =====================================
#
# ❌ Chatbot returns 500 error
# → Check if GROQ_API_KEY is set in Vercel dashboard
# → Verify your Groq API key is valid at https://console.groq.com/keys
#
# ❌ Chatbot returns "API request failed"
# → Wait 1-2 minutes for Vercel redeployment to complete
# → Check Vercel Functions logs in dashboard
#
# ❌ Chatbot returns "Server configuration error"
# → GROQ_API_KEY environment variable is missing
# → Add it in Vercel dashboard (see Step 1)
#
# =====================================
# FILES CONFIGURED
# =====================================
# ✅ api/index.py - Vercel serverless function handler
# ✅ api/requirements.txt - Python dependencies (openai==1.6.0)
# ✅ vercel.json - Routes /api/chat to api/index.py
# ✅ index.html - Frontend configured to use /api/chat
# ✅ .vercelignore - Excludes unnecessary files
#
# =====================================
