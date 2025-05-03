import axios from "axios";

const API_URL = process.env.API_URL;

export const getServices = async () => {
    try {
        const response = await axios.get(`${API_URL}/services/get-services`);
        return response.data.service
    } catch (error) {
        console.error("Error fetching services:", error);
        throw error;
    }
}