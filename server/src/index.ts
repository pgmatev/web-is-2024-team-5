import {config} from "./config";
import express, {json} from "express";
import {router as authRouter} from './routes/auth'

//Server
const app = express();
const port = config.get("port");

app.use(json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.get("/", (req, res) => res.send("Hello world"));

app.use("/auth", authRouter);

app.listen(port);
console.log("Server started on port ", port);
