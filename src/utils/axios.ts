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
    // 添加 CSRF token 和 sessionid
    config.headers = {
      'X-CSRFToken': Cookies.get('csrftoken'),
      // Cookie: Cookies.get('sessionid')
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
    // if (error.message == "Network Error")
    //   error.response = {"data": { "detail": "网络错误，请稍后再试"}}
    // else if (error.response.status == 401)
    //   return Promise.reject({"detail": "账号或密码错误"});
    // return Promise.reject(error.response.data)
    return Promise.reject(error)
  }
);

export default service;
