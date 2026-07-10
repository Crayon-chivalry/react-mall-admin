import request from "./request";
import type { ApiResponse, ListResponse, LoginParams, UserItem, UserListParams } from "./types";

export const userApi = {
  // 登录
  login: (params: LoginParams) => {
    return request.post<ApiResponse>('/auth/admin/login', params);
  },

  // 获取用户列表
  list: (params: UserListParams) => {
    return request.get<ApiResponse<ListResponse<UserItem>>>('/users', {params});
  },

  // 添加用户
  add: (params: UserItem) => {
    return request.post<ApiResponse>('/users', params);
  },

  // 修改用户信息
  update: (userId: string, params: UserItem) => {
    return request.patch<ApiResponse>(`/users/${userId}`, params)
  },

  // 删除用户
  deletes: (userIds: string[]) => {
    return request.delete<ApiResponse>(`/users`, { data: { userIds } })
  },

  // 添加管理员
  addAdmin: (params: UserItem) => {
    return request.post<ApiResponse>('/users/admin', params);
  }
};
