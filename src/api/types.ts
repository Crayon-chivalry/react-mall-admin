export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface LoginParams {
  phone: string;
  password: string
}