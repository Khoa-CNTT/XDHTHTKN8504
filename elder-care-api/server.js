// server.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import connectDB from "./src/config/connectDB.js";
import AuthRouter from "./src/routes/authRouter.js";
import OtpRouter from "./src/routes/otpRouter.js";
import ServiceRouter from "./src/routes/serviceRouter.js";
import ProfileRouter from "./src/routes/profileRouter.js";
import BookingRouter from "./src/routes/bookingRouter.js";
import DoctorRouter from "./src/routes/doctorRouter.js";
import NurseRouter from "./src/routes/nurseRouter.js";
import ScheduleRouter from './src/routes/scheduleRouter.js';
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/config/swaggerConfig.js";

const app = express();

// Connect to database
connectDB();

// Dùng Swagger UI để hiển thị tài liệu API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Tạo một endpoint API mẫu
/**
 * @swagger
 * /api/hello:
 *   get:
 *     description: Trả về thông điệp "Hello, world!"
 *     responses:
 *       200:
 *         description: Thành công
 */

// Middlewares
app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(bodyParser.json({ limit: "50mb" }));
app.use(morgan("common"));

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to Elder Care Backend!");
});

// API routes
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/otp", OtpRouter);
app.use("/api/v1/services", ServiceRouter);
app.use("/api/v1/profiles", ProfileRouter);
app.use("/api/v1/bookings", BookingRouter);
app.use("/api/v1/doctors", DoctorRouter);
app.use("/api/v1/nurses", NurseRouter);
app.use("/api/v1/schedules", ScheduleRouter);

const port = process.env.SERVER_PORT || 8080;
const listener = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${listener.address().port}`);
});
