import axios from "axios";
import { baseUrl } from "@/utils";

// 创建axios实例
const service = axios.create({
  baseURL: baseUrl,
  timeout: 5000,          // 请求的超时时间
  withCredentials: true   // 允许携带cookie
});

// 发送请求前处理 request 数据
axios.defaults.transformRequest = [function (data) {
  let newData = ''
  for (let k in data) {
    newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
  }
  return newData
}];

// request 拦截器
service.interceptors.request.use(
  config => {
    // 发送请求之前，要做的业务
    return config
  },
  error => {
    // 错误处理代码
    return Promise.reject(error)
  }
);

// response 拦截器
service.interceptors.response.use(
  response => {
    // 数据响应之后，要做的业务
    return response
  },
  error => {
    return Promise.reject(error)
  }
);

export default service;
