import request from "./request";
import type { ApiResponse, LoginParams, UserListParams } from "./types";

export const userApi = {
  // 登录
  login: (params: LoginParams) => {
    return request.post<ApiResponse>('/auth/admin/login', params);
  },

  // 获取用户列表
  list: (params: UserListParams) => {
    return request.get<ApiResponse>('/users', {params});
  }
};
