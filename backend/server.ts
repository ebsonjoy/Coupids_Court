import "reflect-metadata";
import dotenv from "dotenv";
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import http from "http";
import cors from "cors";

import connectDB from "./config/db";
import { initializeSocket } from "./socket/socket";
import { notFound, errorHandler } from "./middleware/errorMiddleware";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import messageRoutes from "./routes/messagesRoutes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;


const server = http.createServer(app);


initializeSocket(server);


connectDB();


// const corsOptions = {
//   origin: ["http://localhost:3001", "https://coupidscourt.site/", "https://www.coupidscourt.site/"],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow necessary methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
//   credentials: true // If you're using cookies or authentication
// };
// app.use(cors(corsOptions));

const allowedOrigins = ["http://localhost:3001", "https://coupidscourt.site/", "https://www.coupidscourt.site/"]

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.static("backend/public"));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.get("/", (req, res) => {
  res.send("Server is ready");
});
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);


server.listen(port, () => console.log(`Server started on port ${port}`));
