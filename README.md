# lostandfound — CampusFound Lost & Found Platform Prototype

A modern, responsive, and interactive prototype for a **Campus Lost & Found Platform**, designed for college students, staff, and campus safety teams to report, locate, claim, and recover lost belongings safely.

Built with **React.js**, **Vite**, **Tailwind CSS**, **Lucide Icons**, and **React Router**, architected for seamless integration with a **Java Spring Boot REST API** and relational database (MySQL/PostgreSQL).

---

## 🚀 Key Features

### 1. Modern SaaS Campus Aesthetic
- Clean, premium indigo and violet color palette with soft surfaces and subtle elevation shadows.
- Responsive design tailored for mobile, tablet, and desktop screens.
- Interactive animations, toast notifications, and celebration confetti for successful reunions.

### 2. Complete Pages & Workflows
- **Landing Page (`/`)**:
  - Hero section: *"Lost Something? Let's Bring It Home."*
  - Real-time campus recovery counters (items reported, returned belongings, recovery rate, avg. reunion time).
  - Recently found items showcase with live status pills.
  - 3-step visual guide (*Report & Document* ➔ *Search & Submit Claim* ➔ *Verify & Reunited*).
  - Student success stories and testimonials (clearly identified demo content).
  - Comprehensive footer with primary security desk hotlines and guidelines.

- **Item Discovery (`/items`)**:
  - Grid and tabular list view switcher.
  - Live search by keyword, item title, or description.
  - Filter by report type (**Lost** vs **Found**).
  - Category filters: *Electronics, ID Cards, Keys, Bags & Backpacks, Books, Clothing, Accessories, Other*.
  - Campus location filter covering libraries, dining halls, labs, quads, and gyms.
  - Date range filters (*Today, Past 3 Days, Past 7 Days, Past Month, All*).
  - Sorting by newest and oldest.
  - Load-more pagination with empty, loading, and active filter chip states.

- **Student Dashboard (`/dashboard`)**:
  - Personalized welcome header with student profile details and student ID badge.
  - 4 KPI summary cards (*My Lost Items, My Found Items, Pending Claims, Recoveries*).
  - Tabbed management for:
    1. *My Reported Items* (with *Mark Returned*, *View Details*, *Delete* actions).
    2. *My Submitted Claims* (status tracking and verification instructions).
    3. *Claims Received on My Items* (review and approve incoming claims).

- **Claims Portal (`/claims`)**:
  - Centralized claim tracking with digital pickup pass generation (`CF-[ID]-VERIFIED`).
  - Claim review modal with approve/reject workflows and staff pickup notes.

- **Campus Desks & Help (`/help`)**:
  - Directory of physical campus drop-off/pickup desks with hours, phone numbers, and room locations.
  - Anti-fraud security verification guide and FAQs.

- **Authentication Suite (`/login`, `/register`, `/forgot-password`)**:
  - Student registration with full name, campus email, optional phone, and password confirmation.
  - Real-time input validation, duplicate email prevention, and error messaging.
  - **1-Click Prototype Demo Logins** to explore as:
    - *Alex Rivera* (Student)
    - *Maya Chen* (Student)
    - *Officer David Morgan* (Campus Security Admin)

### 3. Verification & Anti-Fraud Security
- Finders can attach a **Security Verification Hint** (e.g., *"What is the lockscreen wallpaper?"* or *"What initials are engraved?"*).
- Claimants must provide verifiable evidence and accept the University Student Honor Code before submission.

### 4. Hybrid API & Standalone Prototype Architecture
- Integrated REST API service (`src/services/api.js`) targeting `http://localhost:8080/api`.
- Built-in health checker detects if your Spring Boot backend is active.
- Offline-ready LocalStorage synchronization ensures all actions (reporting items, submitting claims, approving claims, resetting demo data) work immediately in prototype demonstrations without network failure screens.

---

## 📁 Project Directory Structure

```
namwe/
├── frontend/                     # React + Vite + Tailwind CSS Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── claims/           # ClaimModal, ReviewClaimModal
│   │   │   ├── common/           # Badge, Button, Modal, DemoSwitcher
│   │   │   ├── items/            # ItemCard, ItemListItem, ItemFilters, ItemDetailModal, ReportItemModal
│   │   │   └── layout/           # Navbar, Footer
│   │   ├── context/              # AuthContext, ItemsContext, ToastContext
│   │   ├── data/                 # Categories, Campus Locations, Initial Demo Data
│   │   ├── pages/                # HomePage, BrowseItemsPage, DashboardPage, ClaimsPage, Auth Pages
│   │   ├── services/             # Spring Boot REST API client with mock fallbacks
│   │   ├── utils/                # Confetti, image fallbacks
│   │   ├── App.jsx               # React Router configuration & layout
│   │   ├── index.css             # Tailwind base styles and custom glassmorphism
│   │   └── main.jsx              # Entry point
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── vercel.json               # Vercel SPA routing rewrites
│   └── .env.example
│
└── backend-spec/                 # Spring Boot Specification & Deployments
    ├── database-schema.sql       # Relational schema (MySQL / PostgreSQL)
    ├── Dockerfile                # Multi-stage Docker container for Spring Boot
    ├── render.yaml               # Infrastructure-as-code for Render deployment
    └── README.md                 # API documentation & backend integration steps
```

---

## 🛠️ Quick Start (Running the Prototype)

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Vite Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```
Generates optimized static assets in `frontend/dist/`.

---

## 🌐 Deploy the Prototype to Vercel

This submission deploys the **frontend prototype only**. It does not require or deploy the Spring Boot backend; reports, claims, and demo accounts are stored in the browser's LocalStorage.

1. Push this project to a Git provider supported by Vercel.
2. In Vercel, import the repository and set **Root Directory** to `frontend`.
3. Use the Vite defaults (or enter these values if prompted):
   - **Framework Preset:** Vite
   - **Install Command:** `npm install`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Leave environment variables unset for the standalone prototype, then deploy.

The `frontend/vercel.json` rewrite sends application routes such as `/items` and `/dashboard` to the SPA entry point, so direct links and page refreshes work on Vercel. The repository `.gitignore` excludes local environment files, dependencies, and build output.

`VITE_API_BASE_URL` is optional and should only be set to the URL of a separately deployed Spring Boot API. Vite exposes `VITE_` variables in browser code, so never put secrets in them. Without this setting the deployed app stays in standalone demo mode and does not probe `localhost`.

### Local production-build check

```bash
cd frontend
npm install
npm run build
npm run preview
```

## Optional Backend Deployment

For a separate full-stack deployment, use the bundled `backend-spec/render.yaml` blueprint for the Dockerized Spring Boot service and managed PostgreSQL database, then set the frontend's `VITE_API_BASE_URL` to that deployed API URL.
