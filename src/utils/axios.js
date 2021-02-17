import axios from "axios";
import Cookies from 'js-cookie';

import { baseUrl, DEBUG } from "@/utils";

// 创建axios实例
const service = axios.create({
  baseURL: baseUrl,
  timeout: 5000,          // 请求的超时时间
  withCredentials: true,  // 允许携带cookie
});

// request 拦截器
service.interceptors.request.use(
  config => {
    // 添加 CSRF token
    // sessionid 会自动添加
    config.headers = {
      'X-CSRFToken': Cookies.get('csrftoken'),
    };
    return config
  },
  error => {
    return Promise.reject(error)
  }
);

// response 拦截器
service.interceptors.response.use(
  response => {
    console.log(response)
    return response
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
        status: 0,
        data: "网络错误，请稍后再试"
      });
    if (error.message.startsWith('timeout'))
      return Promise.reject({
        status: 0,
        data: "网络超时，请检查网络或稍后再试"
      });
    else if (error.response.status === 401)
      return Promise.reject({
        status: 401,
        data: "账户或密码错误"
      });
    return Promise.reject(error.response)
  }
);

export default service;
