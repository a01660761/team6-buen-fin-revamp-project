# El Buen Fin: Web Revamp

An academic redesign of the El Buen Fin web portal, built with the use
of React, React-Admin, Express and MongoDB. The final delivery is a local
functional demonstration. Fictitious demonstration records are identified
with 'DEMO' in their names.

This prototype does not perform  any official participant accreditation, SAT registration,
institutional price verification, nor purchases or payments.

## Delivery status

| Area | Available in this delivery |
| --- | --- |
| Visitors | Business directory, search/filtering, company details, company product/offer catalogs, offer detail and external seller links. |
| Job seekers | Public vacancy list, type filter, details and external application links. |
| Representatives | Registration, login/logout, session-aware profile menu and persistent creation/editing/deactivation/reactivation of their companies. |
| Administrators | Protected company and product list/create/edit interfaces, visibility controls for these resources, and a real-data offer list. |
| Backend | Authentication/roles, private resource CRUD, ownership checks and sanitized public resource endpoints. |
| Demonstration data | Repeatable seed for one representative, company, product, offer and vacancy. |

Representative interfaces for product, offer and vacancy management remain incomplete.
Offers are read-only in the administrative interface; dashboard counts are pending.
An API implementation does not imply that its corresponding browser interface is complete.

## Technologies and repository structure

| Component | Stack |
| --- | --- |
| Frontend | React 19, React-Admin 5, TypeScript 5, Vite 7, Material UI and Tailwind CSS. |
| Backend | Node.js, Express 5, MongoDB Node.js driver, Argon2id and JSON Web Tokens. |
| Database | MongoDB Community 8.0. |
| Package manager | npm; use the committed package-lock.json in each service. |

**Locked examples at delivery**: React 19.2.8, React-Admin 5.15.4,
TypeScript 5.9.3, Vite 7.3.6 and @vitejs/plugin-react 4.7.0.
The lockfiles are authoritative; npm ci installs the locked dependency trees.

~~~text
backend/       Express API, authentication, resource modules and CLI scripts
frontend/      Public website and administrative interface
docs/          Data model, API contract and development notes
~~~


## Installation Manual

### 1. Requirements and supported setup path

The commands below target Ubuntu 24.04 LTS x86_64, either native or inside
WSL 2 on Windows. The team's local application checks were performed on
Windows/WSL with Node.js 20.20.0 and MongoDB 8.0. The setup below selects
Node.js 22; the locked Vite and MongoDB driver dependencies accept this version.

- Windows 11, or Windows 10 version 2004/build 19041 or later, if using WSL.
- Ubuntu 24.04 LTS and a Bash terminal with sudo access.
- Node.js 22, version 22.12 or later, and its bundled npm.
- MongoDB Community 8.0 and mongosh.
- Git, curl, Python 3, make and a C/C++ build toolchain.
- Internet access for source code, npm packages and installation repositories.
- Free local ports 27017 (MongoDB), 3000 (API) and 5173 (frontend).
- An updated Firefox, Chrome or Edge browser.

Practical workstation guidance: 8 GB RAM and 5+ GB free disk space are recommended
for Windows/WSL and development tools. These are planning recommendations, not
benchmarked minimum requirements.

The project has been executed as a local demo.

### 2. Prepare WSL (WINDOWS ONLY)

Skip this subsection on native Ubuntu or if a suitable WSL 2 Ubuntu environment
already exists.

In **PowerShell as Administrator**:

~~~powershell
wsl --install -d Ubuntu-24.04
~~~

Restart Windows if requested. Open Ubuntu 24.04 and finish creating its Linux
username and password. This is an operating-system account, separate from
the application's representative and administrator accounts.

Check the distribution from PowerShell:

~~~powershell
wsl --list --verbose
~~~

Ubuntu-24.04 should use version 2. All remaining commands use **Ubuntu/Bash**,
unless a block explicitly says PowerShell.

### 3. Install system tools and Node.js

In Ubuntu:

~~~bash
sudo apt-get update
sudo apt-get install -y git curl ca-certificates gnupg build-essential python3
~~~

Install nvm using its official installer, then Node.js 22:

~~~bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh -o /tmp/buenfin-nvm-install.sh
bash /tmp/buenfin-nvm-install.sh
source "$HOME/.nvm/nvm.sh"
nvm install 22
nvm use 22
nvm alias default 22
node --version
npm --version
~~~

Node should report v22.x, at least 22.12. Do not use an older Node supplied
by an unrelated Windows installation. Run Node/npm and the repository inside
the same Ubuntu environment.

The build toolchain supports installation of native packages such as argon2
if a suitable prebuilt binary is unavailable. Do not run npm ci with sudo.

### 4. Install and start MongoDB

Skip the installation commands if MongoDB 8.0 is already installed and
reachable. Still perform the service and ping checks.

The APT repository below is for **Ubuntu 24.04 (Noble)**:

~~~bash
curl -fsSL https://pgp.mongodb.com/server-8.0.asc |
  sudo gpg --dearmor --yes -o /usr/share/keyrings/mongodb-server-8.0.gpg

echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" |
  sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list

sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl enable --now mongod
systemctl is-active mongod
mongosh "mongodb://127.0.0.1:27017/buenfin" --quiet --eval 'db.runCommand({ ping: 1 })'
~~~

Expected results: active and a MongoDB response containing ok: 1.

If systemctl reports that systemd is not running, see Troubleshooting below.

### 5. Clone the repository and install application dependencies



~~~bash
git clone https://github.com/a01660761/team6-buen-fin-revamp-project.git
cd team6-buen-fin-revamp-project
git switch main

cd backend
npm ci

cd ../frontend
npm ci --include=dev

cd ..
~~~

Run npm ci separately in backend and frontend. There is no root installation
script. Both service installations must finish successfully.

If the repository is already cloned, first preserve any uncommitted work.
For a clean working tree, update main with git pull --ff-only origin main.
These instructions assume the final integration PR has been merged.

### 6. Configure both local environment files

From the repository root, create files only if they do not already exist:

~~~bash
cp -n backend/.env.example backend/.env
cp -n frontend/.env.example frontend/.env
~~~

Generate a random JWT signing secret:

~~~bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
~~~

Copy the resulting 64 hexadecimal characters. Edit backend/.env:

~~~bash
nano backend/.env
~~~

Its local HTTP configuration must be:

~~~dotenv
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/buenfin
JWT_SECRET=replace_with_local_secret
CORS_ORIGIN=http://localhost:5173
HTTPS_ENABLED=false
TLS_KEY_PATH=./certs/backend.key
TLS_CERT_PATH=./certs/backend.crt
~~~

**Replace replace_with_local_secret with the generated value.**
The backend intentionally rejects the example placeholder.
The TLS paths are ignored when HTTPS_ENABLED=false; no certificates are
needed for this HTTP demo.

Then edit frontend/.env:

~~~bash
nano frontend/.env
~~~

Use:

~~~dotenv
VITE_JSON_SERVER_URL=http://localhost:3000
DEV_SERVER_PORT=5173
HTTPS_ENABLED=false
TLS_KEY_PATH=./certs/frontend.key
TLS_CERT_PATH=./certs/frontend.crt
~~~

In nano, save using Ctrl+O, Enter, then exit using Ctrl+X.

CORS_ORIGIN must exactly match the browser's frontend origin.
Use http://localhost:5173 consistently; localhost and 127.0.0.1 are
different browser origins.

MongoDB credentials and JWT_SECRET belong only in backend/.env.
VITE_ variables are public browser configuration. Never commit the local
.env files, passwords, signing secret or private certificate keys.

### 7. Start the API and frontend in separate terminals

**Terminal A — API:**

~~~bash
cd "$HOME/dev/team6-buen-fin-revamp-project/backend"
npm start
~~~

Expected:

~~~text
Connected to MongoDB.
Backend ready at http://localhost:3000
~~~

Keep this terminal running.

**Terminal B — frontend:**

~~~bash
cd "$HOME/dev/team6-buen-fin-revamp-project/frontend"
npm run dev
~~~

Open **http://localhost:5173/** in the browser and keep this terminal running.
The administrative panel is **http://localhost:5173/admin**.

The API on port 3000 serves resource endpoints, not the website. A 404 at
http://localhost:3000/ alone does not mean API startup failed.

### 8. Create a local administrator

A fresh database has no app accounts. Registering from the public
website creates a representative, not an administrator.

In **Terminal C**, while MongoDB and the API remain running:

~~~bash
cd "$HOME/dev/team6-buen-fin-revamp-project/backend"
export ADMIN_EMAIL="admin.demo@example.com"
export ADMIN_FIRST_NAME="Admin"
export ADMIN_LAST_NAME="Demo"
~~~

Choose and remember a new administrator password of 12–128 characters.
Run this line by itself, type the password at its prompt and press Enter:

~~~bash
read -r -s -p "Choose administrator password (12-128 characters): " ADMIN_PASSWORD
~~~

The characters are intentionally hidden. Then run:

~~~bash
printf '\n'
export ADMIN_PASSWORD
npm run create-admin
unset ADMIN_PASSWORD
~~~

Expected: Administrator created. ID: ...

Use that email and chosen password at /admin. There is no universal
administrator password. The script does not promote an existing account,
change an existing password or overwrite an existing role.
If the email already exists, use the existing credentials or choose a
different unused email for a new administrator.

The database and its collections are populated by the application/scripts;
no manual collection creation or database dump import is required.

### 9. Prepare demonstration data

Without seeding, public lists can legitimately be empty.
Continue in Terminal C from backend/, with the API still running in Terminal A
and HTTPS_ENABLED=false. The seed uses local HTTP.

Set the email of the administrator just created:

~~~bash
export ADMIN_EMAIL="admin.demo@example.com"
~~~

Run this line by itself and enter that administrator's existing password:

~~~bash
read -r -s -p "Existing administrator password: " ADMIN_PASSWORD
~~~

Then:

~~~bash
printf '\n'
export ADMIN_PASSWORD
~~~

Choose a separate 12–128-character password for the demonstration representative.
Run this line by itself and enter it:

~~~bash
read -r -s -p "Demo representative password (12-128 characters): " DEMO_PASSWORD
~~~

Then:

~~~bash
printf '\n'
export DEMO_PASSWORD
npm run seed:demo
unset ADMIN_PASSWORD DEMO_PASSWORD
~~~

Expected output includes:

~~~text
companies: created; id=...
products: created; id=...
offers: created; id=...
vacancies: created; id=...
Demo ready. Business login: demo.representante@example.com
Offer valid until: ...
~~~


The seed prepares one representative, company, product, offer and vacancy.
It renews the offer validity for seven days and restores the demo records'
active/visible state. Re-running it can overwrite edits to these demo fixtures;
use separate records when testing changes you want to keep.

The representative login is demo.representante@example.com with the
DEMO_PASSWORD you chose. Reuse that same password on later seed runs:
the script does not reset an existing account's password.

Keep [T6_DEMO_V1] at the start of seeded descriptions. Seller and job
application links deliberately open example.com; they are demonstration
destinations, not live commercial or recruitment integrations.

Git does not transfer MongoDB accounts or records between computers.

### 10. Verify the installed application

**Public API checks — Terminal C:**

~~~bash
curl -i "http://localhost:3000/public/companies?_start=0&_end=10"
curl -i "http://localhost:3000/public/products?_start=0&_end=10"
curl -i "http://localhost:3000/public/offers?_start=0&_end=10"
curl -i "http://localhost:3000/public/vacancies?_start=0&_end=10"
curl -i http://localhost:3000/users/me
~~~

The four public endpoints should return 200 and arrays containing the demo
records after successful seeding. Paginated lists include X-Total-Count.
The identity endpoint should return 401 when called without a token.

Access JWTs expire after 900 seconds (15 minutes). The frontend stores its
token in sessionStorage for the tab. Logging out revokes existing tokens
for that account; other sessions may require login again.

**Type checking and production compilation — from frontend/:**

~~~bash
npx --no-install tsc -p tsconfig.node.json --noEmit
npx --no-install tsc -p tsconfig.app.json --noEmit
npm run build
~~~

Both TypeScript commands must finish without errors. Vite should end with a
successful build and create frontend/dist. The large-chunk warning is a
bundle-size warning, not a failed compilation.

The npm test command in backend is currently a placeholder and is not an
automated test suite. Type checking, a successful build and the manual checks
above are distinct forms of validation; none establishes full MLP completion.

### 11. Start again after installation

Start MongoDB if necessary:

~~~bash
sudo systemctl start mongod
~~~

Then run npm start from backend/ and npm run dev from frontend/ in separate
terminals as in step 7. There is no need to reinstall dependencies or seed
again on every startup. Seed again if the demo offer has expired.

Stop the API and frontend using Ctrl+C in their respective terminals.
Data remains in MongoDB after either application process stops.
Restart the relevant process after changing its .env.

## Development Documentation

### NOTE: All of these documents (including this README) were curated with the use of ChatGPT - please check their respective declarations.

- [Development setup, conventions and technical decisions](docs/development-guide.md)
- [Minimum MongoDB data model](docs/data-model.md)
- [Minimum API contract](docs/api-contract.md)
- [Initial backend audit](backend/README.md)

## Final infrastructure verification

The local development environment was recorded using an Intel Core
i7-12700, 20 logical processors visible to WSL2, 7.6 GiB of memory
available to the Linux environment, Node.js 20.20.0 and npm 10.8.2.

Environment information, process identification and collected resource
measurement outputs are stored in docs/evidence/. The monitored services
are the Express backend, Vite development server, MongoDB and esbuild.

These observations describe the local development environment. They do
not establish minimum hardware requirements or production capacity.

### Verified local HTTPS setup

Local HTTPS was enabled for both the Express API and the Vite development
server using certificates generated with mkcert.

From Ubuntu/WSL, install mkcert and prepare the local certificate authority:

```bash
sudo apt-get update
sudo apt-get install -y mkcert libnss3-tools
mkcert -install
```

From the repository root, generate the server certificates:

```bash
mkdir -p backend/certs frontend/certs

mkcert -key-file backend/certs/backend.key \
  -cert-file backend/certs/backend.crt \
  localhost 127.0.0.1 ::1

mkcert -key-file frontend/certs/frontend.key \
  -cert-file frontend/certs/frontend.crt \
  localhost 127.0.0.1 ::1

cp "$(mkcert -CAROOT)/rootCA.pem" backend/certs/buenfin-local-ca.crt
```

Configure these values in backend/.env, preserving the existing database
connection and JWT secret:

```dotenv
CORS_ORIGIN=https://localhost:5173
HTTPS_ENABLED=true
TLS_KEY_PATH=./certs/backend.key
TLS_CERT_PATH=./certs/backend.crt
```

Configure frontend/.env:

```dotenv
VITE_JSON_SERVER_URL=https://localhost:3000
DEV_SERVER_PORT=5173
HTTPS_ENABLED=true
TLS_KEY_PATH=./certs/frontend.key
TLS_CERT_PATH=./certs/frontend.crt
```

For Firefox running on Windows, import backend/certs/buenfin-local-ca.crt
through Settings → Privacy & Security → Certificates → View Certificates
→ Authorities → Import, and trust it to identify websites.

Restart both application servers:

- From backend/: npm start
- From frontend/: npm run dev

Open https://localhost:5173/. The API uses https://localhost:3000.

Local HTTPS operation was manually verified successfully in Firefox.
This configuration provides HTTPS for the local demonstration; production
deployment was not evaluated.

Certificates, private keys and private environment files are excluded
from version control.