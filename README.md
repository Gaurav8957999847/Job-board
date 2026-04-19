# Job Board API

A REST API for a job-board platform where:
- users can register/login and browse jobs
- employers can register, create a company profile, and manage job posts

Built with Express, MongoDB, and JWT authentication.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Run Commands](#run-commands)
- [API Overview](#api-overview)
- [Endpoint Reference](#endpoint-reference)
- [Request Examples](#request-examples)
- [Project Structure](#project-structure)
- [Security](#security)
- [Known Gaps](#known-gaps)
- [Git Ignore and Push](#git-ignore-and-push)

## Features

- JWT-based authentication (`register`, `login`, `me`)
- Role-based authorization (`employer`-only job management)
- Employer-company linkage at registration
- Public job discovery with filters, sorting, and pagination
- Centralized error handling middleware
- Basic API hardening with Helmet, CORS, and rate limiting

## Tech Stack

- Node.js
- Express 5
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- Security middleware (`helmet`, `cors`, `express-rate-limit`)

## Quick Start

```bash
npm install
```

Create `.env` in the root:

```env
PORT=5000
MONGO_URL=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret
```

Run:

```bash
npm run dev
```

API will be available at:

```text
http://localhost:5000
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: `5000`) |
| `MONGO_URL` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign JWT tokens |

## Run Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with nodemon |
| `npm start` | Start server with Node.js |

## API Overview

- Base URL: `http://localhost:5000/api`
- Root health route: `GET /`
- Protected endpoints require header:

```http
Authorization: Bearer <token>
```

### Roles

- `user`: can authenticate and browse jobs
- `employer`: can authenticate and create/manage own jobs
- `admin`: defined in user model but no admin-only routes implemented yet

## Endpoint Reference

### Auth (`/api/auth`)

| Method | Route | Access | Purpose |
|---|---|---|---|
| `POST` | `/register` | Public | Register user/employer |
| `POST` | `/login` | Public | Login and get JWT |
| `GET` | `/me` | Protected | Get current token user |

#### Register request notes

- Required: `name`, `email`, `password`
- Optional: `role` (`user` or `employer`)
- If `role` is `employer`, `companyName` is required
- Optional employer fields: `description`, `website`, `location`

### Jobs (`/api/jobs`)

| Method | Route | Access | Purpose |
|---|---|---|---|
| `GET` | `/` | Public | Search/list jobs |
| `POST` | `/` | Protected (`employer`) | Create a job |
| `GET` | `/my-jobs` | Protected (`employer`) | List current employer jobs |
| `PUT` | `/:id` | Protected (`employer`) | Update own job |
| `DELETE` | `/:id` | Protected (`employer`) | Delete own job |

#### Search query params (`GET /api/jobs`)

| Query Param | Type | Notes |
|---|---|---|
| `search` | string | Text search on `title` and `description` |
| `location` | string | Case-insensitive partial match |
| `minSalary` | number | Filters on `salary.min >= minSalary` |
| `maxSalary` | number | Filters on `salary.min <= maxSalary` |
| `skills` | string | Comma-separated list, e.g. `Node.js,MongoDB` |
| `experienceLevel` | enum | `entry`, `mid`, `senior` |
| `jobType` | enum | `full-time`, `part-time`, `contract`, `internship` |
| `page` | number | Default `1` |
| `limit` | number | Default `10` |
| `sortBy` | string | `salary` or default latest (`createdAt`) |

## Request Examples

### Register Employer

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Employer",
    "email": "jane@example.com",
    "password": "password123",
    "role": "employer",
    "companyName": "Acme Corp",
    "description": "Hiring great developers",
    "website": "https://acme.example",
    "location": "Remote"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123"
  }'
```

### Create Job (Employer)

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Backend Developer",
    "description": "Build scalable APIs",
    "location": "Bangalore",
    "salary": { "min": 800000, "max": 1400000, "currency": "INR" },
    "skills": ["Node.js", "MongoDB", "REST"],
    "experienceLevel": "mid",
    "jobType": "full-time"
  }'
```

### Search Jobs

```bash
curl "http://localhost:5000/api/jobs?search=node&location=remote&skills=Node.js,MongoDB&page=1&limit=10&sortBy=salary"
```

## Project Structure

```text
.
├── server.js
├── src
│   ├── config/          # database connection
│   ├── controllers/     # route handlers
│   ├── middlewares/     # auth + global error handler
│   ├── models/          # mongoose schemas
│   ├── repositories/    # DB access layer
│   ├── routes/          # express routes
│   └── services/        # business logic
└── package.json
```

## Security

- `helmet()` for secure HTTP headers
- `cors()` enabled
- rate limit on `/api/*`:
  - 100 requests per 15 minutes per IP
- hashed passwords with `bcryptjs`

## Known Gaps

- `Application` model exists but no application routes/controllers yet
- no test suite configured yet
- no API docs generator (Swagger/OpenAPI) yet

## Git Ignore and Push

`.gitignore` should include:

```gitignore
node_modules/
.env
```

If these were already committed once, untrack them before push:

```bash
git rm -r --cached node_modules .env
git commit -m "chore: stop tracking local-only files"
```

