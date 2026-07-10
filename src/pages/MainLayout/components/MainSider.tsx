import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, type MenuProps } from "antd";

import MenuIcon from "@/components/MenuIcon";
import useMenuStore from "@/store/menuStore";
import type { MenuItem as AdminMenuItem } from "@/api/types";

import styles from "../index.module.scss";

type SiderMenuItem = Required<MenuProps>["items"][number];

const { Sider } = Layout;

const buildMenuItems = (menus: AdminMenuItem[] = []): SiderMenuItem[] => {
  return menus
    .filter((item) => item.type !== 3)
    .sort((a, b) => a.sort - b.sort)
    .map((item) => {
      const children = buildMenuItems(item.children);

      return {
        key: item.path || String(item.id),
        label: item.name,
        icon: <MenuIcon icon={item.icon} />,
        children: children.length ? children : undefined,
      };
    });
};

const collectRootSubmenuKeys = (items: SiderMenuItem[]) => {
  return items
    .filter((item): item is NonNullable<SiderMenuItem> => Boolean(item))
    .filter(
      (
        item,
      ): item is NonNullable<SiderMenuItem> & {
        key: string;
        children: NonNullable<SiderMenuItem>[];
      } =>
        typeof item === "object" &&
        "key" in item &&
        typeof item.key === "string" &&
        "children" in item &&
        Array.isArray(item.children),
    )
    .map((item) => item.key);
};

const createPathOpenKeyMap = (items: SiderMenuItem[]) => {
  const map = new Map<string, string>();

  const walk = (menuItems: SiderMenuItem[], parentKey?: string) => {
    for (const item of menuItems) {
      if (!item || typeof item !== "object" || typeof item.key !== "string") {
        continue;
      }

      if (parentKey && item.key.startsWith("/")) {
        map.set(item.key, parentKey);
      }

      if ("children" in item && Array.isArray(item.children)) {
        walk(item.children, item.key);
      }
    }
  };

  walk(items);
  return map;
};

const findOpenKey = (pathname: string, pathOpenKeyMap: Map<string, string>) => {
  let matchedKey: string | null = null;
  let matchedLength = -1;

  for (const [pathKey, openKey] of pathOpenKeyMap.entries()) {
    const isExactMatch = pathname === pathKey;
    const isNestedMatch = pathname.startsWith(`${pathKey}/`);

    if ((isExactMatch || isNestedMatch) && pathKey.length > matchedLength) {
      matchedKey = openKey;
      matchedLength = pathKey.length;
    }
  }

  return matchedKey;
};

const MainSider = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { menus } = useMenuStore();

  const items = useMemo(() => buildMenuItems(menus), [menus]);
  const rootSubmenuKeys = useMemo(() => collectRootSubmenuKeys(items), [items]);
  const pathOpenKeyMap = useMemo(() => createPathOpenKeyMap(items), [items]);

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    const openKey = findOpenKey(location.pathname, pathOpenKeyMap);
    const nextKeys = openKey ? [openKey] : [];

    setOpenKeys((currentKeys) => {
      if (
        currentKeys.length === nextKeys.length &&
        currentKeys.every((key, index) => key === nextKeys[index])
      ) {
        return currentKeys;
      }

      return nextKeys;
    });
  }, [location.pathname, pathOpenKeyMap]);

  const onMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (typeof key === "string" && key.startsWith("/")) {
      navigate(key);
    }
  };

  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    const nextKeys = keys as string[];
    const latestOpenKey = nextKeys.find((key) => !openKeys.includes(key));

    if (!latestOpenKey || !rootSubmenuKeys.includes(latestOpenKey)) {
      setOpenKeys(nextKeys);
      return;
    }

    setOpenKeys([latestOpenKey]);
  };

  return (
    <Sider className={styles["sider"]} width="250">
      <div className={styles["sider-top"]}>
        <img
          src="/src/assets/images/logo.png"
          alt="logo"
          className={styles["logo"]}
        />
        <div>
          <div className={styles["sider-title"]}>管理系统</div>
          <div className={styles["sider-label"]}>management system</div>
        </div>
      </div>

      <Menu
        selectedKeys={[location.pathname]}
        openKeys={openKeys}
        mode="inline"
        items={items}
        className={styles["menu"]}
        onClick={onMenuClick}
        onOpenChange={onOpenChange}
      />
    </Sider>
  );
};

export default MainSider;
