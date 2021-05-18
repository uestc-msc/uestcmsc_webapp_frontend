import axios from '@/utils/axios';

export function signup(data) {
  return axios.post('/accounts/signup/', data);
}

export function login(data) {
  return axios.post('/accounts/login/', data);
}

export function logout(data) {
  return axios.get('/accounts/logout/');
}

export function forgetPassword(data) {
  return axios.post('/accounts/forgetpassword/', data);
}

export function resetPassword(data) {
  return axios.post('/accounts/resetpassword/', data);
}
