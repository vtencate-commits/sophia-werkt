# Sophia Werkt - Client Portal

A modern, professional web portal for labor law clients to submit cases, upload documents, communicate with lawyers, and receive legal advice.

## Features

- User authentication (login/register/password reset)
- Case management dashboard with status tracking
- Document upload and management
- Direct messaging with assigned lawyers
- Real-time notifications
- Invoice and fee tracking
- Legal advice viewer
- Responsive design for all devices
- Dutch language interface
- Security-focused with encrypted data

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **State**: Zustand
- **Icons**: Lucide React
- **Type Safety**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Configuration

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home/redirect page
│   ├── login/              # Authentication pages
│   ├── register/
│   ├── reset-password/
│   ├── dashboard/          # Main dashboard
│   ├── dossier/            # Case management
│   ├── profiel/            # User profile
│   └── help/               # Help & FAQ
├── components/             # Reusable React components
│   ├── layout/             # Layout components
│   ├── ui/                 # UI components
│   ├── dossier/            # Case-related components
│   ├── messages/           # Messaging components
│   └── notifications/      # Notification components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and helpers
│   ├── api.ts             # API client with auth
│   ├── auth.ts            # Authentication context
│   └── utils.ts           # Helper functions
└── styles/                # Global styles
```

## API Integration

The portal communicates with the backend API at `NEXT_PUBLIC_API_URL`. The API client automatically handles:

- JWT token management
- Token refresh on 401 responses
- Request/response formatting
- Error handling

### Authentication Flow

1. User logs in with email/password
2. Receives access and refresh tokens
3. Tokens stored in localStorage (client) and HTTP-only cookies (server)
4. Automatic token refresh when access token expires
5. Logout clears all tokens

## Components

### Layout Components
- **Sidebar**: Navigation menu with logo and user links
- **Header**: Top bar with user profile and notifications
- **Footer**: Company information footer

### UI Components
- **LoadingSpinner**: Animated loading indicator
- **StatusIndicator**: Color-coded case status badges
- **ProgressBar**: Visual progress indicators

### Dossier Components
- **DossierCard**: Case summary card
- **DossierTimeline**: Visual timeline of case status changes
- **IntakeForm**: Multi-step case creation wizard
- **DocumentList**: File management interface
- **AdviesViewer**: Legal advice HTML viewer
- **FeeProgress**: Billing progress indicator

### Message Components
- **MessageThread**: Chat-style message display
- **MessageInput**: Message composition form

### Notification Components
- **NotificationBell**: Notification icon with badge
- **NotificationList**: Notification dropdown menu

## Hooks

- **useAuth()**: Access authentication state and methods
- **useDossier()**: Case CRUD operations
- **useDocuments()**: Document upload and download
- **useMessages()**: Message handling
- **useNotifications()**: Notification management

## Styling

The portal uses a color scheme defined in `tailwind.config.ts`:

- **Primary**: #1e3a5f (Dark blue)
- **Secondary**: #4a90d9 (Sky blue)
- **Accent**: #f5a623 (Orange)
- **Success**: #27ae60 (Green)
- **Warning**: #f39c12 (Amber)
- **Danger**: #e74c3c (Red)

All text is in Dutch for the Dutch market.

## Key Features Explained

### Case Management
Users can create new cases by filling out a multi-step intake form that guides them through:
1. Selecting the type of legal advice needed
2. Uploading supporting documents
3. Describing their situation
4. Reviewing and confirming their submission

### Document Management
- Upload documents with categorization
- Download documents securely
- Track document status
- Support for multiple file types

### Communication
- Direct messaging with assigned lawyers
- Real-time message updates
- Message history tracking
- Unread message indicators

### Notifications
- Real-time notification system
- Bell icon with unread count
- Dropdown notification list
- Mark notifications as read

### Invoicing
- Track case fees and costs
- View payment status
- Download invoices
- Different fee types (fixed/hourly)

## Security

- HTTPS-only in production
- JWT-based authentication
- HTTP-only secure cookies
- CSRF protection via same-site cookies
- XSS prevention through React escaping
- SQL injection prevention (handled by backend)
- Encrypted document storage

## Error Handling

The application includes comprehensive error handling:
- API error messages displayed to users
- Automatic token refresh on auth failures
- Fallback states for loading/error scenarios
- Network error recovery

## Responsive Design

The portal is fully responsive:
- Mobile: Single column layout
- Tablet: 2-column layout
- Desktop: Full 3-column layout
- Touch-friendly buttons and forms
- Hamburger menu for mobile navigation

## Future Enhancements

- Two-factor authentication
- Advanced search and filtering
- Case timeline visualization
- Document versioning
- E-signature integration
- Video consultation scheduling
- Mobile app

## Support

For issues or questions, contact support@sophiawerkt.nl or visit the Help section in the application.

## License

Proprietary - Sophia Werkt / Rassers Advocaten
