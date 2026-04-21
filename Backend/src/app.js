const express = require("express") 
const cookieParser = require("cookie-parser")
const app = express();

const cors = require("cors");

// CORS configuration for production
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow localhost for development
        if (origin.includes('localhost')) {
            return callback(null, true);
        }
        
        // Allow Vercel deployments
        if (origin.includes('vercel.app')) {
            return callback(null, true);
        }
        
        // Allow specific frontend URL from environment
        if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
            return callback(null, true);
        }
        
        // Reject other origins
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser())
const  authRouter = require ("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

app.use("/api/auth", authRouter)
app.use("/api/interview",interviewRouter)

// Health check endpoint
app.get("/", (req, res) => {
    res.json({ message: "ResumeAI API is running" });
});

module.exports = app;