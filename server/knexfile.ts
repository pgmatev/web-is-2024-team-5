import type { Knex } from "knex";
import { config } from "./src/config";
import { knexSnakeCaseMappers } from 'objection';

// Update with your config settings.

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: config.get('db'),
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    },
    ...knexSnakeCaseMappers()
  },

};

export default knexConfig;
