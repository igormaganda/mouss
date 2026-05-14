# Task 6+7+8: Dynamic Home Page Sections

## Summary
Updated all existing section components to accept dynamic props from API, created 4 new section components (testimonials, FAQ, newsletter, social proof), created the `/api/home/sections` API route, and rewrote `page.tsx` to dynamically load and render all sections.

## Files Modified

### Updated Existing Components (made dynamic)
1. **`src/components/sections/hero-section.tsx`** - Now accepts `HeroProps` with settings (headline, CTAs) and stats from API
2. **`src/components/sections/profile-section.tsx`** - Now accepts `ProfileProps` with title, badge, items (with tagline, solutions, needs)
3. **`src/components/sections/pain-points-section.tsx`** - Now accepts `PainPointsProps` with items (solutions, affiliatePartners)
4. **`src/components/sections/thematic-section.tsx`** - Now accepts `ThematicProps` with items (keeps ComparisonDialog integration)
5. **`src/components/sections/roadmap-section.tsx`** - Now accepts `RoadmapProps` with items (days, solutions)

### New Components Created
6. **`src/components/sections/testimonials-section.tsx`** - Star ratings, quote icons, grid layout (1/2/4 cols)
7. **`src/components/sections/faq-section.tsx`** - Accordion-based Q&A with numbered items
8. **`src/components/sections/newsletter-section.tsx`** - Email CTA with gradient background, toast on submit
9. **`src/components/sections/social-proof-section.tsx`** - Grid of partner logos/names

### API & Page
10. **`src/app/api/home/sections/route.ts`** - GET endpoint querying HomeSection + HomeSectionItem from DB
11. **`src/app/page.tsx`** - Complete rewrite: fetches `/api/home/sections`, maps section types to components, loading skeleton, error fallback

## Key Design Decisions
- Used `DynamicIcon` wrapper component (declared outside render) to avoid "Cannot create components during render" lint error
- All components maintain existing visual design (framer-motion animations, gradients, hover effects)
- `BlogPreview` and `AuditSection` remain self-contained (BlogPreview fetches its own API, AuditSection has its own dialog)
- Graceful fallback when API returns empty/error: shows AuditSection + BlogPreview
- `staleTime: 5min` for sections cache to avoid excessive API calls
