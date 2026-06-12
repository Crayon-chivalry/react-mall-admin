import { Outlet } from 'react-router-dom';

import { Layout } from 'antd';
import MainSider from './MainSider';
import MainHeader from './MainHeader'

import styles from './index.module.scss'

const { Content } = Layout;
const MainLayout = () => {
  return (
    <Layout>
      <MainSider></MainSider>
      <Layout>
        <MainHeader></MainHeader>
        <Content className={styles['content']}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout