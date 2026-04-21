const pdfParse = require("pdf-parse")
const puppeteer = require("puppeteer")
const fs = require("fs")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.services")
const interviewReportModel = require("../models/interviewReport.model")

function escapeHtml(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function buildBasicResumeHtml(interviewReport) {
    const safeTitle = escapeHtml(interviewReport.title || "Optimized Resume");
    const safeSummary = escapeHtml(interviewReport.selfDescription || "No summary provided.");
    const safeSkills = (interviewReport.skillGaps || [])
        .map((item) => `<li>${escapeHtml(item.skill)} (${escapeHtml(item.severity)})</li>`)
        .join("") || "<li>No skill insights available</li>";

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${safeTitle}</title>
  <style>
    body{font-family:Arial,sans-serif;margin:32px;line-height:1.5;color:#111}
    h1,h2{margin:0 0 12px}
    section{margin-top:20px}
    ul{padding-left:20px}
    .muted{color:#555}
  </style>
</head>
<body>
  <h1>${safeTitle}</h1>
  <p class="muted">Generated fallback resume format</p>
  <section>
    <h2>Professional Summary</h2>
    <p>${safeSummary}</p>
  </section>
  <section>
    <h2>Job Target</h2>
    <p>${escapeHtml(interviewReport.jobDescription || "Not provided")}</p>
  </section>
  <section>
    <h2>Skills To Improve</h2>
    <ul>${safeSkills}</ul>
  </section>
</body>
</html>`;
}
async function generateInterviewReportController(req,res){
    try {
        const resumeFile = req.file;
        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
        const {selfDescription , jobDescription} = req.body

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        })

        console.log("AI Report Data:", JSON.stringify(interviewReportByAi, null, 2));

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume:resumeContent.text,
            selfDescription,
            jobDescription,
            ...interviewReportByAi,
        })
        
        res.status(201).json({
            message:"Report Generated",
            interviewReport
        })
    } catch (err) {
        console.error("Controller Error:", err);
        res.status(500).json({
            message: "Failed to generate report",
            error: err.message
        })
    }
}

async function generateInterviewReportByIdController(req,res){
    const {interviewId}= req.params
    const interviewReport = await interviewReportModel.findOne({_id:interviewId, user:req.user.id})
    if(!interviewReport){
        return res.status(400).json({
            message:"Interview report not found"
        })
    }
    res.status(200).json({
        message:"Report fetched Successfully",
        interviewReport
    })
}


async function getAllInterviewReportsController(req,res){
    const interviewReports = await interviewReportModel.find({
        user: req.user.id
    }).sort({createdAt:-1}).select("-resume -selfDescription -jobDescription -___v -technicalQuestions -behaviouralQuestions -skillGaps -preparationPlan")
    res.status(200).json({
        message:"Report Fetched",
        interviewReports
    })
}


async function generateResumePdfController(req, res) {
    let browser;
    let htmlContent = "";
    try {
        const { interviewId } = req.params;
        console.log("=== Resume PDF Generation Started ===");
        console.log("Interview ID:", interviewId);
        console.log("User ID:", req.user.id);
        
        // Fetch the interview report
        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        });

        if (!interviewReport) {
            console.error("Interview report not found");
            return res.status(404).json({
                message: "Interview report not found"
            });
        }

        console.log("Interview report found, generating HTML...");

        // Generate HTML using AI
        try {
            htmlContent = await generateResumePdf(
                interviewReport.resume,
                interviewReport.selfDescription,
                interviewReport.jobDescription
            );
        } catch (aiErr) {
            console.error("AI HTML generation failed, using fallback HTML:", aiErr.message);
            htmlContent = buildBasicResumeHtml(interviewReport);
        }

        console.log("HTML generated, length:", htmlContent.length);
        console.log("Launching Puppeteer...");

        const configuredExecutablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
        const hasValidConfiguredPath = configuredExecutablePath && fs.existsSync(configuredExecutablePath);
        const launchOptions = {
            headless: true,
            protocolTimeout: 120000,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--single-process',
                '--no-zygote'
            ]
        };

        if (hasValidConfiguredPath) {
            launchOptions.executablePath = configuredExecutablePath;
        } else if (configuredExecutablePath) {
            console.warn(`Ignoring invalid PUPPETEER_EXECUTABLE_PATH: ${configuredExecutablePath}`);
        }

        // Launch Puppeteer and convert HTML to PDF
        try {
            browser = await puppeteer.launch(launchOptions);
        } catch (launchErr) {
            const canRetryWithoutPath = launchOptions.executablePath && /executablePath|Browser was not found/i.test(launchErr.message || "");
            if (!canRetryWithoutPath) {
                throw launchErr;
            }

            console.warn("Retrying Puppeteer launch without configured executablePath...");
            delete launchOptions.executablePath;
            browser = await puppeteer.launch(launchOptions);
        }

        const page = await browser.newPage();
        page.setDefaultTimeout(120000);
        
        console.log("Setting page content...");
        // Set content and wait for it to load
        await page.setContent(htmlContent, {
            waitUntil: 'domcontentloaded'
        });

        console.log("Generating PDF...");
        // Generate PDF with A4 size, single page optimized
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '0.5in',
                right: '0.5in',
                bottom: '0.5in',
                left: '0.5in'
            },
            preferCSSPageSize: true
        });

        await browser.close();
        browser = null;
        console.log("PDF generated successfully, size:", pdfBuffer.length, "bytes");

        // Send PDF as download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="optimized-resume.pdf"');
        res.send(pdfBuffer);
        
        console.log("=== Resume PDF Generation Completed ===");

    } catch (err) {
        console.error("=== Resume PDF Generation Error ===");
        console.error("Error:", err);
        console.error("Stack:", err.stack);
        const isPdfEngineFailure = /browser|chromium|executable|sandbox|target closed|protocol|timeout/i.test(err.message || "");

        if (isPdfEngineFailure && htmlContent) {
            console.log("Returning HTML fallback instead of 500");
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.setHeader("Content-Disposition", 'attachment; filename="optimized-resume.html"');
            res.setHeader("X-Resume-Fallback", "html");
            return res.status(200).send(htmlContent);
        }

        res.status(500).json({
            message: "Failed to generate resume PDF",
            error: err.message
        });
    } finally {
        if (browser) {
            try {
                await browser.close();
            } catch (closeErr) {
                console.error("Failed to close browser cleanly:", closeErr.message);
            }
        }
    }
}

module.exports={
    generateInterviewReportController,
    generateInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
};