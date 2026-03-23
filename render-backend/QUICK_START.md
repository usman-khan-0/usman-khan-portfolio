# 🚀 QUICK START: Deploy Chatbot to Render

## Files Created

```
render-backend/
├── app.py              # Flask backend API
├── requirements.txt    # Dependencies (flask, flask-cors, openai, gunicorn)
├── .env.example        # Environment variable template
├── .gitignore          # Git ignore rules
└── README.md           # Full deployment guide
```

## ⚡ Fast Deployment (10 minutes)

### 1. Get Groq API Key
- Visit: https://console.groq.com/keys
- Create API key
- Copy it (starts with `gsk_...`)

### 2. Upload to GitHub
```bash
cd "E:\Projects\New Portfolio\usman-khan-portfolio\render-backend"
git init
git add .
git commit -m "Portfolio chatbot backend"
git remote add origin https://github.com/YOUR_USERNAME/usman-portfolio-chatbot.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Render
1. Go to https://render.com
2. Sign in with GitHub
3. **New +** → **Web Service**
4. Connect your `usman-portfolio-chatbot` repository
5. Settings:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Instance**: Free
6. Add Environment Variable:
   - Key: `GROQ_API_KEY`
   - Value: Your Groq API key
7. Click **Create Web Service**

### 4. Update Frontend
1. Wait for Render deployment (2-5 minutes)
2. Copy your Render URL (e.g., `https://xxx.onrender.com`)
3. Open `index.html` (line 5534)
4. Replace:
   ```javascript
   const RENDER_BACKEND_URL = 'YOUR_RENDER_URL_HERE';
   ```
   With:
   ```javascript
   const RENDER_BACKEND_URL = 'https://your-app.onrender.com';
   ```
5. Save and push to GitHub (Vercel will auto-deploy)

### 5. Test
- Open your portfolio
- Click chatbot icon
- Ask: "What are your skills?"
- ✅ Should get response!

---

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| 500 Error | Check `GROQ_API_KEY` in Render dashboard |
| CORS Error | Verify Render URL is correct in `index.html` |
| Slow first response | Normal! Free tier sleeps after 15 min |
| Build fails | Check `requirements.txt` is in root of repo |

---

## 📊 Monitor

- **Render Logs**: Dashboard → Logs tab
- **Health Check**: `https://YOUR-URL.onrender.com/health`
- **API Test**: `https://YOUR-URL.onrender.com/api/chat`

---

## 💡 Important Notes

- **Free tier sleeps** after 15 minutes of inactivity
- First request after sleep takes **30-50 seconds**
- Subsequent requests are fast (~1-2 seconds)
- **Never commit `.env`** - API key stays in Render dashboard only

---

## 📞 Need Help?

Read the full guide: `render-backend/README.md`
