export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 基本分页
export interface BaseListParams {
  page: number
  pageSize: number
}

// User
export interface LoginParams {
  phone: string
  password: string
}

export interface UserListParams extends BaseListParams {
  phone?: number
  nickname?: string
  status?: number
}

export interface UserItem {
  userid: string
  nickname: string
  phone: string
  status: 1 | 2
  avatar: string
  createdAt: string
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