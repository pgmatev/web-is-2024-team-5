import { config } from "./config";

import express, { json } from "express";
import http from "http";
import mongoose from "mongoose";
import { userRouter } from "./routers/UserRouter";

const mongoURI = process.env.MONGODB_URI as string;

mongoose
  .connect(mongoURI, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

//Server
const app = express();
const port = config.get("port");

app.use(json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get("/", (_req, res) => res.send("Hello world"));

app.use("/users", userRouter);

app.listen(port);
console.log("Server started on port ", port);
