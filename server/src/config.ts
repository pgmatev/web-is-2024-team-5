import convict from 'convict';
import dotenv from 'dotenv';

dotenv.config();

const config = convict({
  uri: {
    doc: 'MongoDB URL',
    env: 'MONGODB_URI',
  },
  port: {
    env: 'PORT',
    format: 'port',
    default: 3000,
  },
  jwt: {
    secret: { env: 'JWT_SECRET' },
    expiryTime: {
      env: 'JWT_EXPIRE',
      default: '1h',
    },
  },
});

config.validate();

export { config };
