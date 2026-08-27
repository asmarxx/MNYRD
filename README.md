# MNYRD MVP v0.4

## What's new
- New premium MNYRD visual identity based on the approved design.
- Dynamic homepage stats from Supabase.
- Latest supplier requests and categories on the homepage.
- Existing supplier search, questions, login, recommendations and WhatsApp flow preserved.
- `/admin` management dashboard.
- Live admin notification center for new suppliers, questions, recommendations, feedback, reports and supplier claims.

## Upgrade from v0.3
1. Replace your local repository files with this v0.4 folder (keep your own `.env.local` only if you use one locally).
2. In Supabase SQL Editor run `supabase/v0.4-admin-notifications.sql` once.
3. At the bottom of that SQL file, copy the commented admin UPDATE, replace `YOUR_EMAIL` with your login email, and run it separately.
4. Commit and Push in GitHub Desktop.
5. Vercel should redeploy automatically.
6. Sign in and open `/admin`.

No new Vercel environment variables are required. Existing `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` remain unchanged.
