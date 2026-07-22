import axios from "axios";
import { message } from 'antd';

import useUserStore from '@/store/userStore';
import type { ApiResponse } from './types'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/admin',
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use((config) => {
  const token = useUserStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：统一处理后端返回格式
request.interceptors.response.use(
  (response) => {
    const res = response.data as ApiResponse<any>;
    if (res.code !== 0) {
      const content = res.message || '请求失败';
      message.open({
        content,
        type: 'error',
      })
      return Promise.reject(new Error(content));
    }
    return response;
  },
  (error) => {
    // if (error.response?.status === 401) {
    //   // token 过期，跳转登录
    //   localStorage.removeItem('token');
    //   window.location.href = '/login';
    // }
    const content =
      error?.response?.data?.message || error?.message || String(error);
    message.open({
      content,
      type: 'error',
    })
    return Promise.reject(error);
  }
);

export default request;
