// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3300';

// API Endpoints
export const API_ENDPOINTS = {
    // Authentication
    LOGIN: `${API_BASE_URL}/apis/v1/user/login`,
    SIGNUP: `${API_BASE_URL}/apis/v1/user/signup`,
    GOOGLE_AUTH: `${API_BASE_URL}/auth/google/callback`,

    // User
    BLOGS: `${API_BASE_URL}/apis/v1/user/blogs`,
    BLOG_COMMENT: (blogId) => `${API_BASE_URL}/apis/v1/user/blogs/comment/${blogId}`,
    SATHI: `${API_BASE_URL}/apis/v1/user/sathi`,

    // Common
    EVENTS: `${API_BASE_URL}/apis/v1/common/events`,
    STORIES: `${API_BASE_URL}/apis/v1/common/stories`,
    TEAM_MEMBERS: `${API_BASE_URL}/apis/v1/common/team_members`,
    FEEDBACK: `${API_BASE_URL}/apis/v1/common/feedback`,

    // Health
    HEALTH: `${API_BASE_URL}/health`,
};

// Helper function for API calls with error handling
export const apiCall = async (url, options = {}) => {
    try {
        const token = localStorage.getItem('token');

        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers,
            },
        };

        const response = await fetch(url, { ...defaultOptions, ...options });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
};

export default API_BASE_URL;
