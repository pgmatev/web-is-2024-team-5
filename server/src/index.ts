import { config } from "./config";

import express, { json } from "express";
import multer from "multer";
import cors from "cors";

//Server
const app = express();
const port = config.get("port");

app.use(json());
app.use(cors());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get("/hello", (_req, res) => res.send("Hello world"));

/**
 * When working with HTTP, 
 * usually the `multipart/form-data` encoding is used for files. 
 * That is because it can handle binary data and file metadata (file name, etc),
 * something that cannot be transferred in plain text
 */


//File uploading
// to System Storage
const upload = multer({ dest: "uploads/" });

// to Memory Buffer
// const upload = multer({
//   storage: multer.memoryStorage()
// });

// Multer middlewares process multipart/form-data
app.post("/file", upload.single('file'), (req, res) => {
  const file = req.file;

  if (file) {
    res.json({
      fileName: file.originalname,
      fileSize: file.size,
    });
  } else {
    res.status(400).send("No file uploaded");
  }
});

app.listen(port, () => {
  console.log("Server started on port ", port);
});
