import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

// Khởi tạo Twilio client
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export default client;
