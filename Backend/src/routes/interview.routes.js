const interviewController = require("../controllers/interview.controller")
const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware")
const interviewRouter = express.Router();

const upload = require("../middlewares/file.middleware")

interviewRouter.post( "/",authMiddleware.authUser,upload.single("resume"),interviewController.generateInterviewReportController)


interviewRouter.get( "/report/:interviewId",authMiddleware.authUser,interviewController.generateInterviewReportByIdController)

interviewRouter.get( "/",authMiddleware.authUser,interviewController.getAllInterviewReportsController)

interviewRouter.get( "/resume/:interviewId",authMiddleware.authUser,interviewController.generateResumePdfController)

module.exports= interviewRouter