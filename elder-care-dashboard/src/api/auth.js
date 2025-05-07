import axios from 'axios';

// const API_URL = process.env.API_URL;
const API_URL = "http://localhost:5000/api/v1";

export const getAllUsers = async() => {
    try {
        const response = await axios.get(`${API_URL}/auth/get-all-users`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

export const countUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/auth/count-users-per-month`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching user count:", error);
        throw error;
    }
}