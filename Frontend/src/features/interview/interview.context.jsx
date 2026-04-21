import { createContext, useState, useEffect } from "react";

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
    const [reportData, setReportData] = useState(() => {
        // Initialize from sessionStorage if available
        const saved = sessionStorage.getItem('interviewReport');
        return saved ? JSON.parse(saved) : null;
    });

    const [interviewId, setInterviewId] = useState(() => {
        // Initialize from sessionStorage if available
        return sessionStorage.getItem('interviewId') || null;
    });

    // Save to sessionStorage whenever reportData changes
    useEffect(() => {
        if (reportData) {
            sessionStorage.setItem('interviewReport', JSON.stringify(reportData));
        } else {
            sessionStorage.removeItem('interviewReport');
        }
    }, [reportData]);

    // Save to sessionStorage whenever interviewId changes
    useEffect(() => {
        if (interviewId) {
            sessionStorage.setItem('interviewId', interviewId);
        } else {
            sessionStorage.removeItem('interviewId');
        }
    }, [interviewId]);

    return (
        <InterviewContext.Provider value={{ reportData, setReportData, interviewId, setInterviewId }}>
            {children}
        </InterviewContext.Provider>
    );
};
