# Phase 1 Setup Guide

## 1. Install dependencies

```bash
npm install
```

---

## 2. Upstash Redis Setup (~3 minutes, free)

Upstash Redis is the direct replacement for the now-sunset Vercel KV.
Same Redis API, same commands, no infrastructure to manage.

### Create your database

1. Go to [console.upstash.com](https://console.upstash.com) and sign up (free)
2. Click **Create Database**
3. Name it `portfolio-db`
4. Select the region closest to your users (e.g. `ap-south-1` for India)
5. Keep **TLS** enabled → click **Create**

### Get your credentials

On your database page, scroll to **REST API** section. Copy:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

### Add to local environment

Create `.env.local` in your project root:

```env
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

### Add to Vercel (for production)

In your Vercel project → **Settings** → **Environment Variables**, add the same two values.

---

## 3. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000/user/create](http://localhost:3000/user/create), fill the form and submit. You'll be redirected to `/user/your-slug`.

---

## Upstash free tier limits

| Limit | Value |
|---|---|
| Requests/day | 10,000 |
| Storage | 256 MB |
| Databases | 1 |
| Bandwidth | 200 MB/day |

More than enough for this project. No credit card required.

---

## What Phase 1 delivers

| Feature | Status |
|---|---|
| Form with full validation | ✅ |
| Real-time slug availability check | ✅ |
| Auto-generated slug from name | ✅ |
| Saves portfolio to Upstash Redis | ✅ |
| Redirects to live `/user/[slug]` | ✅ |
| Dynamic rendering for any new user | ✅ |
| Legacy users (sahilahuja1729, nimishmadan) | ✅ still work |
| Rate limiting (3 per IP per day) | ✅ |
| View counter per portfolio | ✅ |
| 404 for unknown slugs | ✅ |

---

## File overview

| File | Purpose |
|---|---|
| `src/lib/schema.ts` | Zod schema — single source of truth for data shape |
| `src/lib/storage.ts` | Upstash Redis abstraction — save, fetch, rate limit, views |
| `src/app/api/portfolio/route.ts` | POST — validates, rate-limits, saves portfolio |
| `src/app/api/portfolio/check-slug/route.ts` | GET — real-time slug availability |
| `src/components/UserForm.tsx` | Fully wired form with validation and submit |
| `src/app/user/[id]/page.tsx` | Dynamic portfolio — Upstash first, legacy fallback |
