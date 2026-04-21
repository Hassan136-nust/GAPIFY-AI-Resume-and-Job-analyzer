// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gapify-ai-resume-and-job-analyzer.onrender.com';

export const API_ENDPOINTS = {
    AUTH: {
        REGISTER: `${API_BASE_URL}/api/auth/register`,
        LOGIN: `${API_BASE_URL}/api/auth/login`,
        LOGOUT: `${API_BASE_URL}/api/auth/logout`,
        GET_ME: `${API_BASE_URL}/api/auth/getme`,
    },
    INTERVIEW: {
        CREATE: `${API_BASE_URL}/api/interview`,
        GET_ALL: `${API_BASE_URL}/api/interview`,
        GET_BY_ID: (id) => `${API_BASE_URL}/api/interview/report/${id}`,
        DOWNLOAD_RESUME: (id) => `${API_BASE_URL}/api/interview/resume/${id}`,
    }
};
