import axios from "axios";

import {baseUrl, DEBUG, XHRTimeout} from "@/utils";

// 创建axios实例
const service = axios.create({
  baseURL: baseUrl,
  timeout: XHRTimeout,
  withCredentials: true,
  xsrfCookieName: 'csrftoken',  // 添加 CSRF token
  xsrfHeaderName: 'X-CSRFToken',
});

// request 拦截器
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
);

// response 拦截器
service.interceptors.response.use(
  response => {
    if(DEBUG)
      console.log(response);
    return response;
  },
  async error => {
    if (DEBUG) {
      console.warn("error: ", error);
      console.warn("error.response: ", error.response);
      console.warn("error.message: ", error.message);
    }

    if (error.message === "Network Error") {
      error.status = -1;
      error.data = "网络错误，请检查网络或稍后再试";
    } else if (error.message.startsWith('timeout')) {
      error.status = -2;
      error.data = "网络超时，请检查网络或稍后再试";
    } else if (error.response) {
      error = error.response;
      if (error.status === 500) {
        error.data = "服务器端错误，请联系管理员";
      } else if (error.status === 401) {
        error.data = "账户或密码错误";
      } else if (error.data && error.data.detail) {
        // 一些错误信息在 error.data 里，一些在 error.data.detail
        // 这里统一放在 error.data 里
        if (error.status === 403 && error.data.detail.includes('CSRF Failed')) {
          // 如果 csrf 错误，就自动帮用户注销，然后让用户重新登录
          let module = await import('@/api/account');
          await module.logoutUser();
          error.data = "身份认证过期，请重新登录~";
        } else {
          error.data = error.data.detail
        }
      }
    }
    store.commit('appendFailRequest', error);
    throw error;
  }
);

export default service;
