import { config as baseConfig } from './config';

export const config = {
  ...baseConfig,
  backend: {
    ...baseConfig.backend,
    address: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT) : 12021,
    avatarsDir: process.env.AVATARS_DIR || '/tmp/avatars',
    webUiDir: process.env.WEB_UI_DIR || '/app/packages/play/dist/play'
  },
  storage: {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ptcg'
  },
  sets: {
    ...baseConfig.sets,
    scansDir: process.env.SCANS_DIR || '/tmp/scans'
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
    publicAddress: process.env.PUBLIC_URL || 'https://your-app-name.herokuapp.com'
  }
}; 