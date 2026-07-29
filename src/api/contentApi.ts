import request from "./request";
import type {
  ApiResponse,
  EntriesItem,
  EntriesListParams,
  ListResponse,
  PromoListParams,
  PromoItem,
} from "./types";

export const contentApi = {
  // 添加金刚区入口
  entriesAdd: (params: EntriesItem) => {
    return request.post<ApiResponse>("/home-entries", params);
  },

  // 修改金刚区入口
  entriesUpdate: (id: number, params: EntriesItem) => {
    return request.patch<ApiResponse>(`/home-entries/${id}`, params);
  },

  // 删除金刚区入口
  entriesDelete: (ids: number[]) => {
    return request.delete<ApiResponse>("/home-entries", { data: { ids } });
  },

  // 金刚区列表
  entriesList: (params: EntriesListParams) => {
    return request.get<ApiResponse<ListResponse<EntriesItem>>>(
      "/home-entries",
      { params },
    );
  },

  // 广告促销列表
  promoList: (params: PromoListParams) => {
    return request.get<ApiResponse<ListResponse<PromoItem>>>("/promo-sections", {
      params,
    });
  },

  // 添加广告促销
  promoAdd: (params: PromoItem) => {
    return request.post<ApiResponse>("/promo-sections", params);
  },

  // 修改广告促销
  promoUpdate: (id: number, params: PromoItem) => {
    return request.patch<ApiResponse>(`/promo-sections/${id}`, params);
  },

  promoDelete: (ids: number[]) => {
    return request.delete<ApiResponse>("/promo-sections", { data: { ids } });
  }
};
