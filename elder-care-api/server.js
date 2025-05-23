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
import UserRouter from "./src/routes/userRouter.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/config/swaggerConfig.js";
import configureSocket from "./src/config/socketConfig.js";
import PaymentRouter from "./src/routes/paymentRoutes.js"; 
import PackageRouter from "./src/routes/packageRoutes.js";
import WalletRouter from "./src/routes/walletRoutes.js"
import ReviewRouter from "./src/routes/reviewRoutes.js"
import ChatRouter from "./src/routes/chatRoutes.js"
import InvoiceRouter from "./src/routes/invoiceRoutes.js"
import './src/jobs/bookingMonitor.js';  
import http from "http";
import agenda from "./src/utils/agenda.js"
import autoCancelBooking from "./src/jobs/BookingCanceled.js";
import remindBookingPending from "./src/jobs/remindBookingPending.js";



const app = express();
const server = http.createServer(app);



autoCancelBooking(agenda);
remindBookingPending(agenda);

(async () => {
  await agenda.start();
  console.log("✅ Agenda sẵn sàng");
})();
// Cấu hình socket.io
configureSocket(server);

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
    origin: "http://localhost:3000",
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
app.use("/api/v1/user", UserRouter); 
app.use("/api/v1/payment", PaymentRouter); 
app.use("/api/v1/packages", PackageRouter);
app.use("/api/v1/wallet", WalletRouter);
app.use("/api/v1/reviews", ReviewRouter)
app.use('/api/v1/chats', ChatRouter);
app.use("/api/v1/invoices", InvoiceRouter)

const port = process.env.SERVER_PORT || 8080;
const listener = server.listen(port, '0.0.0.0',() => {
  console.log(`Server is running on http://0.0.0.0:${listener.address().port}`);
});
