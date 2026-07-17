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

// User
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

// 分类
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
  component: string
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
