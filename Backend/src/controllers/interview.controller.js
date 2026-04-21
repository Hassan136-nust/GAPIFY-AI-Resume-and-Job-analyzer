const pdfParse = require("pdf-parse")
const puppeteer = require("puppeteer")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.services")
const interviewReportModel = require("../models/interviewReport.model")
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
        const htmlContent = await generateResumePdf(
            interviewReport.resume,
            interviewReport.selfDescription,
            interviewReport.jobDescription
        );

        console.log("HTML generated, length:", htmlContent.length);
        console.log("Launching Puppeteer...");

        // Launch Puppeteer and convert HTML to PDF
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        
        console.log("Setting page content...");
        // Set content and wait for it to load
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0'
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
        res.status(500).json({
            message: "Failed to generate resume PDF",
            error: err.message
        });
    }
}

module.exports={
    generateInterviewReportController,
    generateInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
};