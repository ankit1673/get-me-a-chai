# Security Guide - Environment Variables Setup

## ⚠️ Important: Never Commit `.env.local` or Secrets to GitHub

This project uses sensitive credentials for OAuth and Payment Processing. Follow these steps to set up your environment safely.

## 📋 Setup Instructions

### 1. Copy the Example File
```bash
cp .env.example .env.local
```

### 2. Fill in Your Credentials

#### GitHub OAuth Setup
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: GetMeAChai
   - **Homepage URL**: `http://localhost:3000` (for local development)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copy the **Client ID** and **Client Secret** to `.env.local`:
   ```
   GITHUB_ID=your_client_id
   GITHUB_SECRET=your_client_secret
   ```

#### Razorpay Payment Setup
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/app/settings/api-keys)
2. Copy your **Key ID** (public) and **Key Secret** (private)
3. Add to `.env.local`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=your_secret_key
   KEY_ID=rzp_test_xxxxx
   KEY_SECRET=your_secret_key
   NEXT_PUBLIC_KEY_ID=rzp_test_xxxxx
   ```

#### NextAuth Secret
Generate a secure random secret:
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Add to `.env.local`:
```
NEXTAUTH_SECRET=your_generated_secret
```

### 3. Update for Production (Vercel Deployment)
When deploying to Vercel, update these URLs:
```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_URL=https://your-domain.vercel.app
```

Also update GitHub OAuth:
1. Go to your GitHub OAuth App Settings
2. Change **Authorization callback URL** to: `https://your-domain.vercel.app/api/auth/callback/github`
3. Change **Homepage URL** to: `https://your-domain.vercel.app`

## 🔐 Security Best Practices

✅ **DO:**
- Keep `.env.local` in `.gitignore` (it's already there!)
- Rotate secrets regularly in production
- Use different credentials for development vs production
- Never share your secret keys in code or chat
- Use Vercel's built-in environment variable management for production

❌ **DON'T:**
- Commit `.env.local` to GitHub
- Share your secret keys via email or chat
- Use the same test keys in production
- Log or print secret values
- Hardcode credentials in code

## 🚀 Vercel Deployment
When setting up Vercel:
1. Connect your GitHub repository
2. In Vercel Dashboard → Project Settings → Environment Variables
3. Add all production credentials (they're encrypted and secure)
4. Redeploy after adding environment variables

## ✅ Verification Checklist
- [ ] `.env.local` is created from `.env.example`
- [ ] `.env.local` is in `.gitignore`
- [ ] All secrets are filled in `.env.local`
- [ ] Local development works: `npm run dev`
- [ ] GitHub OAuth login works
- [ ] Razorpay payment flow works
- [ ] Production URLs are different from dev URLs

---

**Questions?** Check the MongoDB connection in `db/connectDb.js` and ensure MongoDB URI is also in environment variables for production!
