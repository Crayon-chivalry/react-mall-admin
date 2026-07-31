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
import GoodsForm from "@/pages/Shop/GoodsForm";
import Categorize from "@/pages/Shop/Categorize";
import Setting from "@/pages/Setting";
import Slider from "@/pages/Slider";
import Logs from "@/pages/Logs";
import NotFound from "@/pages/NotFound";
import Forbidden from "@/pages/Forbidden";
import Entries from "@/pages/Entries";
import Promo from "@/pages/Promo";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/user",
        element: <User />,
      },
      {
        path: "/admin-list",
        element: <AdminList />,
      },
      {
        path: "/roles",
        element: <Roles />,
      },
      {
        path: "/menus",
        element: <Menus />,
      },
      {
        path: "/shop",
        element: <Shop />,
      },
      {
        path: "/goods-form",
        element: <GoodsForm />,
      },
      {
        path: "/setting",
        element: <Setting />,
      },
      {
        path: "/slider",
        element: <Slider />,
      },
      {
        path: "/categorize",
        element: <Categorize />,
      },
      {
        path: "/logs",
        element: <Logs />,
      },
      {
        path: "/entries",
        element: <Entries />,
      },
      {
        path: "/promo",
        element: <Promo />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
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
