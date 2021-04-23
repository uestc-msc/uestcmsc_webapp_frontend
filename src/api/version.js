import axios from '@/utils/axios';

export function getVersion(data) {
  return axios.get('/version/');
}