import { config as baseConfig } from './config';
import * as path from 'path';

const isHeroku = process.env.NODE_ENV === 'production' && process.env.DYNO;

export const config = {
  ...baseConfig,
  backend: {
    ...baseConfig.backend,
    address: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT) : 12021,
    avatarsDir: process.env.AVATARS_DIR || '/tmp/avatars',
    webUiDir: process.env.WEB_UI_DIR || (isHeroku
      ? '/app/packages/play/dist/ptcg-play'
      : path.resolve(__dirname, '../../../play/dist/ptcg-play')),

    allowCors: true,
    secret: process.env.SECRET_KEY || '!secret!'
  },
  storage: {
    type: 'sqlite',
    database: process.env.SQLITE_PATH || '/app/database.sq3'
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