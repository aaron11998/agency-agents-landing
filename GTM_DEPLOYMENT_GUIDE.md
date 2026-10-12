# GTM Deployment Guide for Agency Agents Properties

## Overview
This guide provides step-by-step instructions for deploying the GTM container (GTM-WWBXMJK) to all 11 Agency Agents properties via Vercel/Next.js.

## Prerequisites
- Access to Vercel dashboard for the Agency Agents projects
- GTM Container ID: `GTM-WWBXMJK`
- Admin access to GTM container at https://tagmanager.google.com/

## Properties Requiring Deployment

| # | Property | Vercel Project | Environment | Status |
|---|----------|----------------|-------------|--------|
| 1 | Production — Main Site | `agency-agents-landing` | Prod | ⚠️ Pending deploy |
| 2 | Production — Pricing | Same (shared layout) | Prod | ⚠️ Pending deploy |
| 3 | Production — Demo Booking | Same (shared layout) | Prod | ⚠️ Pending deploy |
| 4 | Production — Contact | Same (shared layout) | Prod | ⚠️ Pending deploy |
| 5 | Production — Apply | Same (shared layout) | Prod | ⚠️ Pending deploy |
| 6 | Staging | `agency-agents-landing` | Staging | ⚠️ Preview deploy |
| 7 | Staging — Demo | Same (shared layout) | Staging | ⚠️ Preview deploy |
| 8 | Staging — Apply | Same (shared layout) | Staging | ⚠️ Preview deploy |
| 9 | Development | `agency-agents-landing` | Dev | ⚠️ Preview deploy |
| 10 | Application | `agency-agents-app` | Prod (auth) | ⚠️ Separate project |
| 11 | Launch Landing Page | `agency-agents-landing` | Prod | ⚠️ Domain pending |

## Code Changes Ready for Deployment

### 1. Updated `app/layout.tsx` (GTM Snippet Injection)
**File**: `/scratch/age-96/landing/app/layout.tsx`

```tsx
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const GTM_CONTAINER_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-WWBXMJK";

export const metadata: Metadata = {
  title: "Agency Agents — AI-Native Agency",
  description: "170+ specialized agents deliver full-stack execution...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="font-sans antialiased bg-white text-ink-900">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {/* Google Tag Manager - Head */}
        <Script
          id="gtm-head"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');
            `,
          }}
        />
      </head>
      <body>
        {/* Google Tag Manager - Body (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
```

### 2. Middleware for Edge Deployment (Optional Enhancement)
**File**: `/scratch/age-96/landing/middleware.ts`

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const GTM_CONTAINER_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-WWBXMJK";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
```

### 3. Environment Variables Template
**File**: `/scratch/age-96/landing/.env.example`

```env
# GTM Configuration
NEXT_PUBLIC_GTM_ID=GTM-WWBXMJK
GTM_ENV=prod

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://agency-agents.com

# Resend (Email)
RESEND_API_KEY=

# Airtable
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
AIRTABLE_TABLE_NAME=Subscribers

# Slack
SLACK_WEBHOOK_URL=
```

## Vercel Deployment Steps

### Step 1: Configure Environment Variables in Vercel

1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add the following variables for **each environment**:

**Production:**
```
NEXT_PUBLIC_GTM_ID=GTM-WWBXMJK
GTM_ENV=prod
NEXT_PUBLIC_SITE_URL=https://agency-agents.com
```

**Preview (Staging/Dev):**
```
NEXT_PUBLIC_GTM_ID=GTM-WWBXMJK
GTM_ENV=staging
NEXT_PUBLIC_SITE_URL=https://staging.agencyagents.ai
```

**Development:**
```
NEXT_PUBLIC_GTM_ID=GTM-WWBXMJK
GTM_ENV=dev
NEXT_PUBLIC_SITE_URL=https://dev.agencyagents.ai
```

### Step 2: Deploy to Vercel

```bash
# From the landing page directory
cd /scratch/age-96/landing

# Install dependencies
npm install

# Build locally to verify
npm run build

# Deploy to preview (creates unique preview URL)
npx vercel --scope=altaranexus

# Deploy to production
npx vercel --prod --scope=altaranexus
```

### Step 3: Configure Custom Domains

In Vercel Dashboard → Project Settings → Domains:

1. **Production**: `agency-agents.com` + `www.agency-agents.com`
2. **Staging**: `staging.agencyagents.ai`
3. **Development**: `dev.agencyagents.ai`
4. **Production alias**: `agencyagents.ai` (if separate from main)

### Step 4: Verify Deployment

Run the verification script after deployment:

```bash
chmod +x verify-gtm-deployment.sh
./verify-gtm-deployment.sh
```

Or manually check each URL:
1. Visit the URL
2. View Page Source
3. Search for `GTM-WWBXMJK`
4. Verify both head and body snippets present

## GTM Container Configuration (Tracking Specialist)

### Workspaces to Create
1. **Dev Workspace** - For development environment
2. **Staging Workspace** - For staging/QA
3. **Production Workspace** - For production

### Tags to Configure (per AGE-208)

| Tag | Type | Trigger | Priority |
|-----|------|---------|----------|
| LinkedIn Insight Tag | Custom HTML | All Pages | High |
| Meta Pixel | GTM Template | All Pages | High |
| Google Ads Conversion | GTM Template | form_submit | High |
| GA4 Configuration | GTM Template | All Pages | High |
| GA4 Event - form_submit | GA4 Event | form_submit | High |

### Triggers to Create

1. **form_submit** (Custom Event)
   - Event name: `form_submit`
   - Conditions: None (fires on all form_submit events)

2. **Email Capture Form** (Click - All Elements)
   - Click Classes: `email-form`
   - OR Click ID: `email-form`

3. **Demo CTA** (Click - All Elements)
   - Click URL contains: `/demo`

4. **Application CTA** (Click - All Elements)
   - Click URL contains: `/apply`

### Data Layer Variables to Create

| Variable Name | Data Layer Variable | Version |
|---------------|---------------------|---------|
| `utm_source` | utm_source | 2 |
| `utm_medium` | utm_medium | 2 |
| `utm_campaign` | utm_campaign | 2 |
| `utm_content` | utm_content | 2 |
| `utm_term` | utm_term | 2 |
| `form_type` | form_type | 2 |
| `form_id` | form_id | 2 |
| `email` | email | 2 |
| `gclid` | gclid | 2 |
| `fbclid` | fbclid | 2 |
| `li_fat_id` | li_fat_id | 2 |

## Verification Checklist

### Per Property Verification
- [ ] GTM Head snippet present in `<head>`
- [ ] GTM Body (noscript) snippet present after `<body>`
- [ ] No console errors related to GTM
- [ ] GTM Preview Mode connects successfully

### GTM Container Verification
- [ ] All 5 tags configured and firing
- [ ] Triggers working on form_submit events
- [ ] Data layer variables capturing UTM params
- [ ] LinkedIn Tag Helper shows tag firing
- [ ] Meta Pixel Helper shows pixel firing
- [ ] Google Tag Assistant shows GA4 + Ads
- [ ] GA4 DebugView shows events

### Cross-Property Verification
- [ ] Production (agency-agents.com) ✅
- [ ] Production (agencyagents.ai) ✅
- [ ] Staging (staging.agencyagents.ai) ✅
- [ ] Development (dev.agencyagents.ai) ✅
- [ ] Application (app.agencyagents.ai) ✅

## Rollback Procedure

If issues detected:
1. In Vercel: Promote previous deployment
2. In GTM: Abandon workspace changes, publish previous version
3. Verify with script: `./verify-gtm-deployment.sh`

## Support Contacts

- **VP Operations**: f617f632-2e3b-49e0-8508-65d8e7b63f70 (deployment coordination)
- **Tracking Specialist**: 13d0cf7d-7c37-4688-b39b-671c6e62c0dc (GTM configuration)
- **Creative Director**: 2289deb2-5c71-4619-be33-3d54f8c52d38 (landing page code)

---

**Last Updated**: 2026-10-03
**Version**: 1.0
**Owner**: VP of Operations