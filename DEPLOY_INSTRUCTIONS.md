# 🚀 Deployment Guide (100% Free)

This guide will help you deploy the **Backend on Render** and the **Frontend on Vercel**.

---

## 📦 Step 1: Prepare Your Code
1. Push your code to a **GitHub Repository**.
   - Make sure you have the `backend` and `frontend` folders in the root of your repo.

---

## 🌍 Step 2: Deploy Backend (Render)
Render offers a free tier for web services.

1. Go to [dashboard.render.com](https://dashboard.render.com/) and create a new **Web Service**.
2. Connect your GitHub repository.
3. Configure the settings:
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
4. **Environment Variables** (Scroll down to "Environment"):
   - `PYTHON_VERSION`: `3.11.0` (Optional, helps stability)
   - `GROQ_API_KEY`: `gsk_...` (Your actual Groq key)
   - `SECRET_KEY`: `any_random_secure_string`
5. Click **Deploy Web Service**.
6. ⏳ Wait for it to build. Once live, copy your backend URL (e.g., `https://askdb-backend.onrender.com`).

---

## ⚡ Step 3: Deploy Frontend (Vercel)
Vercel is the industry standard for deploying React/Vite apps correctly.

1. Go to [vercel.com](https://vercel.com/) and click **Add New Project**.
2. Import the same GitHub repository.
3. Configure the settings:
   - **Root Directory**: Click "Edit" and select `frontend`.
   - **Framework Preset**: Vite (should be auto-detected).
4. **Environment Variables**:
   - `VITE_API_URL`: Paste your Render Backend URL from Step 2 (e.g., `https://askdb-backend.onrender.com`).  
     *Note: Do not add a trailing slash `/`.*
5. Click **Deploy**.

---

## ✅ Step 4: Final Check
1. Open your new Vercel App URL.
2. Login with `admin` / `admin`.
3. Go to **Connect**.
4. Important: To connect to a database from the cloud, your database (AWS RDS, PlanetScale, Neon, or Railway) must be **publicly accessible** or allow traffic from Render's IP.
   - If you are testing with a local MySQL (XAMPP/localhost), **it will NOT work** online because the cloud server cannot see your laptop.
   - **Solution**: Use a free cloud database like [Aiven](https://aiven.io/mysql) or [TiDB](https://tidbcloud.com/) for testing.

---

**Enjoy your production app!** 
