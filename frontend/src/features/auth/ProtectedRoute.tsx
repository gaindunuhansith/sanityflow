import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import type { UserRole } from './authSlice';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { token, user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const location = useLocation();

  if (!token || !isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // RBAC validation
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="p-10 flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized</h1>
        <p className="text-gray-500">You do not have permission to access this page.</p>
        <button
          onClick={() => globalThis.history.back()}
          className="mt-6 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return <Outlet />;
};
