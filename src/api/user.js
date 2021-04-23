import axios from '@/utils/axios';

export function getUserList(keyword, page, pageSize) {
  return axios.get(`/users/?search=${keyword}&page=${page}&page_size=${pageSize}`);
}

export function getUserDetail(userId) {
  return axios.get(`/users/${userId}/`);
}

export function updateUserDetail(userId, data) {
  return axios.patch(`/users/${userId}/`, data);
}

export function deleteUser(userId) {
  return axios.delete(`/users/${userId}/`);
}

export function getMyProfile() {
  return axios.get('/users/whoami/');
}

export function changePassword(userId, data) {
  return axios.patch(`/users/${userId}/password/`, data);
}
