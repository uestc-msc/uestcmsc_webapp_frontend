import axios from '@/utils/axios';
import Cookies from "js-cookie";
import store from "@/store";

export function signup(data) {
  return axios.post('/accounts/signup/', data);
}

export function login(data) {
  return axios.post('/accounts/login/', data);
}

// 完成登录、设置 csrf 和 store 的设置
export async function loginUser(username, password) {
  let data = {username, password};
  let res = await login(data)
  store.commit('setProfile', res.data);
  Cookies.set('csrftoken', res.data.csrftoken, { expires: 364 }); // 不能获取到跨域的域名，就需要自己设置
  return res;
}

export function logout() {
  return axios.get('/accounts/logout/');
}

// 完成登出以及 csrf 和 store 的设置
export async function logoutUser() {
  let res = await logout();
  store.commit('clearProfile');
  Cookies.remove('csrftoken');
  Cookies.remove('sessionid'); // 虽然跨域的 cookie 大概率删不掉
}

export function forgetPassword(data) {
  return axios.post('/accounts/forgetpassword/', data);
}

export function resetPassword(data) {
  return axios.post('/accounts/resetpassword/', data);
}
