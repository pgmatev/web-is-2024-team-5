import convict from 'convict';
import dotenv from 'dotenv';

dotenv.config();

const config = convict({
  mongoUri: {
    env: 'MONGODB_URI',
    default: '',
    nullable: false,
  },
  port: {
    env: 'PORT',
    format: 'port',
    default: 3000,
  },
  jwt: {
    secret: {
      env: 'JWT_SECRET',
      default: 'secret',
    },
    expiresIn: {
      env: 'JWT_EXPIRE',
      default: '1h',
    },
  },
});

config.validate();

export { config };
