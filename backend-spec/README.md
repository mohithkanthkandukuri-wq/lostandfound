# CampusFound: Spring Boot REST API & Full-Stack Deployment Guide

This directory outlines the full architecture, schema contracts, and deployment blueprints for integrating the **CampusFound** React frontend with a Java Spring Boot REST API and relational database.

---

## 1. System Architecture Overview

```
┌─────────────────────────────────┐           ┌─────────────────────────────────┐
│     React + Vite Frontend       │           │   Java Spring Boot 3.x REST API │
│   (Tailwind CSS + React Router) │           │    (Spring Security + JWT)      │
│                                 │  HTTP/JSON│                                 │
│  - Standalone Prototype Mode    │ ◄───────► │  - AuthController               │
│  - LocalStorage Auto-Sync       │  (Port    │  - ItemController               │
│  - Live API Switcher / Health   │   8080)   │  - ClaimController              │
│                                 │           │  - NotificationController       │
└─────────────────────────────────┘           └────────────────┬────────────────┘
                                                               │
                                                               │ JPA / Hibernate
                                                               ▼
                                              ┌─────────────────────────────────┐
                                              │ MySQL 8.0+ / PostgreSQL         │
                                              │  - users                        │
                                              │  - items                        │
                                              │  - claims                       │
                                              │  - notifications                │
                                              └─────────────────────────────────┘
```

---

## 2. Database Schema Alignment

The prototype frontend schema directly mirrors the relational schema defined in `database-schema.sql`:

| Table | Key Attributes | Notes |
| :--- | :--- | :--- |
| **`users`** | `id`, `name`, `email`, `password_hash`, `phone`, `role`, `student_id`, `department` | Roles: `USER`, `ADMIN`. Enforces unique email constraint. |
| **`items`** | `id`, `title`, `description`, `category`, `report_type`, `location`, `incident_date`, `status`, `image_path`, `secret_verification_hint`, `reporter_id` | `report_type` is `LOST` or `FOUND`. Status is `OPEN` or `RESOLVED`. |
| **`claims`** | `id`, `item_id`, `claimant_id`, `message`, `status`, `reviewed_by`, `review_message` | Status is `PENDING`, `APPROVED`, `REJECTED`, or `CANCELLED`. |
| **`notifications`** | `id`, `user_id`, `title`, `message`, `is_read`, `created_at` | In-app alerts for claim updates and matching reports. |

---

## 3. REST API Endpoint Specifications

All endpoints are prefixed with `/api`.

### A. Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a student account (`name`, `email`, `password`, `phone`).
- `POST /api/auth/login` — Authenticate and receive a JWT Bearer token.
- `POST /api/auth/logout` — Invalidate user session token.

### B. Items (`/api/items`)
- `GET /api/items` — Query items with filters: `?query=...&reportType=FOUND&category=Electronics&location=...&page=0&size=10`.
- `GET /api/items/recent` — Fetch recent items for the landing page.
- `GET /api/items/{id}` — Fetch item details with claim history.
- `GET /api/items/my` — Fetch items reported by the currently authenticated user.
- `POST /api/items` — Publish a new lost or found item.
- `PUT /api/items/{id}` — Update item details.
- `PATCH /api/items/{id}/return` — Mark item as reunited/returned.
- `DELETE /api/items/{id}` — Delete item report.

### C. Claims (`/api/claims` & `/api/items/{id}/claims`)
- `POST /api/items/{itemId}/claims` — Submit an ownership claim with verification proof.
- `GET /api/claims/my` — View claims submitted by the current student.
- `PATCH /api/claims/{id}/approve` — Approve claim and issue digital pickup pass.
- `PATCH /api/claims/{id}/reject` — Decline claim with reviewer feedback.
- `PATCH /api/claims/{id}/cancel` — Cancel pending claim by claimant.

### D. Notifications (`/api/notifications`)
- `GET /api/notifications` — Fetch user notification feed.
- `GET /api/notifications/unread-count` — Count of unread alerts.
- `PATCH /api/notifications/{id}/read` — Mark notification as read.

---

## 4. Connecting the Frontend to Your Backend

1. In the `frontend/.env` file, specify your backend API base URL:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```
2. Start your Spring Boot backend on port 8080 (`mvn spring-boot:run`).
3. The frontend's `DemoSwitcher` banner at the top will automatically detect the backend connection and show **"Spring Boot API Connected"**.
4. If the backend is stopped or offline, the frontend falls back cleanly to its interactive LocalStorage store so demo presentations never crash or fail due to network timeouts!

---

## 5. Production Deployment

### Deploying Frontend to Vercel
1. Install Vercel CLI: `npm i -g vercel` (or link your GitHub repository in the Vercel dashboard).
2. Root directory: `frontend`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. The bundled `vercel.json` ensures all client-side routes (`/items`, `/dashboard`, etc.) resolve properly without 404s.

### Deploying to Render
1. A complete `render.yaml` infrastructure-as-code file is included.
2. In the Render Dashboard, create a **New Blueprint Instance** and point to your repository.
3. Render will provision:
   - **Static Site**: React frontend.
   - **Docker Web Service**: Spring Boot backend container.
   - **PostgreSQL Database**: Auto-connected via environment variables.
