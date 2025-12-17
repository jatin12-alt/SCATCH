import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'scatch-theme';

const ThemeContext = createContext({
  theme: 'dark',
  themePreference: 'dark',
  setThemePreference: () => {},
  toggleTheme: () => {}
});

const getSystemTheme = () => (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

const getInitialPreference = () => {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  return 'system';
};

const resolveTheme = (preference) => (preference === 'system' ? getSystemTheme() : preference);

const ThemeProvider = ({ children }) => {
  const [themePreference, setThemePreference] = useState(getInitialPreference);
  const [theme, setTheme] = useState(() => resolveTheme(getInitialPreference()));

  useEffect(() => {
    const applied = resolveTheme(themePreference);
    setTheme(applied);
    document.documentElement.setAttribute('data-theme', applied);
    document.documentElement.setAttribute('data-theme-pref', themePreference);
    if (applied === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, themePreference);
  }, [themePreference]);

  useEffect(() => {
    if (themePreference !== 'system') return undefined;
    const media = window.matchMedia('(prefers-color-scheme: light)');
    const handler = (event) => setTheme(event.matches ? 'light' : 'dark');
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, [themePreference]);

  const value = useMemo(
    () => ({
      theme,
      themePreference,
      setThemePreference,
      toggleTheme: () => setThemePreference((pref) => (resolveTheme(pref) === 'dark' ? 'light' : 'dark'))
    }),
    [theme, themePreference]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider;

