const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// CORS configuration (removed the problematic app.options line)
app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        
        // Allow localhost for development (more specific pattern)
        if (origin.match(/^https?:\/\/localhost:\d+$/)) {
            return callback(null, true);
        }
        
        // Allow Vercel deployments
        if (origin.match(/^https:\/\/.*\.vercel\.app$/)) {
            return callback(null, true);
        }
        
        // Allow specific frontend URL from environment
        if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
            return callback(null, true);
        }
        
        console.log(`CORS blocked: ${origin}`);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Other middleware
app.use(express.json());
app.use(cookieParser());

// Routes
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

// Health check endpoint
app.get("/", (req, res) => {
    res.json({ message: "ResumeAI API is running" });
});

// 404 handler for routes that don't exist
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
});

module.exports = app;