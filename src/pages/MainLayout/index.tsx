import { useEffect, useMemo, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Layout, Spin } from "antd";
import useMenuStore from "@/store/menuStore";
import type { MenuItem } from "@/api/types";

import MainSider from "./components/MainSider";
import MainHeader from "./components/MainHeader";

import styles from "./index.module.scss";
import { rbacApi } from "@/api/rbacApi";


const { Content } = Layout;

const collectAllowedPaths = (menus: MenuItem[] = []): string[] => {
  return menus.flatMap((item) => {
    const currentPath = item.type === 2 && item.path ? [item.path] : [];
    return [...currentPath, ...collectAllowedPaths(item.children)];
  });
};

const hasRoutePermission = (pathname: string, allowedPaths: string[]) => {
  if (pathname === "/") return true;

  return allowedPaths.some((path) => {
    if (pathname === path) return true;
    return pathname.startsWith(`${path}/`);
  });
};

const MainLayout = () => {
  const location = useLocation();
  const { menus, setMenus } = useMenuStore();
  const [loading, setLoading] = useState(true);

  const getRouters = async () => {
    try {
      const { data: res } = await rbacApi.routers();
      setMenus(res.data);
    } finally {
      setLoading(false);
    }
  };

  const allowedPaths = useMemo(() => collectAllowedPaths(menus), [menus]);
  const canAccessCurrentRoute = hasRoutePermission(location.pathname, allowedPaths);

  useEffect(() => {
    getRouters();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!canAccessCurrentRoute) {
    return <Navigate to="/403" replace />;
  }

  return (
    <Layout>
      <MainSider></MainSider>
      <Layout>
        <MainHeader></MainHeader>
        <Content className={styles["content"]}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
