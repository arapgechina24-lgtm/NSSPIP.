# Deployment Guide

## Option 1: One-Click Deploy (Recommended)

1. Go to the [GitHub Repository](https://github.com/arapgechina24-lgtm/NSSPIP).
2. Scroll to the **Deploy with Vercel** button in the README.
3. Click it. Vercel will ask to clone the repo to your account.
4. When prompted for Environment Variables, you MUST provide:
   - `DATABASE_URL`: Connection string for your PostgreSQL database (Use [Neon.tech](https://neon.tech) or Vercel Postgres for a free one).

## Option 2: Manual Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** > **Project**.
3. Select `NSSPIP`.
4. In **Environment Variables**:
   - Add `DATABASE_URL`.
5. Click **Deploy**.

## Database Setup (Crucial)

Since Vercel is serverless, you cannot use the local SQLite file easily for writing data.

1. Create a free Postgres database on [Neon.tech](https://neon.tech).
2. Copy the connection string (e.g., `postgres://user:pass@ep-xyz.aws.neon.tech/neondb...`).
3. Paste it as `DATABASE_URL` in Vercel.
4. Once deployed, run the schema push locally to update the remote DB:

   ```bash
   # In your local terminal
   export DATABASE_URL="your-neon-connection-string"
   npx prisma db push
   npm run seed
   ```
