# Meridian Interface — CRM & Operations Hub

A full-stack CRM and operations dashboard for a luxury event-production business, built with React 19, TypeScript, Tailwind CSS 4, Firebase (Auth + Firestore), and a Node/Express backend that proxies Google Gemini. It unifies leads, contacts, projects, invoices, subscriptions, tasks, memos, and inbox into one real-time workspace, with an AI copilot and a one-tap privacy mode for screen sharing.

> Built by Otis Williams

---

## Features

| Area | What it does |
| --- | --- |
| **Overview** | KPIs, pipeline analytics, financial summaries, and recent activity at a glance |
| **Leads Funnel** | Track opportunities from first contact through won or lost, with values and close dates |
| **Client Contacts** | Searchable relationship ledger with roles, sources, interaction history, and a client profile hub |
| **Operations Projects** | Status board with subtasks, budgets, deadlines, and progress |
| **Kanban Board** | To-do / In progress / Done with priorities and project links |
| **Manage Invoices** | Line items, Draft / Sent / Paid / Overdue statuses, mark-paid with receipt |
| **SaaS Expenses** | Recurring subscriptions with monthly burn and renewal tracking |
| **Memos & Reports** | Quick notes, categorised memos, and generated reports |
| **Gmail Inbox** | Message list, compose, and Google Meet scheduling view |
| **Tutorial Logs** | Internal SOP and how-to log with a PIN-gated section |
| **AI Voice & n8n** | Voice automation and webhook pipeline status with self-heal diagnostics |
| **Google Search Fixer** | Link and listing repair assistant |
| **AI Copilot** | Gemini-powered assistant that reads live CRM state to draft and advise |
| **Privacy Mode** | Instantly blurs every name, email, and dollar figure for safe screen sharing |
| **Owner sign-in** | Google sign-in gate; Firestore rules restrict every read and write to the owner account |

## Tech stack

| Layer | Tools |
| --- | --- |
| Frontend | React 19, TypeScript, Tailwind CSS 4, Recharts, Motion, lucide-react |
| Backend | Node.js, Express, Vite middleware in development |
| Database | Firebase Firestore with real-time `onSnapshot` listeners |
| Auth | Firebase Authentication (Google sign-in) |
| AI | Google Gemini via `@google/genai`, called only from the server |
| Tooling | Vite 6, esbuild, tsx |

## Architecture

The browser never talks to Gemini directly. AI requests go to the Express server, which holds `GEMINI_API_KEY` and calls Gemini on the client's behalf, so the key never ships in the bundle.

All Firestore collections are wired through a single `CRMContext` provider that streams data with real-time listeners and exposes typed CRUD operations to every section.

```
Browser (React)  ──fetch──►  Express server  ──key──►  Gemini API
       │                          │
       └──────onSnapshot──────────┴───────────►  Firestore
```

## Getting started

**Prerequisites:** Node.js 18+ and a Gemini API key from [aistudio.google.com](https://aistudio.google.com/app/apikey).

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# then set GEMINI_API_KEY in .env

# 3. Run in development (Express + Vite on http://localhost:3000)
npm run dev
```

### Other scripts

```bash
npm run lint     # type-check with tsc --noEmit
npm run build    # build the client and bundle the server to dist/
npm start        # run the production build
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Server-side key for all Gemini calls. Never exposed to the client. |
| `APP_URL` | Public URL of the deployed app, used for self-referential links. |
| `PORT` | Injected by the hosting platform. Falls back to 3000 locally. |

`.env` is gitignored; only `.env.example` is committed.

## Firebase setup

The Firebase web config lives in `firebase-applet-config.json` and is imported by `src/firebase.ts`. The web API key there is a public project identifier and is safe to commit. Firestore is protected by Security Rules, not by hiding that key.

1. Firebase Console → **Authentication** → **Sign-in method** → enable **Google**.
2. Add the owner's email to the allowlist in `firestore.rules`.
3. Deploy the rules:

```bash
firebase deploy --only firestore:rules
```

The rules require the signed-in owner for every read, write, and delete across all collections (`leads`, `contacts`, `projects`, `tutorials`, `invoices`, `subscriptions`, `todoTasks`, `activityLogs`, `gmailMessages`, `meetEvents`, `quickNotes`, `financialTransactions`) and validate field shapes on write.

## Deployment

This is a Node server app that serves both the API and the built client, so it deploys to a Node host such as Render, Railway, Fly.io, or Google Cloud Run rather than a static-only host. The server reads `process.env.PORT`, so platforms that inject a port work out of the box, and `/api/health` is available for uptime checks.

```bash
npm run build && npm start
```

## Demonstration build

The marketing site at meridianinterface.com hosts a click-through copy of this CRM. That copy has no sign-in, keeps its data in the visitor's browser, and answers AI requests locally with a note that the copilot is off in the demonstration. It is the same code with one build-time flag:

```bash
VITE_DEMO_MODE=true DEMO_BASE=/demos/meridian-crm/ npx vite build
```

`DEMO_BASE` is the path the build is served from. See `src/demo.ts` for what the flag changes.

## Project structure

```
src/
  App.tsx                     # layout, navigation, privacy toggle, auth gate
  firebase.ts                 # Firebase initialisation
  types.ts                    # shared TypeScript interfaces
  context/CRMContext.tsx      # Firestore wiring + typed CRUD for every collection
  components/                 # one component per section plus shared widgets
server.ts                     # Express server + Gemini proxy + static hosting
firestore.rules               # owner-gated, field-validated security rules
firebase-applet-config.json   # Firebase web config (public identifiers)
```

## Roadmap

- Real Gmail and Google Meet integration via Google OAuth and the Gmail/Calendar APIs.
- Per-user data scoping (`ownerId` on every document) for multi-user isolation.
- CSV import/export for contacts and invoices.

## License

Released under the MIT License.
