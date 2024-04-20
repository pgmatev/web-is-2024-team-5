import convict from "convict";
import dotenv from "dotenv";
dotenv.config();

const config = convict({
  db: {
    user: {
      doc: "DB user",
      env: "DATABASE_USER",
      default: "postgres",
    },
    password: {
      doc: "DB Password",
      env: "DATABASE_PASSWORD",
      default: "postgres",
    },
    host: {
      env: "DATABASE_HOST",
      default: "localhost",
    },
    port: {
      env: "DATABASE_PORT",
      format: "port",
      default: 5432,
    },
    database: {
      doc: "DB database name",
      env: "DATABASE_NAME",
      default: "compassible",
    },
  },
  port: {
    env: "PORT",
    format: "port",
    default: 3000,
  },
  jwt: {
    privateKey: {
      env: "MOVIE_PROJECT_JWT_SECRET",
      default: "kuramiqnko",
    },
    expiryTime: {
      env: "MOVIE_PROJECT_JWT_EXP_TIME",
      default: "1h",
    },
  },
});

config.validate();

export { config };
