import request from "./request";
import type { ApiResponse, EntriesItem, UserListParams, ListResponse } from './types'

export const contentApi = {
  // 添加金刚区入口
  entriesAdd: (params: EntriesItem) => {
    return request.post<ApiResponse>("/home-entries", params)
  },

  // 修改金刚区入口
  entriesUpdate: (id:number, params: EntriesItem) => {
    return request.patch<ApiResponse>(`/home-entries/${id}`, params)
  },

  // 删除金刚区入口
  entriesDelete: (ids: number[]) => {
    return request.delete<ApiResponse>("/home-entries", { data: { ids } })
  },

  // 金刚区列表
  entriesList: (params: UserListParams) => {
    return request.get<ApiResponse<ListResponse<EntriesItem>>>("/home-entries", {params})
  }
}