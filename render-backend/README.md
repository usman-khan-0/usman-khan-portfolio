# Usman Khan Portfolio Chatbot - Render Backend

This is the backend API for the portfolio chatbot, designed to be deployed on **Render** (free tier).

## 📁 Files to Upload

Upload **only these files** to your Render repository:

```
render-backend/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── .env.example        # Environment variables template
└── .gitignore          # Git ignore rules
```

**DO NOT upload:**
- `.env` file (contains your API key - keep it secret!)
- Any other files from the main portfolio

---

## 🚀 Step-by-Step Deployment Guide

### Step 1: Get Your Groq API Key

1. Go to [Groq Console](https://console.groq.com/keys)
2. Sign up or log in
3. Click **"Create API Key"**
4. Copy the API key (starts with `gsk_...`)
5. **Keep it secret!** Never share or commit this key.

---

### Step 2: Create a New GitHub Repository

1. Go to [GitHub](https://github.com/)
2. Click **"+"** → **"New repository"**
3. Name it: `usman-portfolio-chatbot` (or any name you prefer)
4. Set as **Private** (recommended for security)
5. Click **"Create repository"**

---

### Step 3: Upload Backend Files to GitHub

**Option A: Using Git (Recommended)**

```bash
# Navigate to the render-backend folder
cd "E:\Projects\New Portfolio\usman-khan-portfolio\render-backend"

# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Portfolio chatbot backend"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/usman-portfolio-chatbot.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Option B: Manual Upload via GitHub Web Interface**

1. In your new GitHub repository, click **"uploading an existing file"**
2. Drag and drop these files:
   - `app.py`
   - `requirements.txt`
   - `.gitignore`
3. Click **"Commit changes"**

---

### Step 4: Create Render Account

1. Go to [Render.com](https://render.com/)
2. Click **"Get Started for Free"**
3. Sign up using your **GitHub account** (recommended) or email
4. Verify your email if required

---

### Step 5: Create New Web Service on Render

1. After logging in, click **"New +"** → **"Web Service"**
2. Click **"Connect a repository"**
3. Find and select your `usman-portfolio-chatbot` repository
4. Click **"Connect"**

---

### Step 6: Configure Web Service Settings

Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `usman-portfolio-chatbot` (or any name) |
| **Region** | Choose closest to you (e.g., `Frankfurt, Germany` or `Singapore`) |
| **Branch** | `main` |
| **Root Directory** | *(leave blank)* |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn app:app` |
| **Instance Type** | **Free** |

Click **"Advanced"** and add these environment variables:

| Key | Value |
|-----|-------|
| `GROQ_API_KEY` | Your actual Groq API key (e.g., `gsk_xxxxxxxxxxxxxx`) |
| `PORT` | `5000` (Render sets this automatically, but you can set it) |

Click **"Create Web Service"**

---

### Step 7: Wait for Deployment

1. Render will now build and deploy your service
2. This takes **2-5 minutes**
3. You'll see logs in the dashboard
4. When you see **"Live"** status, it's ready!

---

### Step 8: Get Your Render URL

1. In your Render dashboard, find your web service
2. Copy the URL at the top (looks like: `https://usman-portfolio-chatbot.onrender.com`)
3. **Save this URL** - you'll need it for the next step

---

### Step 9: Update Your Portfolio Frontend

Now update your `index.html` to point to the Render backend:

1. Open `E:\Projects\New Portfolio\usman-khan-portfolio\index.html`
2. Find this line (around line 5638):
   ```javascript
   const response = await fetch('/api/chat', {
   ```
3. Replace with your Render URL:
   ```javascript
   const response = await fetch('https://YOUR-RENDER-URL.onrender.com/api/chat', {
   ```
4. Save the file

---

### Step 10: Redeploy to Vercel

1. Commit the changes to your portfolio repository:
   ```bash
   git add index.html
   git commit -m "Update chatbot API endpoint to Render backend"
   git push
   ```
2. Vercel will automatically redeploy
3. Wait for deployment to complete

---

### Step 11: Test Your Chatbot

1. Open your portfolio website
2. Click the chatbot icon (bottom-right corner)
3. Type a question like:
   - "What are your skills?"
   - "Tell me about your projects"
   - "What is your email?"
4. You should get a response!

---

## 🔧 Testing Locally (Optional)

Before deploying, you can test locally:

```bash
# Navigate to render-backend folder
cd render-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your API key
copy .env.example .env
# Edit .env and add your GROQ_API_KEY

# Run the server
python app.py
```

Open browser to: `http://localhost:5000/health`

You should see: `{"status": "healthy", "service": "usman-portfolio-chatbot"}`

---

## 🐛 Troubleshooting

### Chatbot returns 500 error
- Check Render logs for errors
- Verify `GROQ_API_KEY` is set correctly in Render dashboard
- Make sure API key is valid (test at https://console.groq.com/)

### Chatbot returns CORS error
- The `flask-cors` library handles this automatically
- Check that your Render URL is correct in `index.html`

### Slow first response (cold start)
- **Normal for free tier!** Render spins down after 15 minutes of inactivity
- First request takes 30-50 seconds, subsequent requests are fast
- Consider upgrading to paid tier for production use

### API returns "Server configuration error"
- Go to Render Dashboard → Your Service → **Environment** tab
- Make sure `GROQ_API_KEY` is set (not `GROQ_API` or other variations)
- Redeploy after adding environment variable

---

## 📊 Monitoring Your Backend

1. **Render Dashboard**: View logs, metrics, and uptime
2. **Health Check**: Visit `https://YOUR-URL.onrender.com/health`
3. **API Test**: Visit `https://YOUR-URL.onrender.com/api/chat` (GET request)

---

## 💰 Render Free Tier Limits

| Resource | Limit |
|----------|-------|
| **Bandwidth** | 100 GB/month |
| **CPU** | Shared (0.1-0.5 CPU) |
| **RAM** | 512 MB |
| **Web Services** | Unlimited (with 750 hours/month pool) |
| **Idle Timeout** | 15 minutes (service sleeps) |

**Note:** Free services sleep after 15 minutes of inactivity. First request after sleep takes 30-50 seconds to wake up.

---

## 🔐 Security Best Practices

1. **Never commit `.env`** - it's in `.gitignore` for a reason
2. **Keep API key secret** - only set it in Render dashboard
3. **Use private repository** - don't expose your code publicly
4. **Monitor usage** - check Groq dashboard for API usage

---

## 📞 Support

If you encounter issues:
1. Check Render logs: Dashboard → Logs tab
2. Check Groq API status: https://status.groq.com/
3. Test API locally first (see Testing section above)

---

## ✅ Checklist

- [ ] Got Groq API key from console.groq.com
- [ ] Created GitHub repository
- [ ] Uploaded render-backend files to GitHub
- [ ] Created Render account
- [ ] Created Web Service on Render
- [ ] Set `GROQ_API_KEY` environment variable
- [ ] Service deployed successfully (status: Live)
- [ ] Copied Render URL
- [ ] Updated `index.html` with Render URL
- [ ] Redeployed frontend to Vercel
- [ ] Tested chatbot successfully

---

**Congratulations!** Your chatbot is now live! 🎉
