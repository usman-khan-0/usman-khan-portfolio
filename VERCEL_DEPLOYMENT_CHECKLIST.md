# ✅ VERCEL CHATBOT - DEPLOYMENT CHECKLIST

## Files Ready for Vercel Deployment

### ✅ Backend Files
```
api/
├── index.py           # Vercel serverless function (handler class)
├── requirements.txt   # Dependencies: openai==1.6.0
└── runtime.txt        # Python version: 3.12.x
```

### ✅ Configuration Files
```
├── vercel.json        # Routes /api/chat → /api/index.py
├── .vercelignore      # Excludes dev files from deployment
└── index.html         # Frontend with CHATBOT_API_URL = '/api/chat'
```

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Get Groq API Key
1. Go to https://console.groq.com/keys
2. Sign up / Log in
3. Click **"Create API Key"**
4. Copy the key (starts with `gsk_...`)

### Step 2: Add Environment Variable to Vercel
1. Go to **Vercel Dashboard** → Your Portfolio Project
2. Click **Settings** tab
3. Click **Environment Variables** (left sidebar)
4. Click **Add New**
5. Fill in:
   - **Name:** `GROQ_API_KEY`
   - **Value:** `gsk_xxxxxxxxxxxxxx` (your actual key)
   - **Environments:** ✅ Check all 3 boxes (Preview, Production, Development)
6. Click **Save**

### Step 3: Push Changes to GitHub
```bash
cd "E:\Projects\New Portfolio\usman-khan-portfolio"
git add api/requirements.txt api/runtime.txt vercel.json index.html
git commit -m "Fix Vercel chatbot backend - add Python runtime config"
git push
```

### Step 4: Wait for Redeployment
- Vercel will automatically redeploy
- Takes **1-2 minutes**
- Watch progress in Vercel dashboard

### Step 5: Test Chatbot
1. Open your portfolio website
2. Click chatbot icon (bottom-right corner)
3. Type: **"What are your skills?"**
4. ✅ You should get a response!

---

## 🔧 What Was Fixed

| Issue | Fix |
|-------|-----|
| Missing `api/requirements.txt` | ✅ Created with `openai==1.6.0` |
| Wrong `runtime.txt` format | ✅ Changed from `python-3.12` to `3.12.x` |
| `vercel.json` runtime error | ✅ Removed invalid runtime specification |
| Frontend API URL | ✅ Set to `/api/chat` (Vercel serverless) |

---

## 🧪 Test Endpoints

### Health Check (GET)
```
https://your-portfolio.vercel.app/api/chat
```
Expected response:
```json
{
  "status": "API is working! Use POST to chat."
}
```

### Chat Endpoint (POST)
```
https://your-portfolio.vercel.app/api/chat
Content-Type: application/json
Body: {"message": "What are your skills?"}
```

---

## 🐛 Troubleshooting

### Error: "API request failed"
**Cause:** Vercel hasn't finished deploying or `GROQ_API_KEY` is missing

**Fix:**
1. Check Vercel dashboard → Deployments → Wait for "Ready"
2. Verify `GROQ_API_KEY` is set in Settings → Environment Variables

---

### Error: "Server configuration error: GROQ_API_KEY not set"
**Cause:** Environment variable not configured

**Fix:**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add `GROQ_API_KEY` with your Groq API key
3. Redeploy (Vercel usually auto-redeploys after adding env var)

---

### Error: "Function Runtimes must have a valid version"
**Cause:** Incorrect `vercel.json` or `runtime.txt` format

**Fix:**
- ✅ `vercel.json` should only have `rewrites` (no `functions` block)
- ✅ `runtime.txt` should contain: `3.12.x`

---

### Chatbot takes too long to respond
**Cause:** Cold start (first request after deployment)

**Fix:**
- Wait 5-10 seconds for first response
- Subsequent requests will be fast (~1-2 seconds)
- This is normal for serverless functions

---

## 📊 Vercel Serverless Benefits

| Feature | Benefit |
|---------|---------|
| **No Card Required** | Free tier with unlimited serverless functions |
| **Auto-Scaling** | Handles traffic spikes automatically |
| **Global CDN** | Fast response worldwide |
| **Zero Config** | Automatic HTTPS, no server management |
| **Always On** | No cold start after first invocation |

---

## ✅ Checklist

- [ ] `api/index.py` exists with handler class
- [ ] `api/requirements.txt` has `openai==1.6.0`
- [ ] `api/runtime.txt` has `3.12.x`
- [ ] `vercel.json` has rewrite rule for `/api/chat`
- [ ] `.vercelignore` excludes dev files
- [ ] `GROQ_API_KEY` added to Vercel dashboard
- [ ] Changes pushed to GitHub
- [ ] Vercel deployment shows "Ready"
- [ ] Chatbot responds to messages

---

**🎉 Your chatbot is ready to go!**
