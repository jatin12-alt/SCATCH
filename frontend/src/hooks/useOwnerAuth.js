import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

const OWNER_TOKEN_KEY = 'scatch_owner_token';

export const useOwnerAuth = (options = {}) => {
  const { redirectToLogin = true } = options;
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(OWNER_TOKEN_KEY);
    if (!token) {
      setChecking(false);
      if (redirectToLogin) navigate('/owner', { replace: true });
      return;
    }

    api
      .get('/owner/auth/validate')
      .then(() => setAuthorized(true))
      .catch(() => {
        localStorage.removeItem(OWNER_TOKEN_KEY);
        if (redirectToLogin) navigate('/owner', { replace: true });
      })
      .finally(() => setChecking(false));
  }, [navigate, redirectToLogin]);

  return { authorized, checking };
};

export const storeOwnerToken = (token) => localStorage.setItem(OWNER_TOKEN_KEY, token);
export const clearOwnerToken = () => localStorage.removeItem(OWNER_TOKEN_KEY);
