# ResumeAI - AI-Powered Resume & Interview Analyzer

A full-stack application that uses AI to analyze resumes, generate interview questions, identify skill gaps, and create optimized resumes tailored to job descriptions.

## Features

- 🤖 **AI-Powered Analysis** - Uses Groq AI to analyze resumes and job descriptions
- 📝 **Interview Preparation** - Generates technical and behavioral interview questions
- 🎯 **Skill Gap Analysis** - Identifies missing skills and provides severity ratings
- 📅 **5-Day Preparation Plan** - Creates a structured roadmap for interview prep
- 📄 **Resume Optimization** - Generates ATS-friendly, professionally formatted resumes
- 📊 **Match Score** - Calculates how well your profile matches the job
- 🔐 **Secure Authentication** - JWT-based auth with cookie sessions
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

### Frontend
- React 18
- React Router
- Axios
- SCSS
- React Icons
- Vite

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- JWT Authentication
- Groq AI SDK
- Puppeteer (PDF generation)
- Multer (file uploads)
- PDF Parse

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or Atlas)
- Groq API key (get from https://console.groq.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Gen-Ai
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   cp .env.example .env
   # Edit .env with your credentials
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd Frontend
   npm install
   cp .env.example .env
   # Edit .env with backend URL
   npm run dev
   ```

4. **Environment Variables**

   Backend `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/resumeai
   JWT_SECRET=your_secret_key
   GROQ_API_KEY=your_groq_api_key
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   ```

   Frontend `.env`:
   ```
   VITE_API_URL=http://localhost:3000
   ```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions for Vercel (frontend) and Render (backend).

## Usage

1. **Register/Login** - Create an account or sign in
2. **Upload Resume** - Upload your PDF resume
3. **Provide Details** - Add self-description and target job description
4. **Generate Report** - AI analyzes and generates comprehensive report
5. **View Results** - See interview questions, skill gaps, and preparation plan
6. **Download Resume** - Get an optimized resume tailored to the job

## Project Structure

```
Gen-Ai/
├── Backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Auth & file upload middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   └── services/       # AI services
│   └── server.js           # Entry point
├── Frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── features/       # Feature modules
│   │   │   ├── auth/       # Authentication
│   │   │   └── interview/  # Interview features
│   │   └── config/         # API configuration
│   └── index.html
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/getme` - Get current user

### Interview Reports
- `POST /api/interview` - Generate new report
- `GET /api/interview` - Get all user reports
- `GET /api/interview/report/:id` - Get specific report
- `GET /api/interview/resume/:id` - Download optimized resume

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Acknowledgments

- Groq AI for the LLM API
- MongoDB for database
- Vercel & Render for hosting
