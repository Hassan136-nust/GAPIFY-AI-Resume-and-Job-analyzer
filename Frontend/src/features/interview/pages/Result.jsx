import { useState, useContext } from "react"
import axios from "axios"
import "../result.scss"
import { FiCheckCircle, FiAlertCircle, FiMap, FiChevronDown, FiChevronUp, FiDownload } from "react-icons/fi"
import { InterviewContext } from "../interview.context"
import { useNavigate } from "react-router"
import Navbar from "../../../components/Navbar"
import { API_ENDPOINTS } from "../../../config/api"

const Result = () => {
    const [activeSection, setActiveSection] = useState("technical");
    const [expandedQuestion, setExpandedQuestion] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const { reportData, interviewId } = useContext(InterviewContext);
    const navigate = useNavigate();

    // Debug: Log interviewId
    console.log("Result page - Interview ID:", interviewId);
    console.log("Result page - Report Data:", reportData ? "exists" : "null");

    // If no report data, redirect to home
    if (!reportData) {
        return (
            <>
                <Navbar />
                <div className="result-page">
                    <div className="result-container">
                        <div className="loading-state">
                            <h2>No Report Data</h2>
                            <p>Please generate a report first.</p>
                            <button className="button primary-button" onClick={() => navigate("/")}>
                                Go to Home
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    const handleDownloadResume = async () => {
        if (!interviewId) {
            alert("Interview ID not found. Please generate a new report.");
            return;
        }

        setDownloading(true);
        try {
            console.log("Downloading resume for interview ID:", interviewId);
            
            const response = await axios.get(
                API_ENDPOINTS.INTERVIEW.DOWNLOAD_RESUME(interviewId),
                {
                    withCredentials: true,
                    responseType: 'blob' // Important for binary data
                }
            );

            console.log("Response received, blob size:", response.data.size, "bytes");
            const contentType = response.headers?.["content-type"] || "";
            const isHtmlFallback = contentType.includes("text/html") || response.headers?.["x-resume-fallback"] === "html";
            const fileName = isHtmlFallback ? "optimized-resume.html" : "optimized-resume.pdf";
            
            // Create download link
            const url = window.URL.createObjectURL(response.data);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            if (isHtmlFallback) {
                alert("PDF engine is unavailable on server right now. Downloaded HTML resume instead.");
            }
            console.log("Download completed successfully");
        } catch (err) {
            console.error("Download error:", err);
            const errorMessage = err.response?.data?.message || err.message || "Failed to download resume";
            alert(`Failed to download resume: ${errorMessage}`);
        } finally {
            setDownloading(false);
        }
    };

    const toggleQuestion = (index) => {
        setExpandedQuestion(expandedQuestion === index ? null : index);
    };

    const renderContent = () => {
        switch (activeSection) {
            case "technical":
                return (
                    <div className="content-section">
                        <h2>Technical Questions</h2>
                        <div className="questions-list">
                            {reportData.technicalQuestions && reportData.technicalQuestions.length > 0 ? (
                                reportData.technicalQuestions.map((item, index) => (
                                    <div key={index} className="question-item">
                                        <div className="question-header" onClick={() => toggleQuestion(index)}>
                                            <div className="question-main">
                                                <span className="question-number">{index + 1}</span>
                                                <p>{item.question}</p>
                                            </div>
                                            <button className="expand-btn">
                                                {expandedQuestion === index ? <FiChevronUp /> : <FiChevronDown />}
                                            </button>
                                        </div>
                                        {expandedQuestion === index && (
                                            <div className="question-details">
                                                <div className="detail-block">
                                                    <h4>Intention</h4>
                                                    <p>{item.intention}</p>
                                                </div>
                                                <div className="detail-block">
                                                    <h4>Answer</h4>
                                                    <p>{item.answer}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p style={{color: '#999'}}>No technical questions available</p>
                            )}
                        </div>
                    </div>
                );
            case "behavioral":
                return (
                    <div className="content-section">
                        <h2>Behavioral Questions</h2>
                        <div className="questions-list">
                            {reportData.behaviouralQuestion && reportData.behaviouralQuestion.length > 0 ? (
                                reportData.behaviouralQuestion.map((item, index) => (
                                    <div key={index} className="question-item">
                                        <div className="question-header" onClick={() => toggleQuestion(index)}>
                                            <div className="question-main">
                                                <span className="question-number">{index + 1}</span>
                                                <p>{item.question}</p>
                                            </div>
                                            <button className="expand-btn">
                                                {expandedQuestion === index ? <FiChevronUp /> : <FiChevronDown />}
                                            </button>
                                        </div>
                                        {expandedQuestion === index && (
                                            <div className="question-details">
                                                <div className="detail-block">
                                                    <h4>Intention</h4>
                                                    <p>{item.intention}</p>
                                                </div>
                                                <div className="detail-block">
                                                    <h4>Answer</h4>
                                                    <p>{item.answer}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p style={{color: '#999'}}>No behavioral questions available</p>
                            )}
                        </div>
                    </div>
                );
            case "roadmap":
                return (
                    <div className="content-section">
                        <h2>5-Day Preparation Roadmap</h2>
                        <div className="roadmap-list">
                            {reportData.preparationPlan.map((plan, index) => (
                                <div key={index} className="roadmap-item">
                                    <div className="roadmap-header">
                                        <h3>{plan.day}</h3>
                                        <span className="focus-badge">{plan.focus}</span>
                                    </div>
                                    <div className="roadmap-tasks">
                                        {plan.tasks.map((task, taskIndex) => (
                                            <p key={taskIndex}>• {task}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Navbar />
            <div className="result-page">
            <div className="result-container">
                {/* Sidebar */}
                <div className="sidebar">
                    <div className="match-score">
                        <div className="score-circle">
                            <span className="score-value">{reportData.matchScore}</span>
                            <span className="score-label">Match</span>
                        </div>
                    </div>

                    <button 
                        className="download-resume-btn"
                        onClick={handleDownloadResume}
                        disabled={downloading}
                    >
                       <FiDownload />
{downloading ? "Generating..." : "Download Optimized Resume"}
<small style={{ fontSize: '10px', display: 'block', opacity: 0.7 }}>
  (Beta - may not fully optimize)
</small>
                    </button>

                    <nav className="sidebar-nav">
                        <button
                            className={`nav-item ${activeSection === "technical" ? "active" : ""}`}
                            onClick={() => setActiveSection("technical")}
                        >
                            <FiCheckCircle />
                            Technical Questions
                        </button>
                        <button
                            className={`nav-item ${activeSection === "behavioral" ? "active" : ""}`}
                            onClick={() => setActiveSection("behavioral")}
                        >
                            <FiAlertCircle />
                            Behavioral Questions
                        </button>
                        <button
                            className={`nav-item ${activeSection === "roadmap" ? "active" : ""}`}
                            onClick={() => setActiveSection("roadmap")}
                        >
                            <FiMap />
                            Road Map
                        </button>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="main-content">
                    {renderContent()}
                </div>

                {/* Skill Gaps Sidebar */}
                <div className="skill-gaps-sidebar">
                    <h3>Skill Gaps</h3>
                    <div className="skill-gaps-list">
                        {reportData.skillGaps && reportData.skillGaps.length > 0 ? (
                            reportData.skillGaps.map((skillGap, index) => (
                                <div key={index} className="skill-gap-item">
                                    <span className="skill-name">{skillGap.skill}</span>
                                    <span className={`severity-badge ${skillGap.severity}`}>
                                        {skillGap.severity}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p style={{color: '#999'}}>No skill gaps identified</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Result;
