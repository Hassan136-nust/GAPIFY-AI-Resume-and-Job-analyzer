const express = require("express") 
const cookieParser = require("cookie-parser")
const app = express();

const cors = require("cors");

// CORS configuration for production
const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:5173"
];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
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