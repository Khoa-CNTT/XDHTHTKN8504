import axios from 'axios'

const API_URL = "http://localhost:5000/api/v1";

export const getAllBookings = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/v1/bookings/get-all-bookings");
        return response.data.bookings;
    } catch (error) {
        console.error("Error fetching bookings:", error);
        throw error;
    }
}

export const getPatients = async() => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get("http://localhost:5000/api/v1/bookings/get-profiles", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // console.log("response:", response.data.patients);
        return response.data.patients;
    } catch (error) {
        console.error("Error fetching patients:", error);
        throw error;        
    }
}