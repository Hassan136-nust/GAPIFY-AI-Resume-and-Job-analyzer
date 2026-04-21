const Groq = require("groq-sdk");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const puppeteer = require("puppeteer")
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const interviewReportSchema = z.object({
    matchScore: z.number()
        .min(0)
        .max(100)
        .describe("A percentage score (0 to 100) representing how well the candidate matches the job description"),

    technicalQuestions: z.array(
        z.object({
            question: z.string().describe("The technical question that can be asked in the interview"),
            intention: z.string().describe("The intention of the interviewer behind asking this technical question"),
            answer: z.string().describe("How to answer this question, including key points, approach, and concepts to cover")
        })
    ).describe("List of technical interview questions with intentions and ideal answers"),

    behaviouralQuestion: z.array(
        z.object({
            question: z.string().describe("The behavioural question that can be asked in the interview"),
            intention: z.string().describe("The purpose of the interviewer behind asking this behavioural question"),
            answer: z.string().describe("How to answer this using structured approaches like STAR method with key talking points")
        })
    ).describe("List of behavioural interview questions with intentions and suggested answers"),

    skillGaps: z.array(
        z.object({
            skill: z.string().describe("The skill that the candidate is lacking or needs improvement in"),
            severity: z.enum(["low", "medium", "high"]).describe("Severity level of the skill gap based on job requirements")
        })
    ).describe("List of missing or weak skills required for the job"),

    preparationPlan: z.array(
        z.object({
            day: z.string().describe("Day number or label (e.g., Day 1, Day 2)"),
            focus: z.string().describe("Main focus area for that day of preparation"),
            tasks: z.array(z.string().describe("Specific task or activity to complete")).describe("List of tasks to complete on that day")
        })
    ).describe("A structured multi-day preparation plan to improve interview readiness"),

    title: z.string().describe("The title of job for which interview report is generated"),
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `
You are an expert technical interviewer and career coach.

Analyze the candidate based on the following:

RESUME:
${resume}

SELF DESCRIPTION:
${selfDescription}

JOB DESCRIPTION:
${jobDescription}

Your task is to generate a structured interview preparation report.

CRITICAL FORMATTING RULES - YOU MUST FOLLOW EXACTLY:
- Return ONLY valid JSON object (no explanations, no text outside JSON, no markdown backticks)
- Every object in "technicalQuestions" MUST have exactly these three keys: "question", "intention", "answer"
- Every object in "behaviouralQuestion" MUST have exactly these three keys: "question", "intention", "answer"
- Every object in "skillGaps" MUST have exactly these two keys: "skill", "severity"
- Every object in "preparationPlan" MUST have exactly these three keys: "day", "focus", "tasks"
- DO NOT use alternative key names like "suggestedAnswer", "idealAnswer", "focusArea", "topic" etc.
- The key for the answer MUST be "answer" — not any other word
- The key for the preparation topic MUST be "focus" — not any other word

EXAMPLE OF CORRECT FORMAT:
{
  "title": "Full Stack Developer",
  "matchScore": 85,
  "technicalQuestions": [
    {
      "question": "What is the difference between let and var?",
      "intention": "To test JavaScript fundamentals",
      "answer": "let is block-scoped while var is function-scoped. let was introduced in ES6 and does not get hoisted to the top of its scope like var does."
    }
  ],
  "behaviouralQuestion": [
    {
      "question": "Tell me about a time you faced a challenge",
      "intention": "To assess problem-solving skills",
      "answer": "Using STAR method: Situation - describe the context, Task - explain your responsibility, Action - detail steps taken, Result - share the outcome."
    }
  ],
  "skillGaps": [
    {
      "skill": "Docker",
      "severity": "medium"
    }
  ],
  "preparationPlan": [
    {
      "day": "Day 1",
      "focus": "Core JavaScript Concepts",
      "tasks": ["Review closures and scope", "Practice async/await patterns", "Solve 3 LeetCode problems"]
    }
  ]
}

REQUIREMENTS:
1. title: Extract the job title from the job description
2. matchScore: A number between 0 and 100
3. technicalQuestions: Generate EXACTLY 5 questions — each MUST have "question", "intention", "answer" keys
4. behaviouralQuestion: Generate EXACTLY 3 questions — each MUST have "question", "intention", "answer" keys
5. skillGaps: Identify 3-5 missing skills — each MUST have "skill", "severity" keys
6. preparationPlan: Create a 5-day plan — each MUST have "day", "focus", "tasks" keys

Return ONLY JSON. No other text.
`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 1,
            max_completion_tokens: 4096,
            top_p: 1,
            stream: false,
            stop: null
        });

        const rawText = chatCompletion.choices[0]?.message?.content || "";

        // Log finish reason to diagnose truncation
        const finishReason = chatCompletion.choices[0]?.finish_reason;
        console.log("Finish reason:", finishReason);
        if (finishReason === "length") {
            console.error("Response was truncated — increase max_completion_tokens further");
            throw new Error("AI response was cut off. Please try again.");
        }

        // Strip markdown code fences
        const cleaned = rawText
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/```\s*$/i, "")
            .trim();

        const rawResult = JSON.parse(cleaned);
        // Debug: log actual keys returned by the model
        if (rawResult.technicalQuestions?.[0]) {
            console.log("TQ keys from model:", Object.keys(rawResult.technicalQuestions[0]));
        }
        if (rawResult.behaviouralQuestion?.[0]) {
            console.log("BQ keys from model:", Object.keys(rawResult.behaviouralQuestion[0]));
        }
        if (rawResult.preparationPlan?.[0]) {
            console.log("Plan keys from model:", Object.keys(rawResult.preparationPlan[0]));
        }

        console.log("Raw AI Response:", JSON.stringify(rawResult, null, 2));

        // Helper: safely get a string value by trying multiple possible key names
        const getStr = (obj, ...keys) => {
            for (const key of keys) {
                if (obj[key] && typeof obj[key] === "string" && obj[key].trim() !== "") {
                    return obj[key].trim();
                }
            }
            return "";
        };

        // Build result with defensive key mapping
        const result = {
            title: rawResult.title || "",
            matchScore: typeof rawResult.matchScore === "number" ? rawResult.matchScore : 0,
            technicalQuestions: [],
            behaviouralQuestion: [],
            skillGaps: [],
            preparationPlan: []
        };

        // --- technicalQuestions ---
        if (Array.isArray(rawResult.technicalQuestions)) {
            result.technicalQuestions = rawResult.technicalQuestions
                .filter(q => q && typeof q === "object")
                .map(q => ({
                    question: getStr(q, "question", "Question"),
                    intention: getStr(q, "intention", "Intention", "purpose", "Purpose"),
                    answer: getStr(q, "answer", "Answer", "suggestedAnswer", "idealAnswer",
                        "solution", "explanation", "howToAnswer", "guidance",
                        "response", "idealResponse", "sampleAnswer", "model_answer")
                }))
                .filter(q => q.question !== "" && q.answer !== "");
        }

        // --- behaviouralQuestion ---
        if (Array.isArray(rawResult.behaviouralQuestion)) {
            result.behaviouralQuestion = rawResult.behaviouralQuestion
                .filter(q => q && typeof q === "object")
                .map(q => ({
                    question: getStr(q, "question", "Question"),
                    intention: getStr(q, "intention", "Intention", "purpose", "Purpose"),
                    answer: getStr(q, "answer", "Answer", "suggestedAnswer", "idealAnswer",
                        "solution", "explanation", "howToAnswer", "guidance",
                        "response", "idealResponse", "sampleAnswer", "model_answer")
                }))
                .filter(q => q.question !== "" && q.answer !== "");
        }

        // --- skillGaps ---
        if (Array.isArray(rawResult.skillGaps)) {
            result.skillGaps = rawResult.skillGaps
                .filter(s => s && typeof s === "object")
                .map(s => ({
                    skill: getStr(s, "skill", "Skill", "name", "skillName"),
                    severity: getStr(s, "severity", "Severity", "level", "priority") || "medium"
                }))
                .map(s => ({
                    ...s,
                    severity: ["low", "medium", "high"].includes(s.severity) ? s.severity : "medium"
                }))
                .filter(s => s.skill !== "");
        }

        // --- preparationPlan ---
        if (Array.isArray(rawResult.preparationPlan)) {
            result.preparationPlan = rawResult.preparationPlan
                .filter(p => p && typeof p === "object")
                .map(p => ({
                    day: getStr(p, "day", "Day", "dayLabel", "dayNumber"),
                    focus: getStr(p, "focus", "Focus", "focusArea", "topic",
                        "theme", "subject", "mainFocus", "area"),
                    tasks: Array.isArray(p.tasks)
                        ? p.tasks.filter(t => typeof t === "string" && t.trim() !== "")
                        : (typeof p.tasks === "string" && p.tasks.trim() !== "" ? [p.tasks] : [])
                }))
                .filter(p => p.day !== "" && p.focus !== "");
        }

        // Warn if counts are lower than expected
        if (result.technicalQuestions.length < 5) {
            console.warn(`Only got ${result.technicalQuestions.length} valid technical questions (expected 5)`);
        }
        if (result.behaviouralQuestion.length < 3) {
            console.warn(`Only got ${result.behaviouralQuestion.length} valid behavioural questions (expected 3)`);
        }
        if (result.preparationPlan.length < 5) {
            console.warn(`Only got ${result.preparationPlan.length} valid preparation days (expected 5)`);
        }

        console.log("Final Transformed Result:", JSON.stringify(result, null, 2));
        return result;

    } catch (err) {
        console.error("AI Service Error:", err);
        throw err;
    }
}


async function generateResumePdf(resume, selfDescription, jobDescription) {

    // Truncate inputs to fit within token limits
    const maxResumeLength = 1200;
    const maxJobDescLength = 400;
    const maxSelfDescLength = 200;
    
    const truncatedResume = resume.length > maxResumeLength 
        ? resume.substring(0, maxResumeLength) + "..." 
        : resume;
    const truncatedJob = jobDescription.length > maxJobDescLength
        ? jobDescription.substring(0, maxJobDescLength) + "..."
        : jobDescription;
    const truncatedSelf = selfDescription.length > maxSelfDescLength
        ? selfDescription.substring(0, maxSelfDescLength) + "..."
        : selfDescription;

    const prompt = `Create a professional one-page HTML resume. MUST extract 3 projects from resume and ADD ALL skills from job description.

RESUME: ${truncatedResume}
SELF: ${truncatedSelf}
JOB: ${truncatedJob}

Return JSON: {"html":"<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Calibri','Arial',sans-serif;font-size:10pt;line-height:1.3;color:#000;background:#fff;padding:30px}@page{size:A4;margin:0}.header{text-align:center;margin-bottom:15px;border-bottom:2px solid #1a1a1a;padding-bottom:10px}.header h1{font-size:20pt;font-weight:700;color:#1a1a1a;margin-bottom:4px;letter-spacing:0.5px}.contact{font-size:9pt;color:#333}.contact span{margin:0 8px}.section{margin-bottom:12px}.section-title{font-size:11pt;font-weight:700;color:#1a1a1a;text-transform:uppercase;border-bottom:1.5px solid #1a1a1a;padding-bottom:2px;margin-bottom:6px;letter-spacing:0.5px}.summary{font-size:9.5pt;line-height:1.4;text-align:justify;margin-bottom:8px}.skills-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-bottom:8px}.skill-item{font-size:9pt}.skill-item strong{color:#1a1a1a;font-weight:600}.project,.edu{margin-bottom:8px}.proj-header{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:3px}.proj-title{font-weight:700;font-size:10pt;color:#1a1a1a}.proj-sub{font-style:italic;font-size:9pt;color:#444}.proj-date{font-size:9pt;color:#555}.proj-desc ul{margin-left:18px;margin-top:2px}.proj-desc li{font-size:9pt;margin-bottom:2px;line-height:1.3}.tech{font-size:8.5pt;color:#555;font-style:italic;margin-top:3px}</style></head><body><div class='header'><h1>CANDIDATE NAME</h1><div class='contact'><span>email@example.com</span><span>+1234567890</span><span>linkedin.com/in/profile</span><span>github.com/username</span></div></div><div class='section'><div class='section-title'>Professional Summary</div><p class='summary'>2-3 concise lines highlighting experience and skills matching the job</p></div><div class='section'><div class='section-title'>Technical Skills</div><div class='skills-grid'><div class='skill-item'><strong>Languages:</strong> List</div><div class='skill-item'><strong>Frameworks:</strong> List</div><div class='skill-item'><strong>Tools:</strong> List</div><div class='skill-item'><strong>Databases:</strong> List</div></div></div><div class='section'><div class='section-title'>Projects</div><div class='project'><div class='proj-header'><div><div class='proj-title'>Project Name</div><div class='proj-sub'>Brief description</div></div><div class='proj-date'>Date</div></div><div class='proj-desc'><ul><li>Achievement with metrics (increased X by Y%)</li><li>Technical detail</li><li>Impact/result</li></ul><div class='tech'>Tech: Technologies used</div></div></div></div><div class='section'><div class='section-title'>Education</div><div class='edu'><div class='proj-header'><div><div class='proj-title'>Degree in Major</div><div class='proj-sub'>University Name</div></div><div class='proj-date'>Grad Date</div></div></div></div></body></html>"}

CRITICAL REQUIREMENTS:
1. EXTRACT EXACTLY 3 PROJECTS from the candidate's resume - use their actual project names and details
2. MUST ADD ALL SKILLS mentioned in job description to Technical Skills section
3. Combine candidate's existing skills + job description skills in appropriate categories
4. ONE PAGE ONLY - tight spacing, no extra line breaks
5. Use metrics in bullets (%, numbers, time saved)
6. Extract ALL contact info from resume (email, phone, LinkedIn, GitHub)
7. Professional Calibri 10pt font
8. Keep each project to 3 bullet points max
9. Return ONLY valid JSON with "html" field

SKILLS INSTRUCTION:
- Read job description carefully
- Extract ALL technical skills, tools, frameworks, languages mentioned
- Add them to the appropriate skill category (Languages/Frameworks/Tools/Databases)
- Merge with candidate's existing skills
- Example: If job mentions "React, Node.js, Docker, AWS" - ALL must appear in skills section`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.1-8b-instant",
            temperature: 0.6,
            max_completion_tokens: 3000,
            top_p: 1,
            stream: false,
            stop: null
        });

        const finishReason = chatCompletion.choices[0]?.finish_reason;
        console.log("Finish reason:", finishReason);

        const rawText = chatCompletion.choices[0]?.message?.content || "";
        console.log("Raw AI Response (first 300 chars):", rawText.substring(0, 300));

        let cleaned = rawText
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/```\s*$/i, "")
            .trim()
            .replace(/[\x00-\x1F\x7F-\x9F]/g, '');

        let rawResult;
        try {
            rawResult = JSON.parse(cleaned);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                rawResult = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("Could not parse AI response as JSON");
            }
        }

        if (!rawResult.html || typeof rawResult.html !== "string" || rawResult.html.trim() === "") {
            throw new Error("AI did not return valid html");
        }

        console.log("HTML resume generated, length:", rawResult.html.length);
        return rawResult.html;

    } catch (err) {
        console.error("Resume PDF Generation Error:", err);
        throw err;
    }
}




module.exports = { generateInterviewReport, generateResumePdf };