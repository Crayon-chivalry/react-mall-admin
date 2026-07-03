import request from "./request";
import type { ApiResponse, RolesItem, MenusItem, PermissionItem } from "./types";

export const rbacApi = {
  // 角色列表
  roles: () => {
    return request.get<ApiResponse>("/rbac/roles")
  },

  // 创建角色
  createRole: (params: RolesItem) => {
    return request.post("/rbac/roles", params)
  },

  // 更新角色
  updateRole: (id: number, params: RolesItem) => {
    return request.patch(`/rbac/roles/${id}`, params)
  },

  // 删除角色
  deleteRole: (id: number) => {
    return request.delete(`/rbac/roles/${id}`)
  },

  // 设置角色菜单
  updateRoleMenus: (id: number, menuIds: number[]) => {
    return request.patch(`/rbac/roles/${id}/menus`, { menuIds })
  },

  // 获取菜单树
  menus: () => {
    return request.get<ApiResponse>("/rbac/menus")
  },

  // 添加菜单
  addMenus: (params: MenusItem) => {
    return request.post<ApiResponse>("/rbac/menus", params)
  },
  
  // 更新菜单
  updateMenus: (id: number, params: MenusItem) => {
    return request.patch<ApiResponse>(`/rbac/menus/${id}`, params)
  },

  // 删除菜单
  deleteMenus: (id: number) => {
    return request.delete<ApiResponse>(`/rbac/menus/${id}`)
  },

  // 获取权限列表
  permissions: () => {
    return request.get<ApiResponse>("/rbac/permissions")
  },

  // 添加权限
  createPermissions: (params: PermissionItem) => {
    return request.post<ApiResponse>("/rbac/permissions", params)
  },
  
  // 更新权限
  updatePermissions: (id: number, params: PermissionItem) => {
    return request.patch<ApiResponse>(`/rbac/permissions/${id}`, params)
  },

  // 删除菜单
  deletePermissions: (id: number) => {
    return request.delete<ApiResponse>(`/rbac/permissions/${id}`)
  },
}