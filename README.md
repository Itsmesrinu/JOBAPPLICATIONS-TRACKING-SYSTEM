# 🚀 TalentFlow - MERN Stack Applicant Tracking System

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A comprehensive Applicant Tracking System designed to streamline recruitment workflows with role-based access control and automated hiring pipelines.

## 🌟 Key Features

### 👥 Role-Based Access Control
- Four distinct user roles: Candidate, Employer, Coordinator, Recruiter
- Custom dashboards for each role
- JWT authentication with secure session management

### 📋 Hiring Workflow Management
- Multi-stage job posting approval system
- Customizable R1/R2 evaluation forms
- Candidate shortlisting pipeline
- Real-time application status tracking

### 📊 Interactive Dashboards
- Employer: Job post creation & analytics
- Coordinator: Workflow management & recruiter assignment
- Recruiter: Candidate evaluation & screening
- Candidate: Application tracking & status updates

## 🛠️ Tech Stack

### Frontend
[![Redux](https://img.shields.io/badge/Redux-764ABC?style=flat-square&logo=redux&logoColor=white)](https://redux.js.org/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=react-router&logoColor=white)](https://reactrouter.com/)

### Backend
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat-square&logo=mongoose&logoColor=white)](https://mongoosejs.com/)

## 📸 Application Screenshots

### Authentication
| Signup | Login |
|--------|-------|
| ![Signup](https://github.com/user-attachments/assets/937957b6-8886-4cba-9005-a0408db1332f) | ![Login](https://github.com/user-attachments/assets/73311772-642c-46ea-9196-338338e41f9c) |

### Employer View
| Dashboard | Job Creation |
|-----------|--------------|
| ![Employer Dashboard](https://github.com/user-attachments/assets/ebd68706-1781-43af-82fc-15de75cbcad7) | ![Job Creation](https://github.com/user-attachments/assets/45a4b273-123b-4c3d-8986-0be3301c07d6) |

### Coordinator View
| Main Dashboard | Recruiter Assignment |
|----------------|-----------------------|
| ![Coordinator Dashboard](https://github.com/user-attachments/assets/caff5429-87f0-4c2f-b25f-d58c32153342) | ![Recruiter Assignment](https://github.com/user-attachments/assets/444ce11e-7e9e-474c-9894-8f6a1369e2d8) |

### Recruiter View
| Dashboard | Evaluation Form |
|-----------|-----------------|
| ![Recruiter Dashboard](https://github.com/user-attachments/assets/ebda9611-216a-4d05-8c1b-51d5c944879d) | ![R2 Form](https://github.com/user-attachments/assets/18634a87-2a9a-4669-b2f0-cee16c52367e) |

### Candidate View
| Job Listings | Application |
|--------------|-------------|
| ![Job Listings](https://github.com/user-attachments/assets/904e10f9-2dd4-478c-acf8-e6abbb7b8d24) | ![Application](https://github.com/user-attachments/assets/3018eca6-7e84-47f6-b5ef-ab74b659968a) |

## 🚀 Installation Guide

```bash
# Clone repository
git clone https://github.com/Itsmesrinu/JOBAPPLICATIONS-TRACKING-SYSTEM.git
cd application-tracking-system

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### Environment Setup
Create `.env` in `/server` with:
```env
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

## ⚡ Running the System

1. **Start Backend**
```bash
cd server
npm run dev
```

2. **Start Frontend**
```bash
cd client
npm start
```

Access the system at `http://localhost:3000`

## 🔄 Workflow Diagram

```mermaid
graph TD
    A[Employer Creates Job Post] --> B{Coordinator Approval}
    B -->|Approved| C[Add R2 Form]
    C --> D[Assign Recruiters]
    D --> E[Post Job]
    E --> F[Candidate Applies]
    F --> G[Recruiter Screening]
    G --> H[Shortlist Candidates]
```

## 📄 License
Distributed under
