import { createBrowserRouter } from 'react-router-dom';

import MainLayout from '@/pages/MainLayout';
import RequireAuth from './RequireAuth';
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import User from '@/pages/User'
import Roles from '@/pages/Rbac/index'
import Menus from '@/pages/Rbac/Menus'
import Permissions from '@/pages/Rbac/Permissions'
import Shop from '@/pages/Shop'
import Categorize from '@/pages/Shop/Categorize'
import Setting from '@/pages/Setting'
import Slider from '@/pages/Slider'
import Logs from '@/pages/Logs'
import NotFound from '@/pages/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: '/user',
        element: <User />
      },
      {
        path: '/roles',
        element: <Roles />
      },
      {
        path: '/permissions',
        element: <Permissions />
      },
      {
        path: '/Menus',
        element: <Menus />
      },
      {
        path: '/shop',
        element: <Shop />
      },
      {
        path: '/setting',
        element: <Setting />
      },
      {
        path: '/slider',
        element: <Slider />
      },
      {
        path: '/categorize',
        element: <Categorize />
      },
      {
        path: '/logs',
        element: <Logs />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '*',
    element: <NotFound />
  }
])

export default router