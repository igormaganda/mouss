# Task 3 - Home Page CMS API Routes

## Summary
Created all 5 API route files for the home page CMS system and seeded the database with all default section data.

## Files Created

### 1. `src/app/api/home/sections/route.ts` (GET)
- Returns all HomeSections ordered by `order` field
- Includes only active items, ordered by `order`
- Sections with `active=false` are still returned
- Response format: `{ sections: HomeSection[] }`

### 2. `src/app/api/home/sections/[id]/route.ts` (PUT)
- Updates a section's title, subtitle, badge, active, order, settings
- Returns the updated section with active items

### 3. `src/app/api/home/sections/[id]/items/route.ts` (GET, POST)
- GET: Returns all items for a section (including inactive), ordered by `order`
- POST: Creates a new item for the section

### 4. `src/app/api/home/sections/[id]/items/[itemId]/route.ts` (PUT, DELETE)
- PUT: Updates an item's label, content, icon, color, data, active, order
- DELETE: Deletes an item

### 5. `src/app/api/home/seed/route.ts` (POST)
- Seeds all 10 home page sections with complete data
- Uses `upsert` for sections (idempotent by `type`)
- Deletes and recreates items on each seed for clean state
- Sections seeded: hero, profiles, pain_points, thematic, roadmap, audit, testimonials, faq, newsletter, social_proof
- Total items: 3 + 4 + 4 + 6 + 4 + 0 + 4 + 6 + 0 + 8 = 39 items

## Testing Results
All endpoints tested and working:
- ✅ GET /api/home/sections - Returns all 10 sections with items
- ✅ POST /api/home/seed - Seeds all data (idempotent)
- ✅ PUT /api/home/sections/:id - Updates section fields
- ✅ GET /api/home/sections/:id/items - Returns section items
- ✅ POST /api/home/sections/:id/items - Creates new item
- ✅ PUT /api/home/sections/:id/items/:itemId - Updates item
- ✅ DELETE /api/home/sections/:id/items/:itemId - Deletes item
- ✅ ESLint passes with no errors

## Notes
- All routes use `import { db } from '@/lib/db'` for database access
- All routes include try/catch with 500 error responses
- Next.js 16 App Router with `params: Promise<{ id: string }>` pattern
- No changes needed to `src/lib/db.ts`
