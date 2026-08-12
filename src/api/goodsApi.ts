import request from "./request";
import type { ApiResponse, GoodsItem, GoodsListParams } from './types'

export const goodsApi = {
  // 获取商品列表
  list: (params: GoodsListParams) => {
    return request.get<ApiResponse>("/products", { params })
  },

  // 获取商品详情
  get: (id: number) => {
    return request.get<ApiResponse>(`/products/${id}`)
  },

  // 添加商品
  add: (params: GoodsItem) => {
    return request.post<ApiResponse>("/products", params)
  },

  // 修改
  update: (id: number, params: GoodsItem) => {
    return request.patch<ApiResponse>(`/products/${id}`, params)
  },

  // 删除
  deletes: (ids: number[]) => {
    return request.delete<ApiResponse>(`/products`, { data: { ids } })
  }
}