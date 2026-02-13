# 🚀 Deployment Guide (Vercel)

This guide outlines how to deploy **Outrexo** to [Vercel](https://vercel.com), the recommended platform for Next.js applications.

## Prerequisites

1.  **GitHub Repository**: Ensure your code is pushed to a GitHub repository.
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
3.  **Cloud Database**: Since Vercel is serverless, you need a cloud-hosted PostgreSQL database. We recommend **Neon**, **Supabase**, or **Vercel Postgres**.

---

## 1. Database Setup (Neon / Vercel Postgres)

You cannot use the local Docker database for a Vercel deployment.

### Option A: Vercel Postgres (Easiest)
1.  Go to your Vercel Dashboard -> Storage -> Create Database -> Postgres.
2.  Connect it to your Vercel project (once created).
3.  Copy the environment variables (automatically added or viewable in settings).

### Option B: Neon (Recommended for Free Tier)
1.  Create a project at [neon.tech](https://neon.tech).
2.  Get the **Connection String** (Pooled connection is best for serverless).
3.  You might need a Shadow Database URL for Prisma migrations if using a pooled connection, but typically Neon handles this well with just one URL for simple setups, or `DIRECT_URL` and `DATABASE_URL`.

---

## 2. Environment Variables

Configure the following environment variables in your Vercel Project Settings:

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | Connection string to your cloud DB | `postgres://user:pass@host/db` |
| `AUTH_SECRET` | Secret key for NextAuth | Run `npx auth secret` to generate |
| `AUTH_URL` | **NOT NEEDED on Vercel** | (Vercel sets this automatically) |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console | `...apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console | `GOCSPX-...` |
| `OPENROUTER_API_KEY` | For AI features | `sk-or-...` |

> [!IMPORTANT]
> **Google OAuth Redirect URI**: Update your Google Cloud Console Authorized/Redirect URIs to include your Vercel production domain:
> `https://your-project.vercel.app/api/auth/callback/google`

---

## 3. Deployment Steps

1.  **Push to GitHub**: Make sure all your changes (including `prisma/schema.prisma`) are committed and pushed.
2.  **Import to Vercel**:
    *   Go to Vercel Dashboard -> Add New -> Project.
    *   Import your `Outrexo` repository.
3.  **Configure Project**:
    *   **Framework Preset**: Next.js (should detect automatically).
    *   **Build Command**: `next build` (default).
    *   **Install Command**: `npm install` (default).
    *   **Environment Variables**: expand the section and add the variables from Step 2.
4.  **Deploy**: Click "Deploy".

---

## 4. Post-Deployment (Database Migration)

During the build process, `postinstall` script runs `prisma generate`. However, you need to push your schema schema to the production database.

**Option A: Build Command Override (Best for CI/CD)**
Change the Build Command in Vercel settings to:
```bash
npx prisma migrate deploy && next build
```
*Note: This requires you to have created migrations locally using `npx prisma migrate dev`.*

**Option B: Manual Push (Easiest for first time)**
Run this locally from your terminal, pointing to the PRODUCTION database:
```bash
DATABASE_URL="your_production_connection_string" npx prisma db push
```

---

## Troubleshooting

### "Prisma Client not initialized"
Ensure `npx prisma generate` runs during build (it usually does automatically in `postinstall` or Vercel detects it).

### Google Auth Error "redirect_uri_mismatch"
This means you haven't added the `https://your-outrexo.vercel.app/api/auth/callback/google` URL to your Google Cloud Console credentials.
