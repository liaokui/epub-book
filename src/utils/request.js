import axios from 'axios';
import { MessageBox} from 'element-ui';
import {getToken} from '@/utils/auth';
import router from '../router';
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {
  // 清除空的字段
  for (let item in config.data) {
    if (config.data[item] === '') {
      config.data[item] = null;
    }
    if (Array.isArray(config.data[item])) {
      if (config.data[item].length == 0) {
        config.data[item] = null;
      }
    }
  }
  for (let item in config.params) {
    if (config.params[item] === '') {
      config.params[item] = null;
    }
    if (Array.isArray(config.params[item])) {
      if (config.params[item].length == 0) {
        config.params[item] = null;
      }
    }
  }
  // 接口带上token
  if ((config.noToken === undefined || !config.noToken) && getToken()) {
    config.headers['Authorization'] = 'Bearer ' + getToken(); 
  }
  delete config.noToken;
  return config;
}, error => {
  Promise.reject(error);
});

// respone拦截器
service.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    console.log(error.response)// for debug
    let data = error.response;
    if (data.status == 401) {
      MessageBox.confirm('登录信息失效,将转跳登录页面', '提示', {
        confirmButtonText: '确定',
        type: 'warning',
        showCancelButton: false,
        showClose: false,
      }).then(() => {
        setTimeout(() => {
          router.push({path: '/login'});
        }, 500);
      }).catch(() => {
        setTimeout(() => {
          router.push({path: '/login'});
        }, 500);
      });
    }
    return Promise.reject(error);
  }
);

export default service;
