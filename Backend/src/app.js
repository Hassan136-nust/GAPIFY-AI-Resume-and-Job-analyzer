const express = require("express") 
const cookieParser = require("cookie-parser")
const app = express();

const cors = require("cors");

// CORS configuration for production
// Enable preflight requests for all routes
app.options('*', cors()); // or app.options('*', cors(corsOptions))

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