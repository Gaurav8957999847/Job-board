<div align="center">
  <img src="banner.png" alt="Job Board API Banner" width="100%">
  
  # 🚀 Job Board API
  
  ### *A Robust, Scalable, and Professional RESTful API for Modern Job Platforms*
  
  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
  [![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](https://opensource.org/licenses/ISC)

</div>

---

## 📖 Introduction

The **Job Board API** is a comprehensive backend solution designed to handle the complexities of a modern job marketplace. Whether you're a developer building a job search portal or an organization looking to manage internal hiring, this API provides the foundation you need.

It features a dual-role system (User/Employer), secure JWT authentication, advanced job filtering, resume upload capabilities, and a personalized experience for both job seekers and recruiters.

---

## ✨ Key Features

- **🔐 Secure Authentication**: JWT-based authentication with password hashing using Bcrypt.
- **👥 Dual Roles**: Dedicated functionalities for **Job Seekers** and **Employers**.
- **💼 Job Management**: Full CRUD operations for employers to manage their job postings.
- **🔍 Advanced Search**: Filter jobs by location, salary range, job type, experience level, and skills.
- **📄 Application System**: Multi-part form handling for resume uploads (PDF/Docs).
- **💾 Saved Jobs**: Ability for users to save jobs for later reference.
- **🛡️ API Hardening**: Security features including Helmet, CORS, and Rate Limiting to prevent DDoS and common attacks.
- **🏗️ Clean Architecture**: Implemented using MVC and Repository patterns for high maintainability.

---

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js 5.x](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (with [Mongoose](https://mongoosejs.com/))
- **Auth**: [JSON Web Tokens (JWT)](https://jwt.io/) & [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)
- **File Uploads**: [Multer](https://github.com/expressjs/multer)
- **Security**: [Helmet](https://helmetjs.github.io/), [CORS](https://github.com/expressjs/cors), [Express Rate Limit](https://github.com/n67/express-rate-limit)

---

## 📂 Project Structure

```text
.
├── src/
│   ├── config/          # ⚙️ Database and Environment configurations
│   ├── controllers/     # 🕹️ Logic for handling requests
│   ├── middlewares/     # 🛡️ Auth, Error Handling, and Security
│   ├── models/          # 📊 Mongoose Schemas (User, Job, Company, Application, SavedJobs)
│   ├── repositories/    # 🗄️ Database Access Layer (Abstracting Mongoose)
│   ├── routes/          # 🛣️ API Endpoints definitions
│   ├── services/        # 🧠 Business Logic implementation
│   └── utils/           # 🧰 Helper functions and Constants
├── uploads/             # 📁 Storage for uploaded resumes
├── server.js            # 🚀 Application Entry Point
└── .env                 # 🔑 Environment Variables (Secret)
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd job-board-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   ```

4. **Run the application**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

---

## 📡 API Reference

### 1. Authentication (`/api/auth`)

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/register` | `POST` | Public | Register as a User or Employer |
| `/login` | `POST` | Public | Login and receive a JWT |
| `/me` | `GET` | Private | Get profile details of logged-in user |

#### Register Example:
```bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "employer",
  "companyName": "Tech Solutions Inc.",
  "location": "Remote"
}'
```

---

### 2. Jobs (`/api/jobs`)

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/` | `GET` | Public | List all jobs (with filters & search) |
| `/` | `POST` | Private (Emp) | Create a new job posting |
| `/:id` | `PUT` | Private (Emp) | Update a job posting |
| `/:id` | `DELETE` | Private (Emp) | Delete a job posting |
| `/my-jobs` | `GET` | Private (Emp) | Get all jobs posted by the employer |

#### Search Query Parameters:
- `search`: Keyword search in title/description.
- `location`: Filter by location.
- `minSalary` / `maxSalary`: Salary range filtering.
- `jobType`: `full-time`, `part-time`, `contract`, `internship`.
- `experienceLevel`: `entry`, `mid`, `senior`.

---

### 3. Applications & Interactions

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/:jobId/apply` | `POST` | Private (User) | Apply to a job (Requires resume upload) |
| `/my-applications` | `GET` | Private (User) | View all your submitted applications |
| `/:jobId/applications` | `GET` | Private (Emp) | View all applicants for a specific job |
| `/:jobId/save` | `POST` | Private (User) | Save a job for later |
| `/saved` | `GET` | Private (User) | View your saved jobs list |

#### Apply to Job Example:
```bash
curl -X POST http://localhost:5000/api/jobs/65f.../apply \
-H "Authorization: Bearer <your_token>" \
-F "resume=@/path/to/your/resume.pdf" \
-F "coverLetter=I am excited to apply for this role!"
```

---

## 🛡️ Security Implementation

- **Helmet**: Protects from well-known web vulnerabilities by setting HTTP headers appropriately.
- **Rate Limiting**: Prevents brute-force and DDoS attacks (100 requests per 15 minutes per IP).
- **CORS**: Configured to control cross-origin resource sharing.
- **JWT Authorization**: All private routes are guarded by a middleware that verifies the token.
- **Role-Based Access Control (RBAC)**: Ensuring only employers can manage jobs and only users can apply.

---

## 🔮 Future Roadmap

- [ ] **Cloudinary Integration**: For cloud-based resume storage.
- [ ] **Email Notifications**: Send alerts on application status changes.
- [ ] **Admin Dashboard**: Advanced management features for administrators.
- [ ] **Unit & Integration Tests**: Comprehensive testing suite.
- [ ] **Swagger Documentation**: Interactive API documentation.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the ISC License. See `LICENSE` for more information.

---

<div align="center">
  Developed with ❤️ by [Your Name/Github]
</div>
