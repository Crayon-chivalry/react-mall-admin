import { useEffect, useMemo, useState } from "react";
import { useLocation, useMatches } from "react-router-dom";
import useUserStore from "@/store/userStore";
import useMenuStore from "@/store/menuStore";
import type { MenuItem as AdminMenuItem } from "@/api/types";

import { Layout, Breadcrumb, Dropdown, Flex } from "antd";
import type { MenuProps } from "antd";
import {
  BellOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import screenfull from "screenfull";

import styles from "../index.module.scss";

const { Header } = Layout;

// 下拉框列表
const items: MenuProps["items"] = [
  {
    key: '1',
    danger: true,
    label: '退出登录',
  }
]

/**
 * 从菜单树中查找与当前路径最匹配的节点链（从根到叶子）
 * 采用"最长前缀匹配"策略，确保子路由优先于父路由
 */
const findMenuPath = (
  menus: AdminMenuItem[],
  pathname: string,
): AdminMenuItem[] | null => {
  let bestChain: AdminMenuItem[] | null = null;
  let bestPathLength = -1;

  const walk = (items: AdminMenuItem[], ancestors: AdminMenuItem[]) => {
    for (const item of items) {
      // type=3 是按钮权限，跳过
      if (item.type === 3) continue;

      const itemPath = item.path || "";
      const currentChain = [...ancestors, item];

      if (itemPath) {
        const isMatch =
          pathname === itemPath || pathname.startsWith(`${itemPath}/`);

        if (isMatch && itemPath.length > bestPathLength) {
          bestChain = currentChain;
          bestPathLength = itemPath.length;
        }
      }

      // 继续向下递归，寻找更长的匹配
      if (item.children?.length) {
        walk(item.children, currentChain);
      }
    }
  };

  walk(menus, []);
  return bestChain;
};

interface HandleTitle {
  title?: string;
};

interface MainHeaderProps {
  collapsed: boolean;
  isMobile: boolean;
  mobileMenuOpen: boolean;
  onToggle: () => void;
  onMobileMenuToggle: () => void;
}

const MainHeader = ({
  collapsed,
  isMobile,
  mobileMenuOpen,
  onToggle,
  onMobileMenuToggle,
}: MainHeaderProps) => {
  const { user, signOut } = useUserStore();
  const { menus } = useMenuStore();
  const location = useLocation();
  const matches = useMatches();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!screenfull.isEnabled) return;

    const handleFullscreenChange = () => {
      setIsFullscreen(screenfull.isFullscreen);
    };

    handleFullscreenChange();
    screenfull.on("change", handleFullscreenChange);

    return () => {
      screenfull.off("change", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  };

  const menuClick: MenuProps["onClick"] = (menuItem) => {
    // 退出登录
    if (menuItem.key === '1') {
      signOut();
    }
  };

  const breadcrumbItems = useMemo(() => {
    const pathname = location.pathname;

    // 1. 优先从菜单树查找（层级最完整）
    const menuPath = findMenuPath(menus, pathname);
    if (menuPath && menuPath.length > 0) {
      return menuPath.map((node) => ({ title: node.name }));
    }

    // 2. 回退方案：使用路由 handle.title
    const routeTitles = matches
      .filter((m) => m.handle && (m.handle as HandleTitle).title)
      .map((m) => ({ title: (m.handle as HandleTitle).title as string }));

    if (routeTitles.length === 0) {
      return [{ title: "首页" }];
    }

    return routeTitles;
  }, [location.pathname, menus, matches]);

  return (
    <Header className={styles["header"]}>
      <Flex gap="middle">
        {isMobile ? (
          <MenuUnfoldOutlined
            className={styles["icon"]}
            onClick={onMobileMenuToggle}
            aria-label={mobileMenuOpen ? "关闭菜单" : "打开菜单"}
          />
        ) : (
          (collapsed ? (
            <MenuUnfoldOutlined onClick={onToggle} />
          ) : (
            <MenuFoldOutlined onClick={onToggle} />
          ))
        )}
        {!isMobile && <Breadcrumb items={breadcrumbItems} />}
      </Flex>
      <div className={styles["header-content"]}>
        {!isMobile && (
          <>
            {isFullscreen ? (
              <FullscreenExitOutlined
                className={styles["icon"]}
                onClick={toggleFullscreen}
              />
            ) : (
              <FullscreenOutlined
                className={styles["icon"]}
                onClick={toggleFullscreen}
              />
            )}
            <BellOutlined className={styles["icon"]} />
          </>
        )}
        {/* 头像，下拉框 */}
        <Dropdown menu={{ items, onClick: menuClick }}>
          <div className={styles["dropdown-row"]}>
            <div>{ user?.nickname }</div>
            <img src="/src/assets/images/logo.png" className={styles["avatar"]} />
            <DownOutlined />
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default MainHeader;
