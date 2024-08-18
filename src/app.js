import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
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
app.use(express.static("public"))

// routes import 

import userRouter from "./routes/user.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);

import packageRouter from "./routes/package.routes.js";
// routes declaration
app.use("/api/v1/packages", packageRouter);

import reviewRouter from "./routes/review.routes.js"
app.use("/api/v1/review", reviewRouter);

import adminRouter from "./routes/admin.routes.js"
app.use('/api/v1/admin', verifyJWT, adminMiddleware, adminRouter);

import notificationRouter from "./routes/notification.routes.js"
app.use("api/v1/notification", verifyJWT, notificationRouter );


// http://localhost:3000/api/v1/users/register

export {app}