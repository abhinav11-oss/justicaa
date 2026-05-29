# Google Places API Setup for Lawyer Finder

## Overview
The Lawyer Finder feature uses Google Places API to find lawyers and advocates across India. The API key is now stored securely in Supabase environment variables.

## 🔐 Security Setup

### Step 1: Secure Your API Key (IMPORTANT!)
Your API key was exposed in the commit. Please:

1. **Revoke the current key immediately:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Find `AIzaSyC1Vpu2Jy_TcCshBAEeTxDsxGHCljYNGqw` in your credentials
   - Delete it

2. **Create a new API key with restrictions:**
   - In Google Cloud Console, create a new API key
   - Restrict it to:
     - **API restrictions:** Places API, Maps JavaScript API
     - **Application restrictions:** HTTP referrers (for web)
     - **IP restrictions:** Add your Supabase Edge Functions IP (from your project)

### Step 2: Configure Supabase Environment Variable

**For Production (Supabase Cloud):**

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → Settings → Edge Functions
3. Add a new environment variable:
   - Key: `GOOGLE_PLACES_API_KEY`
   - Value: `<your-new-google-api-key>`
4. Redeploy the `find-lawyers` function

**For Local Development:**

1. Create `.env.local` in your project root:
```bash
SUPABASE_ACCESS_TOKEN=your_supabase_access_token
```

2. The `find-lawyers` function will use `Deno.env.get('GOOGLE_PLACES_API_KEY')`

## 🔧 How It Works

### Frontend (React Component)
- **File:** `src/components/LawyerFinder.tsx`
- User enters city or uses geolocation
- Calls Supabase Edge Function: `find-lawyers`

### Backend (Supabase Edge Function)
- **File:** `supabase/functions/find-lawyers/index.ts`
- Takes location + specialization filters
- Calls Google Places API (Text Search)
- Fetches phone numbers, ratings, and photos
- Returns structured lawyer data

### Data Flow
```
User Input → LawyerFinder Component 
    ↓
supabase.functions.invoke('find-lawyers')
    ↓
Supabase Edge Function
    ↓
Google Places API
    ↓
Parse & Return Lawyers
    ↓
Display in LawyerFinder Component
```

## 📋 Features Implemented

✅ **Search by Location:**
- City name search
- GPS geolocation
- Radius search (30km default)

✅ **Search by Specialization:**
- Criminal Law
- Family Law
- Property Law
- Business Law
- Tax Law
- And 6+ more options

✅ **Display Information:**
- Name, address, rating, reviews
- Phone number (with copy button)
- Google Maps link
- Distance (if GPS enabled)
- Open/Closed status
- Photo gallery

✅ **User Actions:**
- Call lawyer directly
- Get Google Maps directions
- Visit website
- Copy phone number

## 🚀 Deployment

### Local Testing
```bash
npm run dev
# Access /dashboard and try Lawyer Finder
```

### Deploy to Production
```bash
# Push your code
git push origin main

# Supabase automatically deploys Edge Functions
# Verify in Supabase Dashboard → Edge Functions → find-lawyers
```

## ⚡ Performance Optimization

The function:
- Caches up to 20 lawyer results
- Uses async/parallel requests for details
- Sorts by distance (if user location available)
- Falls back to rating if no location data

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "API key not configured" | Add `GOOGLE_PLACES_API_KEY` to Supabase env vars |
| No lawyers found | Try a different city or expand search radius |
| Phone numbers missing | Some businesses don't have phone numbers on Google Maps |
| Rate limit errors | Google Places API has quotas - check Cloud Console |

## 📊 Google Places API Quota

Free tier includes:
- **$200/month** free credit
- Text Search: $2.50 per 1000 requests
- Place Details: $1.50 per 1000 requests
- Photos: $7.00 per 100,000 requests

**Example cost:** Finding 100 lawyers = ~$0.50

Monitor usage in [Google Cloud Console](https://console.cloud.google.com/project/_/usage).

## 🔄 Future Improvements

- [ ] Save favorite lawyers to profile
- [ ] Filter by ratings and reviews
- [ ] Filter by language spoken
- [ ] Integration with law firm directories
- [ ] Booking/consultation scheduling
- [ ] Review system for lawyers

## 📞 Support

- **Google Places API Docs:** https://developers.google.com/maps/documentation/places/web-service
- **Supabase Edge Functions:** https://supabase.com/docs/guides/functions
- **Report Issues:** Contact abhinavlodhi99@gmail.com
