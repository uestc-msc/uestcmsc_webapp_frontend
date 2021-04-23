import axios from '@/utils/axios';

export function getActivityList(keyword, page, pageSize) {
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

export function updateActivityCheckInList(activityId, data) {
  return axios.patch(`/activities/${activityId}/admin/checkin/`, data);
}

export function checkInActivity(activityId, data) {
  return axios.patch(`/activities/${activityId}/checkin/`, data);
}

//////////////////////////////  活动链接部分  //////////////////////////////

export function addActivityLink(data) {
  return axios.post('/activities/link/', data);
}

export function getActivityLink(linkId) {
  return axios.get(`/activities/link/${linkId}`);
}

export function updateActivityLink(linkId, data) {
  return axios.patch(`/activities/link/${linkId}`, data);
}

export function deleteActivityLink(linkId) {
  return axios.delete(`/activities/link/${linkId}`);
}

//////////////////////////////  活动文件部分  //////////////////////////////

export function addActivityFile(data) {
  return axios.post('/activities/file/', data);
}

export function deleteActivityFile(fileId) {
  return axios.delete(`/activities/file/${fileId}`);
}

//////////////////////////////  活动图片部分  //////////////////////////////

export function addActivityPhoto(data) {
  return axios.post('/activities/photo/', data);
}

export function deleteActivityPhoto(photoId) {
  return axios.delete(`/activities/photo/${photoId}`);
}
