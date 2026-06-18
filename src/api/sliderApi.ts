import request from "./request";
import type { ApiResponse, SliderParams, SliderListParams, SliderItem } from "./types";

export const sliderApi = {
  // 获取轮播图
  list: (params: SliderListParams) => {
    return request
    .get<ApiResponse>("/banners", {params})
    .then((res) => res.data)
  },

  // 添加轮播图
  add: (params: SliderParams) => {
    return request.post<ApiResponse<SliderItem>>("/banners", params)
  },

  // 修改轮播图
  update: (id: number, params: SliderParams) => {
    return request.patch<ApiResponse<SliderItem>>(`/banners/${id}`, params)
  },

  // 删除
  delete: (id: number) => {
    return request.delete<ApiResponse>(`/banners/${id}`)
  },

  // 修改状态
  upStatus: (id: number, isEnabled: boolean) => {
    return request.patch<ApiResponse>(`/banners/${id}/status`, {isEnabled})
  }
};
