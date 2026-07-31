import request from "./request";
import type { ApiResponse, GoodsItem } from './types'

export const goodsApi = {
  // 添加商品
  add: (params: GoodsItem) => {
    return request.post<ApiResponse>("/products", params)
  },

  // 修改
  update: (id: number, params: GoodsItem) => {
    return request.patch<ApiResponse>(`/products/${id}`, params)
  },
}