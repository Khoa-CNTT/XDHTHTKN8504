import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./src/config/connectDB.js";
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import AuthRouter from './src/routes/authRouter.js';



const app = express();

// connect to database
connectDB();

// use cors
app.use(cors({
    origin: process.env.CLIENT_URL,
    method: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extends: true }))
app.use(bodyParser.json({ limit: '50mb' }));
app.use(morgan('common'));

app.get('/', (req, res) => {
    res.send('Welcome to Elder Care Backend!hhh');
});

// use routes
app.use('.api/v1/auth', AuthRouter)

const port = process.env.SERVER_PORT || 8080;
const listener = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${listener.address().port}`);
});