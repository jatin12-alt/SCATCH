import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOwner?: boolean;
}

/**
 * Higher-order component to guard sensitive routes.
 * Redirects to login if no active account is found.
 */
export default function ProtectedRoute({ children, requireOwner = false }: ProtectedRouteProps) {
  const { account, isAuthenticating } = useAppSelector((state) => state.auth);

  // Still checking the session? Show a spinner.
  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-stone-900 border-stone-200"></div>
      </div>
    );
  }

  // Not logged in? Kick them to the login page.
  if (!account) {
    return <Navigate to="/login" replace />;
  }

  // Owner only page, but user is just a regular customer? Send them home.
  if (requireOwner && account.role !== 'owner') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
