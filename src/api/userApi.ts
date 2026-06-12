import request from "./request";
import type { ApiResponse, LoginParams } from "./types";

export const userApi = {
  // 登录
  login: (params: LoginParams) => {
    return request.post<ApiResponse>('/auth/admin/login', params);
  }
};
