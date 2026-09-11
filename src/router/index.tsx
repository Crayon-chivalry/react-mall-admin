import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/pages/MainLayout";
import RequireAuth from "./RequireAuth";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import User from "@/pages/User";
import AdminList from "@/pages/User/AdminList";
import Roles from "@/pages/Rbac/index";
import Menus from "@/pages/Rbac/Menus";
import Shop from "@/pages/Shop";
import ProductsForm from "@/pages/Shop/ProductsForm";
import Categorize from "@/pages/Shop/Categorize";
import Orders from "@/pages/Shop/Orders";
import Setting from "@/pages/System";
import Slider from "@/pages/Content/Slider";
import Entries from "@/pages/Content/Entries";
import Promo from "@/pages/Content/Promo";
import Logs from "@/pages/System/Logs";
import NotFound from "@/pages/NotFound";
import Forbidden from "@/pages/Forbidden";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
    children: [
      // 仪表板
      {
        index: true,
        element: <Dashboard />,
        handle: { title: "仪表板" },
      },
      // 用户管理
      {
        path: "/user",
        handle: { title: "用户管理" },
        children: [
          {
            index: true,
            element: <User />,
            handle: { title: "用户列表" },
          },
          {
            path: "admin",
            element: <AdminList />,
            handle: { title: "管理员列表" },
          },
        ],
      },
      // 商城管理
      {
        path: "/shop",
        handle: { title: "商城管理" },
        children: [
          {
            path: "products",
            element: <Shop />,
            handle: { title: "商品列表" },
          },
          {
            path: "products-form",
            element: <ProductsForm />,
            handle: { title: "编辑商品" },
          },
          {
            path: "categorize",
            element: <Categorize />,
            handle: { title: "分类管理" },
          },
          {
            path: "orders",
            element: <Orders />,
            handle: { title: "订单列表" },
          },
        ],
      },
      // 内容管理
      {
        handle: { title: "内容管理" },
        path: "/content",
        children: [
          {
            path: "slider",
            element: <Slider />,
            handle: { title: "轮播图" },
          },
          {
            path: "entries",
            element: <Entries />,
            handle: { title: "金刚区入口" },
          },
          {
            path: "promo",
            element: <Promo />,
            handle: { title: "首页广告位" },
          },
        ],
      },
      // 系统管理
      {
        path: "/system",
        handle: { title: "系统管理" },
        children: [
          {
            index: true,
            element: <Setting />,
            handle: { title: "系统设置" },
          },
          {
            path: "logs",
            element: <Logs />,
            handle: { title: "操作日志" },
          },
        ],
      },
      // 权限管理
      {
        path: "/rbac",
        handle: { title: "权限管理" },
        children: [
          {
            path: "roles",
            element: <Roles />,
            handle: { title: "角色管理" },
          },
          {
            path: "menus",
            element: <Menus />,
            handle: { title: "菜单管理" },
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
    handle: { title: "登录" },
  },
  {
    path: "/403",
    element: (
      <RequireAuth>
        <Forbidden />
      </RequireAuth>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
