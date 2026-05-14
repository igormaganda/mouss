# Task 5: Admin Home Page

## Summary
Created a comprehensive admin page at `src/app/admin/home/page.tsx` for managing all home page sections, and updated the admin sidebar.

## Files Modified

### 1. `src/app/admin/layout.tsx`
- Added `LayoutGrid` icon import from lucide-react
- Added new nav item: "Gestion Home" → `/admin/home` with `LayoutGrid` icon in `"content"` group
- Moved "Blog" from `"navigation"` group to `"content"` group
- Added new `"content"` group to `navGroups` (between "Navigation" and "Facturation")
- Added `home: "Gestion Home"` to breadcrumb label map

### 2. `src/app/admin/home/page.tsx` (NEW)
A comprehensive, tabbed admin interface with:

**10 Section Tabs:**
- Hero, Profils, Pain Points, Thématiques, Roadmap, Audit, Témoignages, FAQ, Newsletter, Social Proof

**Section Settings Card (per tab):**
- Title, subtitle, badge text editing
- Active/inactive toggle
- Order number
- JSON settings textarea (for hero, audit, newsletter)
- Save button (appears when editing)

**Items Management (for sections with items):**
- Sorted items list with active status badges
- Add new item button/dialog
- Edit item dialog with: label, content, icon, color, JSON data, active toggle
- Delete item with confirmation dialog
- Toggle item active/inactive inline
- Move up/down reorder buttons
- Empty state with CTA to add first item

**Design:**
- Uses shadcn/ui: Tabs, Card, Input, Textarea, Switch, Button, Dialog, AlertDialog, Badge, Label, Separator, Skeleton
- Clean, professional admin look
- Responsive layout (mobile-first)
- Toast notifications via sonner
- Loading skeleton states
- TanStack React Query for data fetching/mutations

## API Endpoints Used
- `GET /api/home/sections` — fetch all sections with items
- `PUT /api/home/sections/[id]` — update section settings
- `POST /api/home/sections/[id]/items` — create new item
- `PUT /api/home/sections/[id]/items/[itemId]` — update item (active, order, etc.)
- `DELETE /api/home/sections/[id]/items/[itemId]` — delete item

## Notes
- Lint errors in output are pre-existing (from `hero-section.tsx`), not from new code
- No API routes were modified
- The page handles missing sections gracefully
