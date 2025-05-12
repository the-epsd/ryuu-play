export const environment = {
  apiUrl: process.env.API_URL || 'https://localhost:12021',
  timeout: 5000,
  production: true,
  apiVersion: 2,
  defaultPageSize: 50,
  allowServerChange: false,
  refreshTokenInterval: 60 * 60 * 1000,
  enableImageCache: false,
  defaultLanguage: 'en',
  languages: { en: 'English' }
};
