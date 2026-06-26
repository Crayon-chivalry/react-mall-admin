import request from "./request";
import type { ApiResponse, LogsListParams } from "./types";

export const systemApi = {
  // 日志列表
  logs: (params: LogsListParams) => {
    return request.get<ApiResponse>("/logs/admin-operation", {params})
  },

  // 统计
  logsSummary: () => {
    return request.get<ApiResponse>("/logs/admin-operation/summary")
  }
}