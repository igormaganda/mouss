# Task 3 - fullstack-developer - Work Record

## Task: Build Exit-Intent Popup + Intelligent Post-Audit Upsell

### Files Created:
1. `src/app/api/exit-intent/route.ts` — POST endpoint for logging exit intent events with 24h session cooldown
2. `src/app/api/exit-intent/convert/route.ts` — POST endpoint for tracking exit-intent conversions
3. `src/app/api/exit-intent/seed/route.ts` — GET endpoint for seeding BIENVENUE20 coupon + 2 UpsellOffer records
4. `src/components/exit-intent-popup.tsx` — Client component: mouse-leave detection, glassmorphism modal, countdown timer, 7-day cooldown
5. `src/app/api/upsell/recommend/route.ts` — POST endpoint for personalized upsell recommendations based on audit data
6. `src/components/upsell-post-audit.tsx` — Client component: recommendation card with discounted price, coupon code, alternatives, social proof

### Files Modified:
1. `src/app/layout.tsx` — Added `<ExitIntentPopup />` alongside ChatWidget and SocialProofToast
2. `src/components/sections/audit-section.tsx` — Added `<UpsellPostAudit />` after audit success state, imports UpsellPostAudit component

### Key Design Decisions:
- Exit-intent uses a single `useEffect` for both mouse-leave detection and API call to avoid lint issues with `react-hooks/immutability` and `react-hooks/refs`
- Timer initial state set to "23:59:59" via `useState` default to avoid lint issue with `set-state-in-effect`
- Session ID managed via `sessionStorage` for tab-scoped uniqueness
- 7-day localStorage cooldown prevents repeated popups
- Upsell matching logic: sourcePage=audit, optional triggerPhase match, optional triggerScore threshold, priority sort
- Coupon codes auto-generated: AUDITPRO15, AUDITPREM10 based on offer name and discount

### Database Models Used:
- `ExitIntentLog` — sessionId, email, page, shown, converted, couponUsed
- `UpsellOffer` — name, sourcePage, triggerScore, triggerPhase, targetPackSlug, message, discountPercent, active, priority
- `Coupon` — code, type, value, description, active, maxUses
- `Pack` — name, slug, description, price, features

### Lint Status:
- 0 errors in all new/modified files
- 1 pre-existing error in `src/app/admin/referrals/page.tsx` (not modified by this agent)
