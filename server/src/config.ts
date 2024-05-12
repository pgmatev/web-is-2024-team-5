import convict from "convict";
import dotenv from "dotenv";

dotenv.config();

const config = convict({
    db: {},
    port: {
        env: "PORT",
        format: "port",
        default: 3000,
    },
    jwt: {},
});

config.validate();

export {config};
