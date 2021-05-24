import axios from '@/utils/axios';
import {DEBUG} from "@/utils";

let userCache = {};

function setUserCache(user) {
  userCache[user.id] = user;
}

function getUserCache(id) {
  // if (DEBUG)
  //   console.log(`user ${id} cache ${userCache[id] ? 'hit' : 'miss'}!`)
  return userCache[id];
}

export async function getUserList(keyword, page, pageSize) {
  if (!keyword) keyword = '';
  let res = await axios.get(`/users/?search=${keyword}&page=${page}&page_size=${pageSize}`);
  res.data.results.forEach(setUserCache);
  return res;
}

export async function getUserDetail(userId, useCache = false) {
  if (useCache && getUserCache(userId))
    return {data: getUserCache(userId)};
  let res = await axios.get(`/users/${userId}/`);
  setUserCache(res.data);
  return res;
}

export async function updateUserDetail(userId, data) {
  let res = await axios.patch(`/users/${userId}/`, data);
  setUserCache(res.data);
  return res;
}

export async function deleteUser(userId) {
  return axios.delete(`/users/${userId}/`);
}

export async function getMyProfile() {
  return axios.get('/users/whoami/');
}

export function changePassword(userId, data) {
  return axios.patch(`/users/${userId}/password/`, data);
}
