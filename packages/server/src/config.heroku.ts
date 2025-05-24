import { config as baseConfig } from './config';
import * as path from 'path';

const isHeroku = process.env.NODE_ENV === 'production' && process.env.DYNO;

// Create a new config object with the Heroku-specific settings
const herokuConfig = {
  backend: {
    ...baseConfig.backend,
    address: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT) : 12021,
    avatarsDir: process.env.AVATARS_DIR || '/tmp/avatars',
    webUiDir: process.env.WEB_UI_DIR || (isHeroku
      ? '/app/packages/play/dist/ptcg-play'
      : path.resolve(__dirname, '../../../play/dist')),
    allowCors: true,
    secret: process.env.SECRET_KEY || '!secret!'
  },
  storage: {
    // Comment out or remove SQLite config
    // type: 'sqlite',
    // database: 'database.sq3'

    // Add MySQL config
    type: process.env.STORAGE_TYPE || 'mysql',
    user: process.env.STORAGE_USERNAME,
    password: process.env.STORAGE_DATABASE_PASSWORD,
    database: process.env.STORAGE_DATABASE,
    port: process.env.STORAGE_PORT ? parseInt(process.env.STORAGE_PORT) : 3306,
    ssl: {
      rejectUnauthorized: false
    }
  },
  sets: {
    ...baseConfig.sets,
    scansDir: process.env.SCANS_DIR || '/tmp/scans',
    scansDownloadUrl: process.env.SCANS_DOWNLOAD_URL || 'https://twinleaf.herokuapp.com/scans'
  },
  email: {
    transporter: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    },
    sender: process.env.EMAIL_SENDER || 'noreply@ryuuplay.com',
    appName: 'RyuuPlay',
    publicAddress: process.env.PUBLIC_URL || 'https://twinleaf.herokuapp.com'
  }
};

// Merge the configs
export const config = {
  ...baseConfig,
  ...herokuConfig,
  backend: {
    ...baseConfig.backend,
    ...herokuConfig.backend
  },
  sets: {
    ...baseConfig.sets,
    ...herokuConfig.sets
  },
  email: {
    ...baseConfig.email,
    ...herokuConfig.email
  }
}; 