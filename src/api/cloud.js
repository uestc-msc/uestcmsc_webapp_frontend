import axios from '@/utils/axios';
import {baseUrl} from "@/utils";

export function createUploadSession(data) {
  return axios.post('/cloud/file/', data);
}

export function redirectToLoginOnedrive() {
  window.open(baseUrl + '/cloud/login/')
}

export function getOnedriveStatus() {
  return axios.get('/cloud/status/');
}
