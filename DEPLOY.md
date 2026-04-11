# Granted Path — Deployment Guide

Step-by-step guide to deploying Granted Path to production. Assumes you have already created accounts on: Vercel, Neon, Upstash, Stripe, Anthropic, Resend, and (optionally) Sentry and PostHog.

---

## 1. Infrastructure Setup (before first deploy)

### 1.1 Database — Neon (Postgres)
1. Create a new project at [neon.tech](https://neon.tech) — choose region `eu-central-1` (Frankfurt).
2. Create a database named `grantedpath`.
3. From the dashboard, copy both connection strings:
   - **Pooled** (pgbouncer) → `DATABASE_URL`
   - **Direct** → `DIRECT_URL`
4. Run migrations locally first:
   ```bash
   DIRECT_URL="..." npx prisma migrate deploy
   ```

### 1.2 Redis — Upstash
1. Create a database at [upstash.com](https://upstash.com/redis) — region `eu-west-1`.
2. Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

### 1.3 Anthropic API
1. Create an API key at [console.anthropic.com](https://console.anthropic.com).
2. Set a monthly spend limit (recommended: start with $500).
3. Copy the key to `ANTHROPIC_API_KEY`.

### 1.4 Stripe
1. Switch to **live mode** in [dashboard.stripe.com](https://dashboard.stripe.com).
2. Create products + prices:
   - Starter €10/mo + €100/yr
   - Pro €30/mo + €300/yr
   - Master €60/mo + €600/yr
   - (Plus Education + Business tiers as needed)
3. Copy all 6+ price IDs into env vars.
4. Create a webhook:
   - URL: `https://grantedpath.com/api/stripe/webhook`
   - Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`
   - Copy signing secret → `STRIPE_WEBHOOK_SECRET`

### 1.5 Resend
1. Verify your domain at [resend.com/domains](https://resend.com/domains): `grantedpath.com`.
2. Add the required DNS records (SPF, DKIM, DMARC) to your domain registrar.
3. Create an API key → `RESEND_API_KEY`.

### 1.6 (Optional) PostHog & Sentry
- [PostHog](https://app.posthog.com): create project, copy `NEXT_PUBLIC_POSTHOG_KEY`.
- [Sentry](https://sentry.io): create project (Next.js), copy DSN to `NEXT_PUBLIC_SENTRY_DSN`.

---

## 2. Vercel Deployment

### 2.1 Import project
1. Log into [vercel.com](https://vercel.com).
2. Click **Add New → Project**.
3. Connect the `Granted-Path` GitHub repo.
4. Framework preset: **Next.js** (auto-detected).
5. Root directory: leave as `.`.
6. Build command: default (`next build`).
7. Install command: default (`npm install`).

### 2.2 Environment variables
Copy all vars from `.env.example` into Vercel's env settings (**Settings → Environment Variables**). Mark each as:
- **Production** — real values
- **Preview** — can use test/staging values
- **Development** — optional, for local `vercel dev`

**Critical:** Do NOT set `NODE_ENV` — Vercel manages it.

Make sure these match your setup:
```
NEXT_PUBLIC_APP_URL=https://grantedpath.com
AUTH_URL=https://grantedpath.com
AUTH_TRUST_HOST=true
```

### 2.3 Deploy
1. Click **Deploy**.
2. Wait ~2–5 minutes for first build.
3. Vercel assigns a temporary `.vercel.app` URL — test it.

### 2.4 Custom domain
1. **Settings → Domains → Add** → `grantedpath.com` + `www.grantedpath.com`.
2. Add DNS records at your registrar (Namecheap/Cloudflare/etc.):
   - `A` record `@` → `76.76.21.21`
   - `CNAME` `www` → `cname.vercel-dns.com`
3. Wait for SSL provisioning (~5 min).

---

## 3. Post-Deploy Checklist

- [ ] Visit `https://grantedpath.com` and verify the landing page loads
- [ ] Visit `/api/health` and confirm all services are `operational`
- [ ] Test signup flow end-to-end (email or OAuth)
- [ ] Create a test Stripe subscription using test card `4242 4242 4242 4242`
- [ ] Trigger a Stripe webhook event and verify it reaches `/api/stripe/webhook`
- [ ] Send a test email (signup welcome) and verify delivery
- [ ] Test AI chat streaming works in production
- [ ] Verify sitemap is accessible at `/sitemap.xml`
- [ ] Verify robots.txt at `/robots.txt`
- [ ] Run Lighthouse on home page — target 90+ across all metrics
- [ ] Check Sentry is receiving errors (trigger a test error)
- [ ] Check PostHog is receiving events
- [ ] Add your email to `BOOTSTRAP_ADMIN_EMAIL` and visit `/admin/dashboard`
- [ ] Verify `/admin/*` routes require auth (non-admins should be blocked)

---

## 4. First Week Monitoring

**Daily checks for the first 7 days:**
1. **AI spend** — check Anthropic dashboard vs. budget
2. **Stripe failed payments** — retry or reach out to users
3. **Error rate** — Sentry should show <0.5% of sessions
4. **Signup flow** — test at least 1 new account per day yourself
5. **Response times** — Vercel Analytics → target p95 < 1.5s

---

## 5. Cron Jobs

Vercel Cron is configured in `vercel.json`. Confirm in **Vercel → Crons** tab:
- `0 4 * * *` — Spaced repetition calculation (daily 4am UTC)
- `0 8 * * 1` — Weekly digest email (Mondays 8am UTC)
- `0 */6 * * *` — Forgotten topic check (every 6h)

These routes must exist in `src/app/api/cron/` and check `CRON_SECRET` header.

---

## 6. Rollback

If a deploy breaks production:
1. **Vercel → Deployments** → find last good deploy
2. Click **⋯ → Promote to Production**
3. Rollback completes in <30 seconds (no rebuild)

Database rollbacks are harder — always test Prisma migrations on preview first.

---

## 7. Going Live — Launch Checklist

- [ ] Domain verified and SSL green
- [ ] All env vars set for Production
- [ ] Stripe in live mode, prices created
- [ ] Resend domain verified, SPF/DKIM/DMARC green
- [ ] Legal pages reviewed by lawyer (terms, privacy, GDPR)
- [ ] Privacy policy updated with real DPO contact
- [ ] Cookie banner active
- [ ] Admin panel accessible to your email only
- [ ] Waitlist `/beta` works and captures emails
- [ ] Social media previews tested (OG tags, Twitter cards)
- [ ] Analytics firing (PostHog)
- [ ] Sentry firing
- [ ] Backup strategy tested (Neon has PITR — test a restore)
- [ ] Support email `support@grantedpath.com` set up and monitored
- [ ] Launch announcement drafted (Twitter, Product Hunt, LinkedIn)

---

## Troubleshooting

**"Auth not working" after deploy**: verify `AUTH_URL`, `AUTH_SECRET`, `AUTH_TRUST_HOST=true`. OAuth callback URLs must match the Vercel domain exactly.

**"Database connection timeout"**: check Neon connection pooler (`DATABASE_URL` should contain `?pgbouncer=true`). Edge functions need HTTP-based clients.

**"Stripe webhook signature invalid"**: make sure you're using the **live** webhook secret, not test mode. Stripe uses different secrets for each.

**"AI chat hangs"**: check Anthropic API key and spend limit. Check `maxDuration` in `vercel.json` for the chat route (default 60s).

**"Emails not arriving"**: check Resend dashboard → Logs. If they show "delivered", problem is on the recipient end (spam filter). If "failed", check DNS records.

---

Questions? Email engineering@grantedpath.com or check the internal runbook.
