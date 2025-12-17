import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import api from '../api/client';

export const useUserAuth = (options = {}) => {
  const { redirectToLogin = true } = options;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // If we already have user data in Redux, consider them authorized
    if (user) {
      setAuthorized(true);
      setChecking(false);
      return;
    }

    // Otherwise, check authentication with the server
    const checkAuth = async () => {
      try {
        // Try to access a protected route to verify authentication
        const response = await api.get('/users/dashboard');
        // If successful, the user is authenticated
        setAuthorized(true);
      } catch (error) {
        // If unauthorized, clear any stale auth data
        dispatch(logout());
        if (redirectToLogin) {
          navigate('/login', { replace: true });
        }
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [user, navigate, dispatch, redirectToLogin]);

  return { authorized, checking };
};