import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Layout } from 'antd';
import { HomeOutlined, UserOutlined, ShoppingOutlined, SettingOutlined, PictureOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

import styles from '../index.module.scss';

type MenuItem = Required<MenuProps>['items'][number];

const { Sider } = Layout;

const items: MenuItem[] = [
  {
    key: '/',
    label: '控制面板',
    icon: <HomeOutlined />,
  },
  {
    key: 'user',
    label: '会员管理',
    icon: <UserOutlined />,
    children: [{ key: '/user', label: '用户列表' }],
  },
  {
    key: 'shop',
    label: '商城管理',
    icon: <ShoppingOutlined />,
    children: [
      { key: '/shop', label: '商品列表' },
      { key: '/order', label: '订单列表' },
    ],
  },
  {
    key: '/slider',
    label: '轮播图管理',
    icon: <PictureOutlined />,
  },
  {
    key: '/setting',
    label: '系统管理',
    icon: <SettingOutlined />,
  },
];

// 记录所有有 children 的根菜单 key，用于 onOpenChange 的折叠规则判断
const rootSubmenuKeys = items
  .filter((item): item is NonNullable<MenuItem> => Boolean(item))
  .filter(
    (item): item is NonNullable<MenuItem> & { key: string; children: NonNullable<MenuItem>[] } =>
      typeof item === 'object' &&
      'key' in item &&
      typeof item.key === 'string' &&
      'children' in item &&
      Array.isArray(item.children),
  )
  .map((item) => item.key);

// 建立子路由 path -> 父菜单 key 的映射，便于通过路径定位需要展开的父菜单
const pathOpenKeyMap = new Map<string, string>();

for (const item of items) {
  if (
    !item ||
    typeof item !== 'object' ||
    !('key' in item) ||
    typeof item.key !== 'string' ||
    !('children' in item) ||
    !Array.isArray(item.children)
  ) {
    continue;
  }

  for (const child of item.children) {
    if (!child || typeof child !== 'object' || typeof child.key !== 'string') {
      continue;
    }

    pathOpenKeyMap.set(child.key, item.key);
  }
}

// 根据当前 pathname 查找应该展开的父菜单 key
// 规则：优先选择匹配路径中最长的那个（例如 '/shop/item' 应优先匹配 '/shop' 而不是 '/'）
const findOpenKey = (pathname: string) => {
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

  // 初始展开：基于当前 location.pathname 决定应该展开哪个父菜单
  const [openKeys, setOpenKeys] = useState<string[]>(() => {
    const openKey = findOpenKey(location.pathname);
    return openKey ? [openKey] : [];
  });

  // 当路由变化时同步 openKeys
  // 优化：只有在计算结果发生变化时才更新 state，避免无意义的 re-render
  useEffect(() => {
    const openKey = findOpenKey(location.pathname);
    setOpenKeys((currentKeys) => {
      const nextKeys = openKey ? [openKey] : [];
      if (
        currentKeys.length === nextKeys.length &&
        currentKeys.every((key, index) => key === nextKeys[index])
      ) {
        return currentKeys;
      }

      return nextKeys;
    });
  }, [location.pathname]);

  // 菜单项点击：跳转到对应路由（key 为字符串时）
  const onMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (typeof key === 'string') navigate(key);
  };

  // 控制子菜单展开行为：
  // - 若最新展开的 key 是根菜单（存在 children），则保持手风琴行为（只展开该根菜单）
  // - 否则直接按 keys 设置（允许展开多个子菜单）
  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const latestOpenKey = keys.find((key) => !openKeys.includes(key as string));

    if (!latestOpenKey || !rootSubmenuKeys.includes(latestOpenKey as string)) {
      setOpenKeys(keys as string[]);
      return;
    }

    setOpenKeys([latestOpenKey as string]);
  };

  return (
    <Sider className={styles['sider']} width="250">
      <div className={styles['sider-top']}>
        <img src="/src/assets/images/logo.png" alt="logo" className={styles['logo']} />
        <div>
          <div className={styles['sider-title']}>管理系统</div>
          <div className={styles['sider-label']}>management system</div>
        </div>
      </div>

      <Menu
        selectedKeys={[location.pathname]}
        openKeys={openKeys}
        mode="inline"
        items={items}
        className={styles['menu']}
        onClick={onMenuClick}
        onOpenChange={onOpenChange}
      />
    </Sider>
  );
};

export default MainSider;
