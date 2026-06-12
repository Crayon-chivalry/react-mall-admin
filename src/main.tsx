import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider,  App as AntdApp } from 'antd';

import { RouterProvider } from 'react-router-dom';
import router from './router';

import 'normalize.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 暂主题色更改，需要优化 */}
    <ConfigProvider theme={{token: {colorPrimary: '#0069C0'}}}>
      {/* 用于解决静态方法（如 message.success）无法访问 React 的 Context */}
      <AntdApp>
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  </StrictMode>,
)
