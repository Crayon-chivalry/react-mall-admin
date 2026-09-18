import request from "./request";
import type {
  ApiResponse,
  ProductItem,
  GoodsListParams,
  CategoriesListParams,
  CategoriesItem,
  OrderListParams,
  OrderShipParams,
  OrderItem
} from "./types";

export const shopApi = {
  // 获取商品列表
  productList: (params: GoodsListParams) => {
    return request.get<ApiResponse>("/products", { params });
  },

  // 获取商品详情
  product: (id: number) => {
    return request.get<ApiResponse>(`/products/${id}`);
  },

  // 添加商品
  addProduct: (params: ProductItem) => {
    return request.post<ApiResponse>("/products", params);
  },

  // 修改商品
  updateProduct: (id: number, params: ProductItem) => {
    return request.patch<ApiResponse>(`/products/${id}`, params);
  },

  // 删除商品
  deletesProduct: (ids: number[]) => {
    return request.delete<ApiResponse>(`/products`, { data: { ids } });
  },

  // 修改商品上架状态
  changeProductStatus: (id: number, isOnSale: boolean) => {
    return request.patch<ApiResponse>(`/products/${id}/status`, {isOnSale});
  },

  // 获取分类列表
  categoriesList: (params: CategoriesListParams) => {
    return request.get<ApiResponse>("/categories", { params });
  },

  // 获取快捷分类
  categoriesParent: (level?: number) => {
    return request.get<ApiResponse>("/categories/parent/list", {
      params: { level },
    });
  },

  // 添加分类
  addCategories: (params: CategoriesItem) => {
    return request.post<ApiResponse>("/categories", params);
  },

  // 修改分类
  updateCategories: (id: number, params: CategoriesItem) => {
    return request.patch<ApiResponse>(`/categories/${id}`, params);
  },

  // 删除分类
  deleteCategories: (id: number) => {
    return request.delete<ApiResponse>(`/categories/${id}`);
  },

  // 订单列表
  orders: (params: OrderListParams) => {
    return request.get<ApiResponse>("/orders", { params });
  },

  // 订单详情
  orderDetails: (id: number) => {
    return request.get<ApiResponse>(`/orders/${id}`);
  },

  // 发货
  orderShip: (id: number, params: OrderShipParams) => {
    return request.post<ApiResponse>(`/orders/${id}/ship`, params);
  },

  // 删除订单
  deletesOrder: (ids: number[]) => {
    return request.delete<ApiResponse>(`/orders`, { data: { ids } });
  },

  // 修改订单
  updateOrder: (id: number, params: OrderItem) => {
    return request.patch<ApiResponse>(`/orders/${id}`, params);
  }
};
