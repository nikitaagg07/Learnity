 # Learnity: Modular Education Management System
**Learnity** is a modern and scalable Learning Management System (LMS) built using the MERN stack. It is designed to streamline online education through powerful features like course management, real-time collaboration, AI-powered proctoring, and multilingual accessibility. Learnity serves learners, instructors, and administrators with dedicated dashboards and tools tailored to each role.

## 🚀 Features

- 📚 **Course Management** – Create, update, and organize course materials (videos, PDFs, links).
- 🧑‍🏫 **Role-Based Dashboards** – Separate interfaces for Admins, Instructors, and Learners.
- 📝 **Quizzes & Assignments** – Auto-graded assessments, real-time submission tracking.
- 📹 **Live Lectures** – Schedule and join classes via Jitsi with session recording support.
- 🧠 **AI Proctoring** – Facial recognition during exams using face-api.js.
- 💬 **Real-Time Chat** – Socket.io-powered messaging for learners and instructors.
- 🌐 **Multilingual Support** – Translate course content dynamically using Google Translate API.
- 🔊 **Text-to-Speech** – Improve accessibility with content read-aloud in multiple languages.
- 📈 **Admin Analytics** – View user activity, payments, top courses, and system logs.

---

## 🧑‍💻 Tech Stack

### Frontend
- **React.js** – Component-based UI
- **Tailwind CSS** – Responsive styling
- **Shadcn UI** – Accessible component library

### Backend
- **Node.js** – Server runtime
- **Express.js** – API framework

### Database
- **MongoDB** – NoSQL database

### Integrations
- **Monaco Editor** – In-browser code editing
- **Judge0 API** – Code execution backend
- **face-api.js** – Face detection for proctoring
- **Jitsi** – Video conferencing
- **Socket.io** – Real-time chat

---

## 📦 Getting Started

1. **Clone the repo**
```bash
git clone https://github.com/nikitaagg07/learnity.git
```
2. **Install dependencies**
```bash
cd frontend && npm install
cd backend && npm install
```
3. **Run development servers**
```bash
# In one terminal
cd frontend
npm start

# In another terminal
cd backend
node server.js
```
4. **Seed the database (optional)** // course.json
```bash
node seed.js
```
5. **🔐 Environment Variables**
Create .env files in both frontend/ and backend/ directories and configure:
```bash
MONGO_URI=your_mongodb_connection
PORT=5000
JWT_SECRET=your_very_secure_jwt_secret

# Google reCAPTCHA (for server-side/ backend verification)
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
RECAPTCHA_SITE_KEY=your_recaptcha_site_key
SITE_KEY_CAPTCHA=your_site_key
SECRET_KEY_CAPTCHA=your_secret_key

# Frontend URL 
REACT_APP_API_URL=http://localhost:3000   //Frontend URL(if needed for CORS or redirects)

REACT_APP_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
REACT_APP_API_URL=http://localhost:5000
```
## ⚠️ Important Notes
- Replace all your_* placeholders with actual values from:
```bash
MongoDB Atlas
Google reCAPTCHA Admin Panel
```
- Keep .env secure and do not commit it to Git:

- Ensure your .gitignore includes:
```bash
.env
```

## 🤝 Contributing
Contributions are welcome! Please open issues and pull requests to help improve Learnity.

## 📜 License
This project is open-source and available under the MIT License.
