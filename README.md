# Job Board API

Backend API for a job board platform built with Node.js, Express, and MongoDB.

It supports:
- User and employer authentication with JWT
- Employer company profile creation during registration
- Job posting management for employers
- Public job search with filtering, sorting, and pagination
- Security middlewares (Helmet, CORS, rate limiting)

## Tech Stack

- Node.js + Express (`type: module`)
- MongoDB + Mongoose
- JWT (`jsonwebtoken`) for auth
- `bcryptjs` for password hashing
- `helmet`, `cors`, `express-rate-limit` for security
- `dotenv` for environment configuration

## Project Structure

```text
.
├── server.js
├── src
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   ├── authController.js
│   │   └── jobController.js
│   ├── middlewares
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── models
│   │   ├── user.js
│   │   ├── Company.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── repositories
│   │   ├── userRepository.js
│   │   ├── companyRepository.js
│   │   └── jobRepository.js
│   ├── routes
│   │   ├── authRoutes.js
│   │   └── jobRoutes.js
│   └── services
│       ├── authService.js
│       └── jobService.js
└── package.json
```

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Create environment variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URL=mongodb+srv://<username>:<password>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_strong_secret
```

### 3) Run the server

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Server default URL:

```text
http://localhost:5000
```

## API Base URL

```text
http://localhost:5000/api
```

## Authentication

Protected routes require a Bearer token:

```http
Authorization: Bearer <jwt_token>
```

Token payload includes:
- `id`
- `name`
- `email`
- `role` (`user` | `employer` | `admin`)

## Routes

### Health Check

- `GET /`
  - Response: API status message

### Auth Routes (`/api/auth`)

- `POST /register`
  - Required: `name`, `email`, `password`
  - Optional: `role` (`user` or `employer`)
  - If `role = employer`, `companyName` is required.
  - Optional employer fields: `description`, `website`, `location`
  - Returns: `user`, optional `company`, and `token`

- `POST /login`
  - Required: `email`, `password`
  - Returns: `user` and `token`

- `GET /me` (Protected)
  - Returns current authenticated user payload from token

### Job Routes (`/api/jobs`)

- `GET /` (Public)
  - Search and filter jobs
  - Query params:
    - `search` (text search on title/description)
    - `location` (partial match, case-insensitive)
    - `minSalary`
    - `maxSalary`
    - `skills` (comma-separated, e.g. `skills=Node.js,MongoDB`)
    - `experienceLevel` (`entry` | `mid` | `senior`)
    - `jobType` (`full-time` | `part-time` | `contract` | `internship`)
    - `page` (default: `1`)
    - `limit` (default: `10`)
    - `sortBy` (`salary` or default latest by `createdAt`)
  - Returns: `jobs` and `pagination`

- `POST /` (Protected, Employer only)
  - Creates a new job
  - Employer must already have a company profile (created during employer registration)

- `GET /my-jobs` (Protected, Employer only)
  - Returns jobs posted by the current employer

- `PUT /:id` (Protected, Employer only)
  - Updates a posted job
  - Only job owner can update

- `DELETE /:id` (Protected, Employer only)
  - Deletes a posted job
  - Only job owner can delete

## Job Model Overview

Main fields for job creation:
- `title` (string, required)
- `description` (string, required)
- `location` (string, required)
- `salary.min` (number, required)
- `salary.max` (number, required)
- `salary.currency` (string, default: `INR`)
- `skills` (string array)
- `experienceLevel` (`entry` | `mid` | `senior`, required)
- `jobType` (`full-time` | `part-time` | `contract` | `internship`, required)
- `status` (`open` | `closed`, default: `open`)

## Example Requests

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

### Search Jobs

```bash
curl "http://localhost:5000/api/jobs?search=node&location=remote&skills=Node.js,MongoDB&page=1&limit=10&sortBy=salary"
```

## Security Notes

- Rate limiter is applied on `/api/*` with:
  - 100 requests per 15 minutes per IP
- `helmet()` secures common HTTP headers
- Passwords are hashed before storage using `bcryptjs`

## Notes

- `Application` model exists but application routes/controllers are not implemented yet.
- If you accidentally committed real secrets in `.env`, rotate those credentials and use placeholders in shared docs.

