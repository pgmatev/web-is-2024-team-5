import {config} from "./config";
import express, {json} from "express";
import bodyParser from "body-parser";
import http from "http";
import mongoose from "mongoose";
import {router as authRouter} from './routers/auth'
import {userRouter} from "./routers/UserRouter";


const mongoURI = process.env.MONGODB_URI as string;

mongoose
    .connect(mongoURI, {})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));


//Server
const app = express();
const port = config.get("port");

app.use(json());
app.use(bodyParser.urlencoded({extended: false})); // parse urlencoded form-data
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.get("/", (_req, res) => res.send("Hello world"));
app.use("/auth", authRouter);
app.use("/users", userRouter);

app.listen(port);
console.log("Server started on port ", port);
