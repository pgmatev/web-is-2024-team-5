import { knex } from "knex";
import { Model } from "objection";
import knexConfig from "../knexfile";
import { config } from "./config";

import express, { json } from "express";
import http from "http";

//Connection to the database
const knexClient = knex(knexConfig.development);
Model.knex(knexClient);

//Server
const app = express();
const port = config.get("port");

app.use(json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use("/", (_req, res) => res.send("Hello world"));

app.listen(port);
console.log("Server started on port ", port);
