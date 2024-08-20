import express from "express"
import cors from "cors"
import path from "path"
import cookieParser from "cookie-parser"
import { fileURLToPath } from 'url'
import { adminMiddleware } from './middlewares/admin.middleware.js';
import { verifyJWT } from "./middlewares/auth.middleware.js";

const app = express();

app.use(cookieParser())
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
// app.use(express.static("public"))

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Define routes for rendering pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});
app.get('/packages', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'products.html'));
});

app.get('/accounts', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'profile.html'));
});

app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'services.html'));
});
import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter);

import packageRouter from "./routes/package.routes.js";
app.use("/api/v1/packages", packageRouter);

import reviewRouter from "./routes/review.routes.js"
app.use("/api/v1/review", reviewRouter);

import adminRouter from "./routes/admin.routes.js"
app.use('/api/v1/admin', verifyJWT, adminMiddleware, adminRouter);

import notificationRouter from "./routes/notification.routes.js"
app.use("api/v1/notification", verifyJWT, notificationRouter );

import bookingRouter from "./routes/booking.routes.js"
app.use("/api/v1/booking", verifyJWT, bookingRouter)

import paymentRoutes from './routes/payment.routes.js';
app.use('/api/v1/payment', verifyJWT,paymentRoutes);

export {app}