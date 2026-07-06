# PlacementPro AI - Smart Campus Placement Portal

PlacementPro AI is a comprehensive, production-ready campus hiring and placement portal designed to streamline recruitment. It bridges the gap between candidates, corporate recruiters, and university administration using intelligent, role-based dashboards, and custom text capability parsing.

---

## 🚀 Key Features

### 👤 Student Dashboard
* **Dynamic Resume Audit**: Upload PDF/DOCX resumes or paste raw text to view match ratings, key capability extractions, and critical feedback instantly.
* **Interactive Capability Editor**: Manually fine-tune, add, or remove technical skills directly from the parsed results.
* **Smart Recommendations**: View job listings prioritized by personalized skill match percentages.
* **Application Pipeline**: Track the step-by-step progress of your submitted applications (Applied, Shortlisted, Interviewing, Offered).
* **Interview Gateway**: View upcoming rounds, interviewer info, and join video conference meetings directly via in-app links.

### 💼 Recruiter Suite
* **Job Posting Console**: Create and manage job roles with detailed requirements, salary brackets, and location models.
* **Applicant Matrix**: Browse applicant submissions with live matching scores and quick filters.
* **Applicant Shortlisting**: Promote applicants straight to scheduling pipelines or log rejections instantly.
* **Interview Scheduler**: Set up round names, times, formats (Online/In-person), and video meeting rooms.

### 🛡️ Administrative Portal
* **Live System Metrics**: View overall portal registrations, active recruiters, job postings, and placement ratios.
* **User & Company Management**: Active auditing capabilities for student profiles and corporate partners.

### 🔔 Experience Polish
* **Real-time Toasts**: Gorgeous, sliding pop-out alert banners triggered instantly on key actions.
* **Dynamic Navigation**: Single-page navigation system with direct homepage redirection routes from anywhere inside the app.

---

## 🛠️ Technology Stack

* **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Framer Motion
* **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Authentication
* **Python Services**: Flask, PyPDF (text node scanning), regex capability mapping, recommendation matrices

---

## ⚙️ How to Run Locally

### 1. Main Unified Server
You can compile and serve the entire portal from a single port (5000):
```bash
# Build frontend assets
npm install
npm run build

# Start Express server
cd backend
npm install
node server.js
```
The application will run at **`http://localhost:5000`**.

### 2. Python AI Service
```bash
cd python
pip install -r requirements.txt
python app.py
```
The AI backend will start on port **`8000`**.
