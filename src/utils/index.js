const { verbose_name, version } = require('/package.json');
const DEBUG = process.env.NODE_ENV === 'development';
const baseUrl = DEBUG ? 'http://localhost:8000/api' : 'https://api.uestc-msc.com/api';
const debounceTime = 500;

export {
  verbose_name as appName,
  version as appVersion,
  DEBUG,
  baseUrl,
  debounceTime
}