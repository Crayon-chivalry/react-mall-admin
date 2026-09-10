import { useMemo } from "react";
import { useLocation, useMatches } from "react-router-dom";
import useUserStore from "@/store/userStore";
import useMenuStore from "@/store/menuStore";
import type { MenuItem as AdminMenuItem } from "@/api/types";

import { Layout, Breadcrumb, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { BellOutlined, QuestionCircleOutlined, DownOutlined } from "@ant-design/icons";

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

const MainHeader = () => {
  const { user, signOut } = useUserStore();
  const { menus } = useMenuStore();
  const location = useLocation();
  const matches = useMatches();

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
      <Breadcrumb items={breadcrumbItems} />
      <div className={styles["header-content"]}>
        <QuestionCircleOutlined className={styles["icon"]} />
        <BellOutlined className={styles["icon"]} />
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
