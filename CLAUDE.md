# CLAUDE CODE PROMPT: SOPHIA WERKT

## Instructie

Je bent Claude Code. Bouw het volledige Sophia Werkt platform op basis van de mappenstructuur en specificaties in de Cowork prompt (03_Cowork_Prompt.md). Werk autonoom en bouw alles in \u00e9\u00e9n run.

---

## Stap 0: Voorbereiding

```bash
# Skip permissions voor volledige autonomie
# Start vanuit PowerShell:
# claude --dangerously-skip-permissions
```

Lees eerst het bestand `03_Cowork_Prompt.md` in de projectroot. Dit bevat de volledige architectuur, het databaseschema, de API endpoints, de mappenstructuur en alle functionele specificaties.

---

## Stap 1: Project initialisatie

Maak de monorepo structuur aan:

```bash
mkdir sophia-werkt && cd sophia-werkt
git init

# Monorepo setup met pnpm workspaces
npm init -y
npx create-turbo@latest --skip-install

# Packages aanmaken
mkdir -p packages/{api,client-portal,lawyer-portal,admin-portal,ui,shared,db}
```

Configureer turbo.json, pnpm-workspace.yaml en root package.json.

Installeer alle dependencies per package zoals beschreven in de tech stack van de Cowork prompt.

---

## Stap 2: Database

Maak het volledige Prisma schema aan in packages/db/prisma/schema.prisma exact zoals beschreven in de Cowork prompt.

Genereer de Prisma client en maak de seed file aan met:
- 1 admin gebruiker (admin@sophiawerkt.nl)
- 2 advocaat gebruikers
- 3 test clienten met dossiers in verschillende statussen
- Standaard tariefconfiguratie
- Minimaal 2 AI Skills (VSO beoordeling en ontslagadvies)

---

## Stap 3: Backend API (packages/api)

Bouw de volledige Fastify API met alle routes, services en middleware:

### Server setup
- Fastify met TypeScript
- CORS, rate limiting, helmet plugins
- JSON Schema validatie op alle endpoints
- Error handling middleware
- Request logging

### Authenticatie
- Registratie met e mail verificatie
- Login met JWT (access + refresh tokens)
- Refresh token rotatie
- Wachtwoord reset flow
- 2FA setup en verificatie (speakeasy library)
- Account lockout logica
- bcrypt hashing (cost factor 12)

### Alle routes uit de Cowork prompt
Implementeer elke route met volledige business logica:
- Cases: CRUD, statuswijzigingen, conflictcheck, toewijzing
- Documents: upload naar MinIO, download met pre-signed URLs, categorisering
- Messages: per dossier, leesbevestigingen, e mail notificaties
- AI: analyse starten, ophalen, bewerken; skills CRUD
- Invoices: generatie, PDF, statusbeheer
- Time entries: registratie, bewerking, weekoverzicht
- Notifications: CRUD, e mail triggers
- Admin: gebruikersbeheer, tarieven, audit log, statistieken

### AI Service
Implementeer de volledige AI analyse service:
- Anonimiseringsengine (namen, adressen, BSN, e mail)
- Skill selectie op basis van adviestype
- Claude API aanroep met system prompt uit de geselecteerde skill
- Response parsing en opslag
- De anonimisering terugdraaien in de response
- Token tracking

### Facturatie
- Factuur generatie uit dossierdata
- PDF generatie met puppeteer of @react-pdf/renderer
- Auto increment factuurnummering: SW[JAAR][VOLGNUMMER]
- BTW berekening (21%)

---

## Stap 4: Gedeelde packages

### packages/shared
- Alle TypeScript types/interfaces
- Constanten (statussen, rollen, adviestypen, documentcategorie\u00ebn)
- Utility functies (valuta formattering, datumformattering, validatie)

### packages/ui
- Gedeelde React componenten met Tailwind CSS en shadcn/ui
- Button, Card, Input, Select, Modal, Toast, Badge, Table, FileUpload
- Design tokens in CSS variabelen

---

## Stap 5: Cli\u00ebntportaal (packages/client-portal)

Next.js 14+ App Router applicatie:

### Layout
- Donkerblauw (#1A2B4A) en goud (#B8965A) kleurenschema
- Serif lettertype (Playfair Display of Fraunces) voor koppen
- Sans serif (Outfit of DM Sans) voor bodytekst
- Responsive sidebar navigatie
- Header met notificatiebel en gebruikersmenu

### Pagina's
Bouw alle pagina's uit de Cowork prompt:
- Login/registratie met formuliervalidatie
- Dashboard met dossierkaarten, statusoverzicht, notificaties
- Intake wizard (4 stappen met voortgangsindicator)
- Dossierdetail met tabbed interface
- Documenten met upload/download
- Berichten (chat interface)
- Advies viewer (rich text weergave)
- Facturen
- Profiel
- Help/instructiepagina

### Intake wizard
Dit is de kernervaring voor de cli\u00ebnt. Maak het intuìtief:
- Stap 1: Adviestype selecteren (grote kaarten met iconen)
- Stap 2: Documenten uploaden (drag and drop, meerdere bestanden, categorisering per bestand)
- Stap 3: Situatie beschrijven (dynamische vragen op basis van adviestype)
- Stap 4: Bevestiging en tariefoverzicht met akkoord checkbox

### Statusweergave
De cli\u00ebnt moet altijd weten waar hij staat. Toon een visuele statusbalk:
INTAKE \u2192 DOCUMENTEN ONTVANGEN \u2192 IN BEHANDELING \u2192 ADVIES IN CONCEPT \u2192 ADVIES GEREED \u2192 AFGEROND

---

## Stap 6: Advocatenportaal (packages/lawyer-portal)

Next.js 14+ App Router applicatie:

### Layout
- Professioneler en functioneler ontwerp dan het cli\u00ebntportaal
- Sidebar met navigatie: Dashboard, Dossiers, Cli\u00ebnten, Skills, Rapportages, Instellingen
- Donker thema optioneel

### Pagina's
Bouw alle pagina's uit de Cowork prompt:
- Dashboard met KPI tegels en activiteitenfeed
- Dossiersoverzicht (tabel, sorteerbaar, filterbaar)
- Dossierdetail met alle tabs (overzicht, documenten, AI analyse, advies, berichten, uren, factuur, tijdlijn)
- AI Analyse viewer/editor
- Advies editor (rich text met Tiptap)
- Skills beheer
- Rapportages

### AI Analyse viewer
- Gestructureerde weergave van de AI analyse
- Per sectie accorderen of bewerken
- "Opnieuw genereren" knop
- Zichtbare warning: "Dit is een AI gegenereerd concept. Controleer alle informatie."

### Advies editor
- Tiptap rich text editor
- "Genereer uit AI analyse" knop die een eerste concept cre\u00ebert
- Preview modus
- "Vrijgeven aan cli\u00ebnt" knop met bevestigingsdialoog
- Export als PDF of Word

### Skills editor
- Syntax highlighted editor voor prompt templates
- Variabelen markeren (bijv. {{WERKNEMER_NAAM}}, {{SALARIS}})
- Test knop die de skill uitvoert op een voorbeelddossier
- Versiebeheer

---

## Stap 7: Admin portaal (packages/admin-portal)

Next.js 14+ App Router applicatie:

### Pagina's
- Dashboard met platformstatistieken
- Gebruikersbeheer (tabel met advocaten en admins, aanmaken, bewerken, activeren/deactiveren)
- Tariefbeheer (per adviestype tarief instellen)
- Facturatie overzicht (alle facturen, filters, totalen)
- AI Skills beheer (platform breed)
- Audit log viewer (chronologisch, filterbaar)
- Rapportages (omzet, dossiers, doorlooptijd, AI gebruik)

---

## Stap 8: Docker en deployment

Maak docker-compose.yml aan zoals beschreven in de Cowork prompt.

Maak Dockerfiles voor elk package:
- packages/api/Dockerfile
- packages/client-portal/Dockerfile
- packages/lawyer-portal/Dockerfile
- packages/admin-portal/Dockerfile

Maak een Caddyfile aan voor reverse proxy:

```
sophiawerkt.nl {
    reverse_proxy client-portal:3000
}

kantoor.sophiawerkt.nl {
    reverse_proxy lawyer-portal:3002
}

admin.sophiawerkt.nl {
    reverse_proxy admin-portal:3003
}

api.sophiawerkt.nl {
    reverse_proxy api:3001
}
```

---

## Stap 9: Testen

Schrijf minimaal:
- Unit tests voor de auth service
- Unit tests voor de AI service (mock Claude API)
- Unit tests voor de facturatie service
- Integration tests voor de auth flow (registratie \u2192 login \u2192 refresh)
- Integration tests voor de case flow (intake \u2192 analyse \u2192 advies \u2192 levering)

---

## Stap 10: Git en deployment

```bash
# Commit alles
git add -A
git commit -m "feat: initial Sophia Werkt platform"

# Push naar GitHub
git remote add origin https://github.com/[REPO]/sophia-werkt.git
git push -u origin main
```

---

## Kwaliteitseisen

- TypeScript strict mode overal, geen `any` types
- ESLint met strikte regels
- Prettier voor formatting
- Alle API responses in uniform format: { success: boolean, data?: T, error?: { code: string, message: string } }
- Alle datumvelden in ISO 8601 format
- Alle bedragen in Decimal (Prisma) of cents (integer) in de API
- Error boundaries in React
- Loading states op alle data fetching componenten
- Responsief ontwerp op alle pagina's
- Nederlandse UI teksten overal
- Geen hardcoded strings; gebruik constanten
- Console logs alleen in development modus

---

## Kleurenpalet (voor alle portalen)

```css
:root {
  --color-primary: #1A2B4A;        /* donkerblauw */
  --color-accent: #B8965A;          /* goud */
  --color-bg: #FAFAF8;              /* gebroken wit */
  --color-text: #2D2D2D;            /* donkergrijs */
  --color-text-light: #6B6B6B;      /* lichtgrijs tekst */
  --color-surface: #FFFFFF;          /* kaarten */
  --color-surface-alt: #F5F5F3;     /* afwisselende secties */
  --color-border: #E5E5E3;          /* randen */
  --color-success: #4A7C59;          /* groen */
  --color-warning: #D4A03C;          /* waarschuwing */
  --color-error: #C53030;            /* fout */
  --color-info: #2B6CB0;             /* informatie */
}
```

---

## Belangrijk

- Het cli\u00ebntportaal moet uitnodigend en laagdrempelig zijn. Geen juridisch jargon in de interface.
- Het advocatenportaal moet effici\u00ebnt en functioneel zijn. Snelle navigatie, keyboard shortcuts.
- AI output is ALTIJD een concept. Toon dit visueel met een badge of banner.
- Conflictcheck is verplicht bij elke intake. Als werkgever een bestaande relatie is, blokkeer het dossier.
- Factuurnummers zijn doorlopend: SW2026001, SW2026002, etc.
- E mail notificaties bij: nieuw dossier, status wijziging, nieuw bericht, advies gereed, factuur.
- De help/instructiepagina in het cli\u00ebntportaal moet duidelijk uitleggen wat het platform doet en hoe het werkt.
