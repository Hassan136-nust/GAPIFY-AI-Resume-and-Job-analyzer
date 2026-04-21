import { useState, useContext, useEffect } from "react"
import "../interview.form.scss"
import { generateInterviewReport } from "../services/interview.api"
import { FiUpload, FiUser, FiBriefcase, FiFileText, FiClock, FiTrendingUp } from "react-icons/fi"
import { useNavigate } from "react-router"
import { InterviewContext } from "../interview.context"
import Navbar from "../../../components/Navbar"
import Loader from "../../../components/Loader"
import axios from "axios"
import { API_ENDPOINTS } from "../../../config/api"

const Home = () => {
    const [resume, setResume] = useState(null);
    const [selfDescription, setSelfDescription] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState("");
    const [pastReports, setPastReports] = useState([]);
    const [loadingReports, setLoadingReports] = useState(true);
    const navigate = useNavigate();
    const { setReportData, setInterviewId } = useContext(InterviewContext);

    // Fetch past reports on component mount
    useEffect(() => {
        fetchPastReports();
    }, []);

    const fetchPastReports = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.INTERVIEW.GET_ALL, {
                withCredentials: true
            });
            setPastReports(response.data.interviewReports || []);
        } catch (err) {
            console.error("Failed to fetch past reports:", err);
        } finally {
            setLoadingReports(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setResume(file);
            setFileName(file.name);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!resume || !selfDescription || !jobDescription) {
            alert("Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            const result = await generateInterviewReport({
                resume,
                selfDescription,
                jobDescription
            });
            console.log("Report generated:", result);
            // Store the report data and ID in context
            setReportData(result.interviewReport);
            setInterviewId(result.interviewReport._id);
            // Navigate to result page
            navigate("/result");
        } catch (err) {
            console.error(err);
            alert("Failed to generate report");
        } finally {
            setLoading(false);
        }
    }

    const handleViewReport = async (reportId) => {
        try {
            const response = await axios.get(API_ENDPOINTS.INTERVIEW.GET_BY_ID(reportId), {
                withCredentials: true
            });
            setReportData(response.data.interviewReport);
            setInterviewId(reportId);
            navigate("/result");
        } catch (err) {
            console.error("Failed to load report:", err);
            alert("Failed to load report");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="interview-page">
                    <div className="interview-container">
                        <Loader message="Analyzing Your Profile..." />
                        <p style={{textAlign: 'center', color: '#999', marginTop: '1rem'}}>
                            Our AI is generating your personalized report. This may take a moment.
                        </p>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <Navbar />
            <div className="interview-page">
                <div className="interview-container">
                    <div className="page-header">
                        <h1>AI Resume & Gap Analyzer</h1>
                        <p>Upload your resume and let AI analyze your career profile</p>
                    </div>

                    {/* Upload Form Section - Primary */}
                    <div className="interview-form-wrapper">
                        <form className="interview-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        {/* Left Side - Resume Upload */}
                        <div className="form-section upload-section">
                            <h3 className="section-title">
                                <FiFileText /> Upload Resume
                            </h3>
                            <label 
                                className={`file-upload-area ${fileName ? 'has-file' : ''}`}
                                htmlFor="resume-upload"
                            >
                                <FiUpload className="upload-icon" />
                                {!fileName ? (
                                    <>
                                        <p className="upload-text">
                                            <strong>Click to upload</strong> or drag and drop
                                        </p>
                                        <p className="file-info">PDF (Max 3MB)</p>
                                    </>
                                ) : (
                                   <p className="file-name">✓ {fileName}</p>

                                )}
                                <input 
                                    type="file" 
                                    id="resume-upload"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>

                        {/* Right Side - Descriptions */}
                        <div className="form-section descriptions-section">
                            <div className="description-group">
                                <h3 className="section-title">
                                    <FiUser /> About You
                                </h3>
                                <div className="input-group">
                                    <label htmlFor="selfDescription">Tell us about yourself</label>
                                    <textarea
                                        id="selfDescription"
                                        name="selfDescription"
                                        placeholder="Describe your skills, experience, and career goals..."
                                        value={selfDescription}
                                        onChange={(e) => setSelfDescription(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="description-group">
                                <h3 className="section-title">
                                    <FiBriefcase /> Target Job
                                </h3>
                                <div className="input-group">
                                    <label htmlFor="jobDescription">Job description or role you're targeting</label>
                                    <textarea
                                        id="jobDescription"
                                        name="jobDescription"
                                        placeholder="Paste the job description or describe your target role..."
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="button primary-button submit-button">
                        Generate Analysis Report
                    </button>
                        </form>
                    </div>

                    {/* Past Reports Section - Below Form */}
                    {!loadingReports && pastReports.length > 0 && (
                        <div className="past-reports-section">
                            <h2 className="section-heading">
                                <FiClock /> Your Past Reports
                            </h2>
                            <div className="reports-grid">
                                {pastReports.map((report) => (
                                    <div 
                                        key={report._id} 
                                        className="report-card"
                                        onClick={() => handleViewReport(report._id)}
                                    >
                                        <div className="report-header">
                                            <h3>{report.title || "Interview Report"}</h3>
                                            <span className="report-score">
                                                <FiTrendingUp />
                                                {report.matchScore}%
                                            </span>
                                        </div>
                                        <div className="report-date">
                                            {formatDate(report.createdAt)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Home
