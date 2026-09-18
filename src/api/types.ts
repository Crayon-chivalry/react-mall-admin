// 接口结构
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 分页结构
export interface Pagination {
  page: number
  pageSize: number
  total: number
}

// 列表返回结构
export interface ListResponse<T> {
  list: T[]
  pagination: Pagination
}

// 基本分页
export interface BaseListParams {
  page: number
  pageSize: number
}

/**
 * User
 */
export interface LoginParams {
  account: string
  password: string
}

export interface UserListParams extends BaseListParams {
  phone?: number
  nickname?: string
  status?: number
  role?: string
}

// 用户信息
export interface UserItem {
  id: number
  userId: string
  nickname: string
  phone: string
  status: 1 | 2
  avatar: string
  password: string
  payPassword: string
  createdAt: string
  account?: string
  adminRoles: RolesItem[]
}

// 轮播
export interface SliderParams {
  id?: number
  title: string
  imageUrl: string
  linkUrl: string | null
  sort: number
  isEnabled: boolean
}

export interface SliderItem extends SliderParams {
  id: number
  createdAt: string
  updatedAt: string
}

export interface SliderListParams extends BaseListParams {
  title?: string
  isEnabled?: boolean
}

// 日志
export interface LogsItem {
  createdAt: string
  action: string
  module: string
  operatorNickname: string
  operatorPhone: number
  operatorUserId: string
  ip: string
  type: string
}

export interface LogsListParams extends BaseListParams {
  operatorPhone?: number
  date?: string
}

// 角色
export interface RolesItem {
  id: number
  code: string
  name: string
  description: string
  isEnabled: boolean
  permissionIds: [number]
  permissions: [PermissionItem]
  menus: [MenuItem]
}

// 菜单树
export interface MenuItem {
  id: number
  name: string
  code: string
  type: number
  parentId: number | null
  path: string
  icon: string
  permissionCode: string
  sort: number
  isEnabled: boolean
  children?: MenuItem[]
}

// 权限
export interface PermissionItem {
  id: number
  code: string
  name: string
  description: string
  isEnabled: boolean
}

// 金刚区
export interface EntriesListParams extends BaseListParams {
  title?: string
  isEnabled?: boolean
}

export interface EntriesItem {
  id: number
  title: string
  iconUrl: string
  linkUrl: string
  sort: number
  isEnabled: boolean
}

// 促销、广告
type LayoutType = "single" | "double" | "triple"

export interface PromoListParams extends BaseListParams {
  title?: string
  layoutType?: LayoutType
  isEnabled?: boolean
}

export interface PromoImageItem {
  title: string
  imageUrl: string
  linkUrl: string
}

export interface PromoItem {
  id: number
  title: string
  layoutType: LayoutType
  imageItems: PromoImageItem[]
  sort: number
  isEnabled: boolean
}

/**
 * 商城相关
 */
export interface CategoriesItem {
  id: number
  name: string
  icon: string
  isVisible: boolean
  parentId: number
  sort: number
}

export interface CategoriesListParams extends BaseListParams {
  keyword?: string
  isVisible?: number | boolean
}

export interface GoodsListParams extends BaseListParams {
  keyword?: string
  categoryId?: number
  isOnSale?: boolean
}

export interface SpecsItem {
  name: string
  value: string
}

export interface SkuItem {
  id?: number
  title: string
  specs: SpecsItem[]
  price: string
  stock: number
  cover: string
  isDefault: boolean
}

export interface ProductItem {
  id: number
  name: string
  price: string
  stock: number
  sales: number
  categoryId: number
  cover: string
  images: string[]
  description: string
  detailContent: string
  isOnSale: boolean
  skus: SkuItem[]
  category: CategoriesItem
  specType: "single" | "multi"
}

export type OrderStatus = "pending" | "paid" | "shipped" | "completed" | "cancelled"

export interface OrderShipParams {
  expressCompany: string
  shippingNo: string
}

export interface OrderListParams extends BaseListParams {
  status?: OrderStatus
  orderNo?: string
}

export interface OrderProductItem {
  id: number
  price: string
  productCover: string
  productName: string
  quantity: number
  skuTitle: string
  product: ProductItem
  sku: SkuItem[]
  skuSpecs: SpecsItem[]
}

export interface OrderItem {
  id: number
  createdAt: string
  orderNo: string
  totalAmount: string
  status: OrderStatus
  remark: string
  receiverName: string
  receiverPhone: number
  province: string
  city: string
  district: string
  detailAddress: string
  postalCode: string
  items: OrderProductItem[]
  paymentType: string
  paidAt: string
  expressCompany: string
  shippingNo: string
}


export interface resetParams {
  users?: boolean
  products?: boolean
  orders?: boolean
  logs?: boolean
  contents?: boolean
}
