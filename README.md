# Catalyst SaaS Starter

A multi-tenant project & ticket tracking application built end-to-end on **Zoho Catalyst**, demonstrating a production-style backend architecture using Catalyst's core services instead of traditional AWS/Nginx infrastructure.

## Overview

This project is a lightweight "Project & Ticket Tracker" (think a mini Jira/Trello) built to showcase how a standard React + Node/Express application can be re-architected entirely on Zoho Catalyst — covering hosting, compute, data, auth, storage, events, and scheduled jobs in a single stack.

## Architecture

```
                 ┌───────────────┐
                 │     React     │
                 │  (Web Client  │
                 │   Hosting)    │
                 └───────┬───────┘
                         │ REST / JWT
                         ▼
              ┌────────────────────┐
              │      AppSail       │
              │  Node.js + Express │
              └─────────┬──────────┘
                         │
         ┌───────────────┼────────────────┬───────────────┐
         ▼               ▼                ▼               ▼
   Catalyst Data     Catalyst          Catalyst          Catalyst
   Store (ZCQL)     Authentication      Stratus           Signals
   (projects,        (user login,      (file/task        (on ticket
    tickets,          sessions)         attachments)       created →
    users)                                                 notify)
                                            │
                                            ▼
                                    Catalyst Job Scheduling
                                    (nightly digest email
                                     via Catalyst Functions)
```

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express (deployed on AppSail)
- **Database:** Zoho Catalyst Data Store (ZCQL)
- **Auth:** Zoho Catalyst Authentication
- **Storage:** Zoho Catalyst Stratus
- **Events:** Zoho Catalyst Signals
- **Scheduled Jobs:** Zoho Catalyst Job Scheduling + Functions
- **Tooling:** Catalyst CLI, Catalyst Tools VS Code extension

## Zoho Services Used

| Service | Purpose |
|---|---|
| AppSail | Hosts the Express REST API |
| Web Client Hosting | Serves the React SPA |
| Data Store (ZCQL) | Stores projects, tickets, users, comments |
| Authentication | User sign-up/sign-in, session management |
| Stratus | Stores ticket attachments and avatars |
| Signals | Emits `ticket.created`, `ticket.status_changed` events |
| Functions | Handles Signal subscribers + scheduled digest job |
| Job Scheduling | Triggers nightly summary email function |

## Key Features

- Multi-tenant workspaces (organization → projects → tickets)
- Role-based access (admin, member, viewer)
- Real-time-ish status updates via Signals-driven notifications
- File attachments on tickets via Stratus
- Nightly email digest of open/overdue tickets (Job Scheduling → Functions)
- Fully deployable with a single `catalyst deploy`

## Getting Started

### Prerequisites

- Node.js 18+
- Zoho Catalyst CLI (`npm install -g zcatalyst-cli`) — only needed for deploying to real Catalyst
- A Zoho Catalyst account/project (free tier is sufficient) — only needed for deploying to real Catalyst

### Run It Locally (no Zoho account required)

The API auto-detects whether it's running inside Catalyst. Outside of Catalyst, `zcatalyst-sdk-node`'s `initialize()` throws, so every service (`dataStore.js`, `storage.service.js`, `ticketEvents.service.js`) falls back to a local adapter — in-memory data, local disk uploads, and an in-process event emitter — so the whole app runs and is demoable without any Zoho credentials.

```bash
git clone https://github.com/<your-username>/catalyst-saas-starter.git
cd catalyst-saas-starter

# install both the API and the client
npm run install:all

# copy env templates
cp appsail/.env.example appsail/.env
cp client/.env.example client/.env

# terminal 1
npm run dev:api

# terminal 2
npm run dev:client
```

Open `http://localhost:5173`, register an account, and start creating projects/tickets. Check `GET /api/health` — it reports `"mode": "local"` when running this way.

### Deploying to Real Zoho Catalyst

Once you have a Catalyst project, `catalyst.json` already declares the client, AppSail, and Functions stacks:

```bash
catalyst init      # links this folder to your Catalyst project
catalyst deploy
```

When deployed, `req.catalystApp` is populated on every request, so the same code automatically switches to real Catalyst Data Store (via ZCQL), Stratus, and Signals — no code changes required, only creating the `Users`, `Projects`, and `Tickets` tables in the Catalyst Console (Data Store schema is managed there, not via API).

## Project Structure

```
catalyst-saas-starter/
├── client/                       # React frontend (Web Client Hosting)
│   └── src/
│       ├── api/                  # fetch wrapper for the AppSail API
│       ├── context/               # auth context (JWT stored client-side)
│       ├── components/
│       └── pages/
├── appsail/                       # Express API (deployed on AppSail)
│   ├── config/catalystConfig.js   # attaches req.catalystApp when running on Catalyst
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── services/
│   │   ├── dataStore.js           # ZCQL adapter + local in-memory fallback
│   │   ├── storage.service.js     # Stratus adapter + local disk fallback
│   │   └── ticketEvents.service.js# Signals adapter + local EventEmitter fallback
│   └── server.js
├── functions/
│   ├── ticketNotifier/            # Signal-subscribed function
│   └── nightlyDigest/             # Scheduled function (Job Scheduling)
├── catalyst.json
└── package.json
```

## Roadmap

- [ ] Kanban drag-and-drop board view
- [ ] Slack notification integration via Signals
- [ ] Usage analytics dashboard per tenant

----

## Author

**Waqar Pathan**
Email: pathanwaqar26@gmail.com
