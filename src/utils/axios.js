import axios from "axios";

import { baseUrl, DEBUG } from "@/utils";

// 创建axios实例
const service = axios.create({
  baseURL: baseUrl,
  timeout: 5000,                // 请求的超时时间
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
  error => {
    if (DEBUG)
    {
      console.warn("error: ", error);
      console.warn("error.response: ", error.response);
      console.warn("error.message: ", error.message);
    }
    if (error.message === "Network Error")
      return Promise.reject({
        status: -1,
        data: "网络错误，请检查网络或稍后再试"
      });
    if (error.message.startsWith('timeout'))
      return Promise.reject({
        status: -2,
        data: "网络超时，请检查网络或稍后再试"
      });
    if (error.response.status === 500)
      return Promise.reject({
        status: 500,
        data: "服务器端错误，请联系管理员"
      });
    if (error.response.status === 401)
      return Promise.reject({
        status: 401,
        data: "账户或密码错误"
      });
    // 一些错误信息在 response.data 里，一些在 response.data.detail
    // 这里统一放在 response.data 里
    if (error.response.data && error.response.data.detail) {
      return Promise.reject({
        status: error.response.status,
        data: error.response.data.detail
      });
    }
    return Promise.reject(error.response)
  }
);

export default service;
