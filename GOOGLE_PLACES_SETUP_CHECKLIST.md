# ✅ Google Places API Integration Checklist

## What's Been Done

- [x] Created `find-lawyers` Supabase Edge Function
- [x] Integrated with Google Places API (Text Search)
- [x] Built React component `LawyerFinder.tsx` with:
  - City search
  - GPS geolocation
  - Specialization filters
  - Lawyer details display
- [x] Removed hardcoded API key from code
- [x] Added API key validation in Edge Function
- [x] Created `.env.example` template

## What You Need to Do

### 🔐 Step 1: Secure the Exposed API Key (URGENT)

**Your current API key is exposed: `AIzaSyC1Vpu2Jy_TcCshBAEeTxDsxGHCljYNGqw`**

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find and delete the exposed key
3. Create a new API key
4. Apply restrictions:
   - **API restrictions:** Places API only
   - **Application restrictions:** HTTP referrers (for your domain)

### 📝 Step 2: Add API Key to Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Project → Settings → Edge Functions
3. Add environment variable:
   ```
   Key: GOOGLE_PLACES_API_KEY
   Value: <your-new-api-key>
   ```
4. Redeploy `find-lawyers` function

### 🧪 Step 3: Test Locally

```bash
# Start dev server
npm run dev

# Go to /dashboard
# Click on a lawyer-finding feature
# Try searching by city or location
```

### 🚀 Step 4: Deploy to Production

```bash
# Commit and push your changes
git add -A
git commit -m "Security: Secure Google Places API key in environment variables"
git push origin main

# Supabase will auto-deploy Edge Functions
```

## File Changes Summary

### Modified Files
- `supabase/functions/find-lawyers/index.ts` - Removed hardcoded API key, added validation

### New Files
- `supabase/functions/find-lawyers/.env.example` - Template for environment variables
- `SETUP_GOOGLE_PLACES_API.md` - Detailed setup guide
- `GOOGLE_PLACES_SETUP_CHECKLIST.md` - This file

### Existing Components
- `src/components/LawyerFinder.tsx` - Already fully functional
- `src/integrations/supabase/client.ts` - Supabase client ready

## 🎯 Feature Overview

### What Users Can Do

1. **Search by Location**
   - Type city name
   - Or use GPS to find nearby lawyers
   - Search radius: 30km default

2. **Filter by Specialization**
   - Criminal Law
   - Family Law
   - Property Law
   - Business Law
   - And 8+ more options

3. **View Lawyer Details**
   - Name, address, phone
   - Google ratings and reviews
   - Distance from user
   - Open/closed status
   - Website link

4. **Take Action**
   - Call lawyer (direct or copy number)
   - Get Google Maps directions
   - Visit website

## 📊 API Costs

- **Free tier:** $200/month credit
- **Typical cost:** ~$0.50 per 100 lawyers found
- **No cost for viewing results** (only API calls cost)

Monitor at: [Google Cloud Console → Billing](https://console.cloud.google.com/billing)

## 🔗 Helpful Links

- [Google Places API Docs](https://developers.google.com/maps/documentation/places/web-service)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Your Supabase Dashboard](https://supabase.com/dashboard)
- [Google Cloud Console](https://console.cloud.google.com)

## ❓ Need Help?

1. Read `SETUP_GOOGLE_PLACES_API.md` for detailed instructions
2. Check `supabase/functions/find-lawyers/index.ts` for function logic
3. Check `src/components/LawyerFinder.tsx` for UI component

---

**Status:** ✅ Ready to Deploy (after you secure the API key)
