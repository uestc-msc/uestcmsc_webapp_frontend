import axios from '@/utils/axios';
import {OnedriveXHRTimeout} from "@/utils";

export function getActivityList(keyword, page, pageSize) {
  if (!keyword) keyword = '';
  return axios.get(`/activities/?search=${keyword}&page=${page}&page_size=${pageSize}`);
}

export function createActivity(data) {
  return axios.post('/activities/', data);
}

export function getActivityDetail(activityId) {
  return axios.get(`/activities/${activityId}/`);
}

export function updateActivityDetail(activityId, data) {
  return axios.patch(`/activities/${activityId}/`, data);
}

export function deleteActivity(activityId) {
  return axios.delete(`/activities/${activityId}/`);
}

export function getActivityAdminDetail(activityId) {
  return axios.get(`/activities/${activityId}/admin/`);
}

export function updateActivityAttender(activityId, data) {
  return axios.patch(`/activities/${activityId}/attender/`, data);
}

export function checkInActivity(activityId, data) {
  return axios.post(`/activities/${activityId}/checkin/`, data);
}

//////////////////////////////  沙龙链接部分  //////////////////////////////

export function addActivityLink(data) {
  return axios.post('/activities/link/', data);
}

export function getActivityLink(linkId) {
  return axios.get(`/activities/link/${linkId}/`);
}

export function updateActivityLink(linkId, data) {
  return axios.patch(`/activities/link/${linkId}/`, data);
}

export function deleteActivityLink(linkId) {
  return axios.delete(`/activities/link/${linkId}/`);
}

//////////////////////////////  沙龙文件部分  //////////////////////////////

export function addActivityFile(data) {
  // 服务器端要多次访问 Onedrive API，所以给够 timeout
  return axios.post('/activities/file/', data, {timeout: OnedriveXHRTimeout});
}

export function deleteActivityFile(fileId) {
  return axios.delete(`/activities/file/${fileId}/`, {timeout: OnedriveXHRTimeout});
}

//////////////////////////////  沙龙图片部分  //////////////////////////////

export function getActivityPhotoList(activityId, page, pageSize) {
  return axios.get(`/activities/photo/?activity=${activityId}&page=${page}&page_size=${pageSize}`);
}

export function addActivityPhoto(data) {
  return axios.post('/activities/photo/', data, {timeout: OnedriveXHRTimeout});
}

export function deleteActivityPhoto(photoId) {
  return axios.delete(`/activities/photo/${photoId}/`, {timeout: OnedriveXHRTimeout});
}
