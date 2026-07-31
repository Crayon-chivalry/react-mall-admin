import request from "./request";
import type { ApiResponse, CategoriesItem, CategoriesListParams } from './types'

export const categoriesApi = {
  // 获取列表
  list: (params: CategoriesListParams) => {
    return request.get<ApiResponse>("/categories", {params})
  },

  // 获取快捷分类
  parentList: (level?: number) => {
    return request.get<ApiResponse>("/categories/parent/list", {params: {level}})
  },

  // 添加
  add: (params: CategoriesItem) => {
    return request.post<ApiResponse>("/categories", params)
  },

  // 修改
  update: (id: number, params: CategoriesItem) => {
    return request.patch<ApiResponse>(`/categories/${id}`, params)
  },

  // 删除
  delete: (id: number) => {
    return request.delete<ApiResponse>(`/categories/${id}`)
  }
}