import axios from 'axios';

const VerifyToken = async (navigate) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log("No token found.");
        return false;
    }

    try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await axios.get(`${backendUrl}/verify-token`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Optionally, you can return the decoded token data
        return { isValid: true, data: response.data }; 

    } catch (error) {
        console.error("Token verification failed:", error.response?.data || error.message);
        
        // Handle specific error statuses
        if (error.response) {
            if (error.response.status === 401) {
                alert("Session expired. Please login again.");
            } else if (error.response.status === 403) {
                alert("Access denied. You do not have permission to access this resource.");
            } else {
                alert("An error occurred. Please try again.");
            }
        } else {
            alert("Network error. Please check your connection.");
        }

        localStorage.removeItem('token');
        return { isValid: false }; 
    }
};

export default VerifyToken;
