Idealized and prepared with the assistance of *ChatGPT-6.1 Sol* - **We're still responsible for reviewing, approving, implementing, and validating its proposal**. This file only serves as an early build description, that would later be revisited for future implementations.


# Development Guide

This guide describes the development environment and current implementation
boundaries. The target data model and API contract are documented separately:

- [Data model](./data-model.md)
- [API contract](./api-contract.md)
- [Initial backend audit](../backend/README.md)

## 1. Requirements

- Git.
- Node.js compatible with the locked dependencies.
  Vite 7 requires Node.js 20.19+ or 22.12+.
- npm.
- A MongoDB instance reachable through MONGODB_URI.

Record the local runtime versions when reporting setup problems:

```bash
node --version
npm --version
```

Backend and frontend dependencies are installed separately.
Run the commands below from the indicated directory.

## 2. Backend setup

From the repository root:

```bash
cd backend
npm ci
```

If .env does not already exist:

```bash
cp -n .env.example .env
```

Edit the local .env with the required configuration.
Do not overwrite an existing local configuration without reviewing it.

Generate a local JWT secret:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Copy the generated value into JWT_SECRET.
Do not commit or share the generated secret.

### Backend environment variables

| Variable | Purpose |
| --- | --- |
| PORT | Backend port; default 3000. |
| MONGODB_URI | MongoDB connection URI, including the intended database. Required. |
| JWT_SECRET | Local signing secret. Required; at least 32 characters. The example placeholder is rejected. |
| CORS_ORIGIN | Exact frontend origin; default http://localhost:5173. |
| HTTPS_ENABLED | true or false; default false. |
| TLS_KEY_PATH | Local private-key path; required when HTTPS is enabled. |
| TLS_CERT_PATH | Local certificate path; required when HTTPS is enabled. |

Start the backend from backend/:

```bash
npm start
```

The start script loads .env before executing index.js.

Startup connects to MongoDB and checks database access before opening the
HTTP/HTTPS port. The server binds to 127.0.0.1 for local development.

Changing the database name in MONGODB_URI selects another database.
It does not migrate or copy existing data.

## 3. Frontend setup

From the repository root:

```bash
cd frontend
npm ci --include=dev
```

If .env does not already exist:

```bash
cp -n .env.example .env
```

### Frontend environment variables

| Variable | Purpose |
| --- | --- |
| VITE_JSON_SERVER_URL | Base URL used by the current dataProvider. |
| DEV_SERVER_PORT | Development port; default 5173. |
| HTTPS_ENABLED | true or false; default false. |
| TLS_KEY_PATH | Local private-key path; required when HTTPS is enabled. |
| TLS_CERT_PATH | Local certificate path; required when HTTPS is enabled. |

The frontend currently retains tutorial resources and providers.
Its example configuration temporarily uses JSONPlaceholder.

The project backend does not implement all tutorial resources.
Switching the entire current provider to the backend URL is not equivalent
to completing integration.

Real API integration, resource mapping, and authentication belong to the
corresponding implementation issues.

VITE_ variables are exposed to browser code.
MongoDB credentials and JWT_SECRET belong only to the backend environment.

Start the development server:

```bash
npm run dev
```

Open http://localhost:5173 when using the default HTTP configuration.
Keep the terminal process running while using the development server.

The configured port is strict. If occupied, stop the conflicting process
or deliberately update both the frontend port and backend CORS_ORIGIN.

Restart the relevant server after changing its .env.

## 4. Verification commands

Run from backend/:

```bash
node --check index.js
npm start
```

Run from frontend/:

```bash
npx --no-install tsc -p tsconfig.node.json --noEmit
npx --no-install tsc -p tsconfig.app.json --noEmit
npm run build
npm run dev
```

The node configuration checks vite.config.ts.
The app configuration checks frontend application code.

A successful Vite build does not replace TypeScript checking.

Review dependency advisories separately:

```bash
npm audit
```

Review the affected packages, dependency paths, available fixes, and
applicability before choosing updates. Validate any dependency changes.

## 5. Local HTTPS

HTTP is the initial local verification configuration.

HTTPS support is configurable in both services.
To use it:

1. Provision local server certificates valid for the hostname being used.
2. Keep their private keys outside version control.
3. Set HTTPS_ENABLED=true in each service's local .env.
4. Configure TLS_KEY_PATH and TLS_CERT_PATH.
5. Set backend CORS_ORIGIN to https://localhost:5173.
6. Restart both services.

Relative certificate paths are interpreted from the corresponding service
directory.

The client must trust the certificate issuer.
HTTPS operation remains pending until certificate loading and trusted
browser connections have been verified.

When real API integration is implemented, its configured URL must also
match the backend protocol and port.

Local HTTPS configuration does not define the production deployment.

## 6. GitHub conventions

- Work in a branch associated with one Issue.
- Use branch names such as:
  - 57-tech-03-environment-configuration
  - 22-us-04-1-authentication-roles
- Keep commits focused and describe the resulting change.
- Target main with a pull request.
- Include purpose, related Issue, validation results, and known limitations.
- Use Closes #number only when merging the PR completes that Issue.
- Review the diff before committing and before merging.
- Check shared frontend files before integrating teammate branches.
- Declare material AI assistance and review the resulting work.

Commit .env.example files containing placeholders and public configuration.
Do not commit private .env files, private keys, node_modules, or dist.

## 7. Technical decision log

### MongoDB for this release

MongoDB is retained because the course starter and current backend already
use it. Changing database engines during the release would add migration
and integration work.

The minimum target collections are users, companies, products, offers,
and vacancies. Relationships and ownership are enforced by the backend.

### Scope boundaries

Geolocation, coordinates, maps, proximity search, and geographic filters
are excluded from the committed MLP.

Textual addresses and vacancy locations are allowed.

Company branches, consumer accounts, internal applications/CVs, payments,
carts, orders, shipping, and checkout are also outside this release.

### API naming and transition

The legacy /Productos route is retained temporarily for starter checks.
The target routes use /products and /public/products.

Legacy numeric IDs and collections are not migrated automatically.
US-04.1 and US-06.1 must decide whether demonstration data is migrated or
replaced with agreed fixtures.

### Configuration names

Backend configuration uses MONGODB_URI and JWT_SECRET.
The frontend retains VITE_JSON_SERVER_URL during the current transition.

The professor's DB, LLAVESECRETA, and VITE_BACKEND names are not introduced
as parallel configuration aliases.

### Authentication transition

The backend implements business registration, credential verification,
JWT authentication, current database role checks, and logout invalidation.

Protected requests use Authorization: Bearer <token>.
JWTs expire after 900 seconds. Logout increments tokenVersion and
invalidates all previously issued tokens for that account.

The legacy /Productos routes remain temporarily administrator-only.
Companies, products, offers, and vacancies implement private CRUD with
ownership checks. Administrators can manage all records.

Administrators can change isHidden on companies, products, and offers.
Public endpoints enforce visibility, parent visibility, and offer validity.

Frontend authentication integration remains pending under US-04.2.
Legacy usuarios accounts are not migrated automatically to users.

### Local transport

HTTP provides the initial local setup.
HTTPS support is configurable and requires separate certificate validation.

## 8. Reported validation and open findings

Reported on 2026-10-18:

- Backend MongoDB connection and HTTP startup: passed.
- Legacy token-signature smoke checks: reported successful.
- Frontend dependency installation: passed.
- Vite configuration TypeScript check: passed.
- Frontend production build: passed.
- Frontend development server startup on port 5173: passed.
- Full application TypeScript check: passed.
- Tutorial user listing in the browser: verified after creating frontend/.env.
- Frontend production build with the corrected local environment: passed.
- Trusted local HTTPS operation: not yet verified.

Recorded frontend tool versions:

- Vite: 7.3.6.
- @vitejs/plugin-react: 4.7.0.
- TypeScript: 5.9.3.
- @types/node: 20.19.43.

Open findings:

- After compatible dependency updates, npm reports 8 moderate findings
  associated with the decode-uri-component/query-string dependency chain.
- No low, high, or critical findings were reported in that audit.
- The remaining findings may require a further review. No forced React-Admin downgrade was applied.

These checks do not establish complete CRUD, authorization, accessibility,
performance, or release readiness.

## 9. Backend authentication validation — US-04.1

Local verification:

| Scenario | Result |
| --- | --- |
| Valid business registration | 201 |
| Duplicate normalized email | 409 |
| Invalid registration fields or submitted role | 400 |
| Valid login | 200 |
| Incorrect password or nonexistent account | Same generic 401 |
| Identity request without authentication | 401 |
| Identity request with valid token | 200, sanitized user |
| Invalid token | 401 |
| Business access to administrator-only Products | 403 |
| Logout | 204, empty body |
| Reuse of revoked token | 401 |
| Local administrator creation | Successful |
| Administrator login and protected Product listing | 200 |

Run administrator provisioning from backend/ using npm run create-admin.
Set ADMIN_EMAIL, ADMIN_FIRST_NAME, ADMIN_LAST_NAME, and ADMIN_PASSWORD
in the current shell before executing it.

The script rejects duplicate emails and does not change existing roles!

The resource APIs are implemented. Frontend integration, browser-based
end-to-end validation, and release verification remain pending.

## 10. Backend integration handoff

Use the API contract and data model linked at the beginning of this guide
for request fields and validation rules.

| Purpose | Routes | Access |
| --- | --- | --- |
| Registration and login | POST /registrarse, POST /login | Public |
| Current identity and logout | GET /users/me, POST /logout | Authenticated |
| User listing and detail | GET /users, GET /users/:id | Administrator |
| Resource management | /companies, /products, /offers, /vacancies | Owner or administrator |
| Public listings and details | /public/companies, /public/products, /public/offers, /public/vacancies | Public |

Private resource routes support GET list/detail, POST, PUT, and DELETE.
PUT accepts partial updates. DELETE deactivates the record.

Send Authorization: Bearer <token> on protected requests.
Tokens expire after 900 seconds.

List responses contain an array. Paginated lists expose X-Total-Count,
which contains the filtered total before pagination.
Use _start=0&_end=1 when only a dashboard count is needed.

IDs and reference fields are strings. Monetary values use priceCents
and currency MXN.

Business accounts manage their own companies and associated resources.
Administrator user reads support company owner selection.

Public visibility depends on the resource and its parent records.
Offers must also be within their validity period.
Vacancies use isActive and do not have an isHidden field.

Each developer must configure their own environment and database.
Pulling the repository does not copy local accounts or demonstration data.

## 11. Local demonstration data

Run these commands from backend/, with the backend already running
in another terminal using the local HTTP configuration.

An administrator account must already exist. See section 9 for
administrator provisioning.

Set the existing administrator email:

```bash
export ADMIN_EMAIL="your-admin@example.com"
```

Read and export its existing password:

```bash
read -r -s -p "Administrator password: " ADMIN_PASSWORD
printf '\n'
export ADMIN_PASSWORD
```

Choose a 12–128-character password for the demo representative.
On subsequent executions, enter the same password:

```bash
read -r -s -p "Demo representative password: " DEMO_PASSWORD
printf '\n'
export DEMO_PASSWORD
```

Prepare the demonstration records:

```bash
npm run seed:demo
```

The script creates or updates:

- The business account demo.representante@example.com.
- One fictitious company.
- One product belonging to that company.
- One offer linked to the product.
- One vacancy belonging to the company.

Repeated executions reuse the demonstration resource IDs, restore their
active/visible state, and renew the offer validity for seven days.

Keep [T6_DEMO_V1] at the beginning of the demonstration descriptions.
The script uses that marker to identify its records.

The script does not change an existing account password.
If interrupted, correct the reported problem and run it again.
Completed operations remain saved.

Seller and application links use example.com as demonstration destinations.
These records do not represent real businesses, offers, or vacancies.

Clear the password variables after use:

```bash
unset ADMIN_PASSWORD DEMO_PASSWORD
```

Each developer runs this command against their own local backend/database.
Git does not distribute MongoDB records.