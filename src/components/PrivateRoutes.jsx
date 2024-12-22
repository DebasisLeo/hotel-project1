import React, { useContext } from 'react';

import { Navigate,useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

const PrivateRoutes = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location=useLocation()

  if (loading) {
    return <div className="text-center py-20"><span className="loading loading-bars loading-lg"></span></div>;
  }

  return user ? children : <Navigate state={location.pathname} to="/auth/login" />;
};

export default PrivateRoutes;
