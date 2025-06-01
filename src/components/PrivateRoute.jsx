import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ publicPage = false, requiredRole }) => {
  const user = useSelector((state) => state.auth.user);

  // If it's a public page (like login/register)
  if (publicPage) {
    return user ? <Navigate to="/" /> : <Outlet />;
  }

  // If user is not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If a specific role is required and user doesn't have it
  if (requiredRole && !user.roles?.includes(requiredRole)) {
    return <Navigate to="/unauthorized" />;
  }

  // User is logged in and allowed
  return <Outlet />;
};

export default PrivateRoute;
