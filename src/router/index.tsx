import { createBrowserRouter } from 'react-router-dom';

import MainLayout from '@/pages/MainLayout';
import RequireAuth from './RequireAuth';
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import User from '@/pages/User'
import Shop from '@/pages/Shop'
import Setting from '@/pages/Setting'

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
        path: '/shop',
        element: <Shop />
      },
      {
        path: '/setting',
        element: <Setting />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  }
])

export default router