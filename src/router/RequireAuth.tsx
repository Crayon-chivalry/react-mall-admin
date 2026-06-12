import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useUserStore from '@/store/userStore';

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { isLoggedIn } = useUserStore();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
