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
    if (DEBUG)
    {
      console.warn("error: ", error);
      console.warn("error.response: ", error.response);
      console.warn("error.message: ", error.message);
    }
    if (error.message === "Network Error")
      throw {
        status: -1,
        data: "网络错误，请检查网络或稍后再试"
      };
    if (error.message.startsWith('timeout'))
      throw {
        status: -2,
        data: "网络超时，请检查网络或稍后再试"
      };
    if (error.response.status === 500)
      throw {
        status: 500,
        data: "服务器端错误，请联系管理员"
      };
    if (error.response.status === 401)
      throw {
        status: 401,
        data: "账户或密码错误"
      };

    // 一些错误信息在 response.data 里，一些在 response.data.detail
    // 这里统一放在 response.data 里
    if (error.response.data && error.response.data.detail) {
      if (error.response.status === 403 && error.response.data.detail.includes('CSRF Failed')) {
        // 如果 csrf 错误，就自动帮用户注销，然后重新登录吧
        let module = await import('@/api/account');
        await module.logoutUser();
        throw{
          status: 403,
          data: "身份认证过期，请重新登录~"
        }
      }
      else {
        throw {
          status: error.response.status,
          data: error.response.data.detail
        }
      }
    }
    throw error.response;
  }
);

export default service;
