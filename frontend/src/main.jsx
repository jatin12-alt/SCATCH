import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import store from './store';
import './index.css';
import Layout from './components/Layout';
import ThemeProvider from './components/ThemeProvider';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import UserDashboardPage from './pages/UserDashboardPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import OwnerCreateProductPage from './pages/OwnerCreateProductPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import LoginPage from './pages/LoginPage';

const queryClient = new QueryClient();

const RootApp = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/shop" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/dashboard" element={<UserDashboardPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />
              <Route path="/owner/create" element={<OwnerCreateProductPage />} />
              <Route path="/owner/edit/:id" element={<OwnerCreateProductPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: 'var(--color-surface)', color: 'var(--color-text)' }
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  </Provider>
);

ReactDOM.createRoot(document.getElementById('root')).render(<RootApp />);