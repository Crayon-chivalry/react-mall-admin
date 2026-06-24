import request from "./request";
import type { ApiResponse, CategoriesItem, CategoriesListParams } from './types'

export const categoriesApi = {
  // 获取列表
  list: (params: CategoriesListParams) => {
    return request.get<ApiResponse>("/categories", {params})
  },

  // 获取全部一级分类
  parentList: () => {
    return request.get<ApiResponse>("/categories/parent/list",)
  },

  // 添加
  add: (params: CategoriesItem) => {
    return request.post<ApiResponse>("/categories", params)
  },

  // 修改
  update: (id: number, params: CategoriesItem) => {
    return request.patch<ApiResponse>(`/categories/${id}`, params)
  }
}