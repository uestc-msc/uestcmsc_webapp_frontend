import axios from '@/utils/axios';
import {baseUrl, OnedriveXHRTimeout} from "@/utils";

export function createUploadSession(data) {
  return axios.post('/cloud/file/', data, {timeout: OnedriveXHRTimeout});
}

export function redirectToLoginOnedrive() {
  window.open(baseUrl + '/cloud/login/')
}

export function getOnedriveStatus() {
  return axios.get('/cloud/status/');
}

export function getOnedriveFileUrl(file_id) {
  return baseUrl + `/cloud/file/${file_id}/download/`;
}