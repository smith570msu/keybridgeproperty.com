# Keybridge Properties — Website README

## Before Launch: Owner Checklist

### 1. Phone number
The code uses **(248) 890-1427** from the business card.  
The old GoHighLevel site used (248) 268-0909. **Confirm the correct number before going live.**

### 2. Form endpoint
Open `main.js` and set `FORM_ENDPOINT` to your GoHighLevel / LeadConnector webhook URL.  
Until it's set, the form shows the success state locally but does not submit.

### 3. Tracking IDs
In `main.js`, set `GA4_ID`, `ADS_ID`, and `META_PIXEL_ID` when accounts are ready.  
Until set, no tags fire. The tag slots are commented out in each page's `<head>`.

### 4. Logo (important visual upgrade)
The current logo PNG has a white background. On the cream/white header this looks fine  
but a **transparent-background PNG or SVG** will look significantly cleaner.  
When Niki provides one, swap the `src` in the `<img>` tag — the code has a comment marking the spot.

### 5. Social proof section
The "Seller Stories" section ships with the `hidden` attribute — it is invisible to visitors.  
**Do not unhide it until you have real seller testimonials.**  
When ready: remove the `hidden` attribute from the `<section class="social-proof">` element  
and replace the placeholder text. Fabricated reviews violate FTC rules.

### 6. About section copy
The bio paragraph is a sensible default. Update it to match Niki's preferred voice before launch.

### 7. Stat bar numbers
The stat bar (24 hrs / $0 / 7 days) is marked with owner-editable comments in the HTML.  
Update numbers to reflect actual averages once you have data.

### 8. Privacy policy and terms
`/privacypolicy/` and `/terms/` are linked but not built. Create these pages in the design system.  
The privacy policy **must state** that SMS opt-in consent and phone numbers are not shared  
with or sold to third parties — required for TCPA compliance and A2P 10DLC registration.  
Have Niki or an attorney approve the final legal text.

### 9. 301 redirect map
Pull the indexed URL list from Google Search Console > Pages report.  
At minimum, redirect the old GHL privacy/terms URLs to `/privacypolicy/` and `/terms/`.

### 10. Host / DNS
Current site runs on GoHighLevel. Launch steps:
- Point DNS to new host
- If GHL CRM/webhooks are still needed for leads, keep the GHL account alive and set `FORM_ENDPOINT` to its webhook

---

## Off-Page SEO (owner tasks — not handled in code)

Search rankings for "sell my house fast Detroit" are contested by national iBuyers and  
established local investors. On-page alone will not rank these terms.

1. **Google Business Profile** — Create or claim as a service-area business (hide address).  
   Category: "Real estate investment company." This drives map pack clicks — the highest-volume  
   placement for "cash home buyers near me" queries.

2. **Google reviews** — Collect a review from every closed seller. Reviews are the dominant  
   map pack ranking factor. Even 10 reviews outperforms competitors with zero.

3. **Local citations** — Build consistent name/phone/URL listings and 2–3 local backlinks  
   (chamber, local news, REIA directories).

4. **Realistic near-term SEO wins:**  
   - `/behind-on-property-taxes-michigan/` — high urgency, relatively low competition  
   - `/sell-inherited-house-michigan/` — problem-intent, differentiated content  
   Head terms ("sell my house fast Detroit") are a 12-month project.

5. **Google Search Console** — Verify the domain, submit `sitemap.xml`.

---

## Page Inventory (build status)

| Page | Status |
|------|--------|
| `/` Homepage | ✅ Built |
| `/thank-you/` | ✅ Built |
| County pages (7) | 🔲 To build |
| `/sell-my-house-fast-michigan/` | 🔲 To build |
| `/sell-house-for-cash-michigan/` | 🔲 To build |
| `/behind-on-property-taxes-michigan/` | 🔲 To build |
| `/sell-inherited-house-michigan/` | 🔲 To build |
| `/sell-house-as-is-no-repairs/` | 🔲 To build |
| `/privacypolicy/` | 🔲 To build (owner supplies legal text) |
| `/terms/` | 🔲 To build (owner supplies legal text) |
| 404 page | 🔲 To build |

Each spoke page reuses `styles.css` and `main.js`.

---

## File Structure

```
keybridge/
├── index.html          — Homepage
├── styles.css          — Shared design system
├── main.js             — Shared JS (form, tracking, animations)
├── sitemap.xml
├── robots.txt
├── README.md           — This file
├── assets/
│   └── niki-smith.jpg  — Founder photo (replace with production URL when hosted)
└── thank-you/
    └── index.html      — Conversion confirmation page (noindex)
```
