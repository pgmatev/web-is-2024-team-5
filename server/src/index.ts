import {config} from "./config";

import express, {json} from "express";
import http from "http";
import mongoose from "mongoose";
import {router as authRouter} from './routes/auth'

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
app.use("/auth", authRouter);
// TODO: Extract in a service

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
});

const User = mongoose.model("User", userSchema);

// Define an endpoint to create a new user
app.post("/users", async (req, res) => {
    try {
        // Extract user data from request body
        const {username, email, password} = req.body;

        // Check if required fields are provided
        if (!username || !email || !password) {
            return res
                .status(400)
                .json({error: "Username, email, and password are required"});
        }

        // Create a new User document
        const newUser = new User({username, email, password});

        // Save the new User document to MongoDB
        await newUser.save();

        // Respond with success message
        res
            .status(201)
            .json({message: "User created successfully", user: newUser});
    } catch (error) {
        // Respond with error message if something goes wrong
        res.status(500).json({error: "Failed to create user"});
    }
});

app.listen(port);
console.log("Server started on port ", port);
