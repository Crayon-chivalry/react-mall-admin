import request from "./request";
import type { ApiResponse } from "./types";

export const statsApi = {
  // 统计概述， 总销量、订单总量、用户总量
  summary: () => {
    return request.get<ApiResponse>("/stats/summary")
  },

  // 销售图表数据
  salesTrend: (days: number) => {
    return request.get<ApiResponse>("/stats/sales-trend", {params: {days}})
  },

  // 获取畅销商品榜
  topProducts: () => {
    return request.get<ApiResponse>("/stats/top-products")
  }
}