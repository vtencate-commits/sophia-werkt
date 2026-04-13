# Quick Start Guide - Lawyer Portal

## Setup (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Set environment variable
export NEXT_PUBLIC_API_URL=http://localhost:3001/api

# 3. Run development server
npm run dev

# 4. Open browser
# → http://localhost:3000
```

## Login
- Email: `test@rassers.nl`
- Password: `password123`

---

## Main Navigation

After login, you'll see the sidebar with:

### 📊 Dashboard
Overview with KPIs, bedenktermijn warnings, revenue charts, and dossier status

### 📁 Dossiers
All cases with sortable/filterable table
- Click a referentie to view case detail
- Tabs: Overzicht, Analyse, Documenten, Berichten, Advies, Factuur, Tijdregistratie

### 👥 Clienten
Client overview showing case counts

### 📈 Rapportages
Reports with revenue charts, status distribution, metrics

### ⚙️ Skills
AI Skills management - enable/disable and edit prompts

### 🔧 Instellingen
Personal settings (rate, notifications, language)

---

## Key Workflows

### Running AI Analysis
1. Open any case
2. Go to "Analyse" tab
3. Click "Nieuwe analyse" or select analysis type
4. Results update in real-time
5. Click "Bewerk" to edit sections
6. Click "Alles opslaan" to save

### Writing Legal Advice
1. Go to case "Advies" tab
2. Write in the editor
3. Click "Voorbeeld" to preview
4. Click "Opslaan" to save draft
5. Click "Vrijgeven aan cliënt" to release

### Generating Invoice
1. Go to case "Factuur" tab
2. Add line items with quantities and prices
3. VAT calculated automatically (21%)
4. Preview shows complete invoice
5. Click "Factuur verzenden" to send

### Time Tracking
1. Go to case "Tijdregistratie" tab
2. Select date, duration, activity type
3. Add description
4. Toggle "Facturabel" if billable
5. Click "Urenregistratie toevoegen"
6. Totals update automatically

### Managing Documents
1. Go to case "Documenten" tab
2. Select category
3. Click "Bestand kiezen" to upload
4. Toggle visibility to client (Ja/Nee)
5. Click "Download" to open

### Client Messages
1. Go to case "Berichten" tab
2. Type message in textarea
3. Click "Verzenden"
4. Messages appear in conversation thread

---

## Component Locations

### If you need to modify...

**Sidebar navigation**: `components/layout/Sidebar.tsx`
**Top header**: `components/layout/Header.tsx`
**Case table**: `components/dossier/DossierTable.tsx`
**Analytics charts**: `components/analytics/*.tsx`
**Colors/styles**: `styles/globals.css`

---

## Common Patterns

### Using a Hook in a Component
```tsx
'use client'
import { useDossiers } from '@/hooks/useDossiers'

export default function MyComponent() {
  const { dossiers, isLoading, updateStatus } = useDossiers()
  
  return (...)
}
```

### Making an API Call
```tsx
import { apiGet, apiPost } from '@/lib/api'

const data = await apiGet('/dossiers')
const result = await apiPost('/dossiers', { clientNaam: 'Test' })
```

### Formatting Values
```tsx
import { formatDate, formatCurrency, formatDuration } from '@/lib/utils'

formatDate('2024-04-13')        // 13 april 2024
formatCurrency(2500)             // €2.500,00
formatDuration(90)               // 1u 30m
```

---

## Building & Deployment

### Production Build
```bash
npm run build
npm start
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

---

## Troubleshooting

### Login fails
- Check `NEXT_PUBLIC_API_URL` is set correctly
- Verify backend API is running
- Check network tab in DevTools for API errors

### Styles look wrong
- Ensure Tailwind CSS is properly configured
- Check if dark mode is being applied
- Clear browser cache

### Components not updating
- Check if `'use client'` is at top of file (required for interactive components)
- Verify hooks are called at component top level
- Check browser console for errors

### API calls failing with 401
- Token refresh should happen automatically
- If it still fails, user may need to re-login
- Check localStorage for `sophia_auth_token`

---

## File Structure Quick Reference

```
src/
├── app/              # Pages (Next.js App Router)
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── lib/              # Utilities (api, auth, helpers)
└── styles/           # Global styles
```

---

## API Endpoints (for integration)

### Must implement:
- `POST /auth/login` - Lawyer login
- `GET /lawyers/me` - Current user
- `GET /dossiers` - List cases
- `GET /dossiers/{id}` - Case detail
- `PATCH /dossiers/{id}/status` - Update status
- `POST /dossiers/{id}/analyse` - Start analysis
- `GET /analyse/{jobId}` - Get analysis result

### Nice to have:
- Document upload/delete
- Invoice generation/send
- Time entry save/delete
- Client messaging
- Skills update

---

## UI/UX Notes

- **Dark sidebar**: `#1a1a2e` (Sophia primary)
- **Accent color**: `#16a085` (Teal/green for buttons, links)
- **Language**: All UI text is in Dutch
- **Responsive**: Designed for desktop and tablet
- **Icons**: Using emoji icons (can upgrade to icon library)

---

## Performance Tips

1. **Images**: Use Next.js Image component
2. **Memoization**: Wrap expensive components with React.memo
3. **Data**: Only fetch what you need
4. **Lazy loading**: Pages auto-split with Next.js

---

## Next Steps

1. ✅ Start backend API implementation matching endpoints in README
2. ✅ Connect document upload
3. ✅ Connect invoice generation
4. ✅ Add real-time notifications (WebSocket)
5. ✅ Implement email integration
6. ✅ Add more analytics reports

---

For detailed information, see `README.md` and `IMPLEMENTATION_SUMMARY.md`
