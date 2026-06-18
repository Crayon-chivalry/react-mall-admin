import useUserStore from "@/store/userStore";

import { Layout, Breadcrumb, Dropdown } from "antd";
import type { MenuProps } from 'antd';
import { BellOutlined, QuestionCircleOutlined, DownOutlined } from '@ant-design/icons';

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

const MainHeader = () => {
  const { user, signOut } = useUserStore()
  
  const menuClick: MenuProps["onClick"] = (menuItem) => {
    // 退出登录
    if(menuItem.key === '1') {
      signOut()
    }
  }

  return (
    <Header className={styles["header"]}>
      <Breadcrumb
        items={[
          {
            title: "会员管理",
          },
          {
            title: "编辑会员",
          }
        ]}
      />
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
