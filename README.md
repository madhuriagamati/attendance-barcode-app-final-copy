# Attendance Barcode App – Final Patch
Fixes:
- **Admin auth** enforced server-side in `src/app/admin/layout.tsx` (redirects to `/login` without cookie). Middleware also kept.
- **Live Feed** now polls the database every 5s on `/feed` and `/kiosk`, so it persists and updates automatically.
- **Reports page** implemented at `/admin/reports` (filters + CSV/XLSX downloads).
- **Barcode print page** uses a client Print button to avoid server-component event handler errors.
- **Logo + SCHOOL_NAME** supported across the app.

## Quick start
cp .env.sample .env
npm install
npx prisma migrate dev --name init   # or: npx prisma db push
npm run seed
npm run dev
