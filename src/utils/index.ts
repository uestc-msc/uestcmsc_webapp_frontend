const { verbose_name, version } = require('/package.json');
const baseUrl = (process.env.NODE_ENV === 'development') ? 'http://localhost:8000/api' : 'https://uestcmsc-webapp.lyh543.cn/api';

export {
  verbose_name as appName,
  version as appVersion,
  baseUrl
}