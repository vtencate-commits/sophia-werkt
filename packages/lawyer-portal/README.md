# Sophia Werkt - Lawyer Portal

Professional portal for lawyers to manage cases, run AI analyses, write legal advice, track time, and generate invoices.

## Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Charts**: Recharts
- **Shared**: Types from `@sophia-werkt/shared`, Components from `@sophia-werkt/ui`
- **API**: REST via `NEXT_PUBLIC_API_URL`

## Directory Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with AuthProvider
│   ├── page.tsx                # Redirect to dashboard or login
│   ├── login/
│   │   └── page.tsx            # Lawyer login page
│   ├── dashboard/
│   │   ├── layout.tsx          # Dashboard layout with sidebar
│   │   └── page.tsx            # Dashboard with KPIs, activity feed
│   ├── dossiers/
│   │   ├── page.tsx            # All dossiers table with filters
│   │   └── [id]/
│   │       ├── page.tsx        # Case detail overview
│   │       ├── analyse/        # AI analysis page
│   │       ├── documenten/     # Document management
│   │       ├── berichten/      # Client communication
│   │       ├── advies/         # Advice editor
│   │       ├── factuur/        # Invoice generation
│   │       └── tijdregistratie/ # Time tracking
│   ├── clienten/
│   │   └── page.tsx            # Client overview
│   ├── rapportages/
│   │   └── page.tsx            # Reports with charts
│   ├── instellingen/
│   │   └── page.tsx            # Personal settings
│   ├── skills/
│   │   ├── page.tsx            # AI Skills management
│   │   └── [id]/page.tsx       # Skill editor
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx         # Sidebar navigation
│   │   ├── Header.tsx          # Top bar with search, notifications
│   │   └── TopBar.tsx          # Breadcrumb + action buttons
│   ├── dossier/
│   │   ├── DossierTable.tsx    # Sortable/filterable table
│   │   ├── DossierDetail.tsx   # Case detail header
│   │   ├── DossierTabs.tsx     # Tab navigation
│   │   ├── AiAnalyseViewer.tsx # AI analysis display
│   │   ├── AiAnalyseEditor.tsx # AI analysis editor
│   │   ├── AdviesEditor.tsx    # Legal advice editor
│   │   ├── TimeEntryForm.tsx   # Time entry form
│   │   ├── TimeEntryList.tsx   # Time entries display
│   │   └── ConflictCheckBadge.tsx # Conflict status
│   ├── documents/
│   │   ├── DocumentManager.tsx # Upload, categorize, visibility
│   │   └── DocumentPreview.tsx # Document preview
│   ├── invoices/
│   │   ├── InvoiceGenerator.tsx # Generate invoice form
│   │   ├── InvoicePreview.tsx   # Invoice preview
│   │   └── InvoicePDF.tsx       # Invoice for PDF export
│   ├── skills/
│   │   ├── SkillList.tsx       # Skills list
│   │   ├── SkillEditor.tsx     # System prompt editor
│   │   └── PromptTemplateEditor.tsx # Template editor
│   └── analytics/
│       ├── KpiCards.tsx        # KPI tiles
│       ├── RevenueChart.tsx    # Revenue bar chart
│       └── DossierStatusChart.tsx # Status pie chart
│
├── hooks/
│   ├── useAuth.ts              # Auth context hook
│   ├── useDossiers.ts          # Dossier list/detail/update
│   └── useAiAnalyse.ts         # AI analysis operations
│
├── lib/
│   ├── api.ts                  # Fetch wrapper with auth & 401 refresh
│   ├── auth.ts                 # AuthContext for lawyer auth
│   └── utils.ts                # Utility functions (cn, formatting)
│
└── styles/
    └── globals.css             # Tailwind directives + sophia styles
```

## Key Features

### Authentication
- JWT-based authentication with auto-refresh on 401
- AuthContext with useAuth hook
- Protected dashboard routes
- Login page at `/login`

### Case Management (Dossiers)
- **List View**: Sortable, filterable table of all cases
- **Detail View**: Comprehensive case overview with status tracking
- **Status Management**: Open → In Progress → Pending → Completed → Closed → Archived
- **Conflict Check**: Status badge showing conflict check status

### AI Analysis
- Multiple analysis types: zaaksamenvatting, risicobeoordeling, processtrategie, full
- Real-time polling for async analysis results
- Editable analysis sections
- Save to case dossier

### Legal Advice
- Rich text editor for drafting advice
- Preview mode
- Save functionality
- "Release to Client" option

### Document Management
- File upload with categorization
- Toggle visibility to client
- Document preview (PDF, images, etc.)
- Categories: contract, correspondentie, jurisprudentie, wet, overig

### Time Tracking
- Activity types: analyse, advies, communicatie, onderhandeling
- Billable flag for invoicing
- Duration in minutes with easy formatting
- Totals calculation

### Invoice Generation
- Line-item based invoicing
- VAT calculations (default 21%)
- Client info from case
- Invoice preview and PDF generation
- Send to client functionality

### AI Skills
- List of available AI skills with enable/disable toggle
- System prompt editor with syntax awareness
- Template variable insertion for prompts
- Category organization

### Analytics & Reporting
- KPI cards: new cases, active cases, pending advice, closed cases
- Revenue chart (actual vs forecast)
- Dossier status pie chart
- Client overview with case counts
- Detailed reports with metrics

## Styling

### Sophia Design System
Color palette and component classes are defined in `styles/globals.css`:

- **Primary**: `#1a1a2e` (dark sidebar)
- **Accent**: `#16a085` (teal/green highlight)
- **Text**: `#eeeeee` (light text)
- **Border**: `#2d2d44` (subtle borders)

Custom component classes:
- `.sophia-sidebar` / `.sophia-sidebar-item`
- `.sophia-card` / `.sophia-input` / `.sophia-button-*`
- `.sophia-badge-*` (success, warning, error, info)
- `.sophia-table` (table styling)

## API Integration

### Base Structure
All API calls go through `lib/api.ts` with:
- JWT token attachment in Authorization header
- Automatic 401 handling with token refresh
- JSON request/response handling

### Endpoints Used
- `POST /auth/login` - Lawyer authentication
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Token refresh
- `GET /lawyers/me` - Current lawyer profile
- `GET /dossiers` - List all cases
- `GET /dossiers/{id}` - Case details
- `POST /dossiers` - Create case
- `PUT /dossiers/{id}` - Update case
- `PATCH /dossiers/{id}/assign` - Assign lawyer
- `PATCH /dossiers/{id}/status` - Update status
- `POST /dossiers/{dossierId}/analyse` - Start AI analysis
- `GET /analyse/{jobId}` - Get analysis status
- `PATCH /analyse/{jobId}` - Update analysis

## Usage

### Running the Portal
```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Building
```bash
npm run build
npm start
```

## Component Examples

### Using useAuth Hook
```tsx
import { useAuth } from '@/hooks/useAuth'

export function MyComponent() {
  const { lawyer, logout, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) return <div>Not logged in</div>
  
  return <div>Welcome {lawyer?.name}</div>
}
```

### Using useDossiers Hook
```tsx
import { useDossiers } from '@/hooks/useDossiers'

export function MyDossiers() {
  const { dossiers, isLoading, updateStatus } = useDossiers()
  
  const handleClose = (id: string) => {
    updateStatus(id, 'closed')
  }
  
  return (...)
}
```

### Using API Directly
```tsx
import { apiGet, apiPost } from '@/lib/api'

const data = await apiGet('/dossiers')
const result = await apiPost('/dossiers', { clientNaam: 'Test' })
```

## Dutch UI Language
All user-facing text is in Dutch:
- "Dossiers" instead of "Cases"
- "Advocaat" for Lawyer
- "Advies" for Legal Advice
- "Juridische Analyse" for Legal Analysis
- "Factuur" for Invoice
- "Tijdregistratie" for Time Tracking

## Performance Notes

1. **Sidebar**: Fixed positioning, doesn't re-render on route changes
2. **Auth Check**: Only done once on mount via useEffect
3. **Data Fetching**: Hooks fetch on mount, manual refetch available
4. **Charts**: Recharts handles responsive sizing automatically
5. **Images**: Use Next.js Image component where applicable

## Security

- JWT tokens stored in localStorage (can be upgraded to secure HttpOnly cookies)
- 401 auto-refresh ensures valid tokens
- Protected routes redirect to `/login` if not authenticated
- CORS handled by backend API
- No sensitive data in URLs (form data in body)

## Future Enhancements

- [ ] Real-time notifications via WebSocket
- [ ] Document OCR integration
- [ ] Email integration for client communication
- [ ] Advanced reporting with custom date ranges
- [ ] Bulk case operations
- [ ] Case templates
- [ ] Integration with calendar for deadline tracking
- [ ] Mobile app version
