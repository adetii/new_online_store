import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import { initSessionTracking, clearSessionTimer } from './utils/sessionUtils';
import ScrollToTop from './components/utils/ScrollToTop';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import HomePage from './pages/HomePage';
import SearchScreen from './pages/SearchScreen';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
import OrdersPage from './pages/OrdersPage';

import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import ReturnPolicy from './pages/ReturnPolicy';

import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

import NotFoundPage from './pages/NotFoundPage';

import PrivateRoute from './components/routes/PrivateRoute';
import AdminRoute from './components/routes/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';

import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductListPage from './pages/admin/AdminProductListPage';
import AdminProductCreatePage from './pages/admin/AdminProductCreatePage';
import AdminProductEditPage from './pages/admin/AdminProductEditPage';
import AdminOrderListPage from './pages/admin/AdminOrderListPage';
import AdminUserListPage from './pages/admin/AdminUserListPage';
import AdminUserEditPage from './pages/admin/AdminUserEditPage';

import AdminOrderPage from './pages/admin/AdminOrderPage';

// Customer route wrapper component to prevent admin access
const CustomerRouteWrapper = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  
  // If user is admin, redirect to admin dashboard
  if (userInfo?.isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return children;
};

const App = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // session tracking
  useEffect(() => {
    if (userInfo) initSessionTracking();
    else clearSessionTimer();
    return () => clearSessionTimer();
  }, [userInfo]);

  return (
    <Router>
      <ScrollToTop />
      <Toaster
        position="top-center"
        toastOptions={{ duration: 3000, style: { color: '#000' } }}
      />

      <Routes>
        {/* ─── PUBLIC LAYOUT ─────────────────────────────────────────────── */}
        <Route
          path="/"
          element={
            <CustomerRouteWrapper>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="container mx-auto px-4 py-8 flex-grow">
                  <Outlet />
                </main>
                <Footer />
              </div>
            </CustomerRouteWrapper>
          }
        >
          {/* Home & filtering */}
          <Route index element={<HomePage />} />
          <Route path="search/:keyword" element={<SearchScreen />} />
          <Route
            path="search/:keyword/page/:pageNumber"
            element={<SearchScreen />}
          />
          <Route path="category/:category" element={<HomePage />} />
          <Route
            path="search/:keyword/category/:category"
            element={<HomePage />}
          />

          {/* Product / Cart / Auth */}
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="product/:id/:name" element={<ProductPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          {/* Footer pages */}
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="return-policy" element={<ReturnPolicy />} />

          {/* Auth-protected */}
          <Route element={<PrivateRoute />}>
            <Route path="shipping" element={<ShippingPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="placeorder" element={<PlaceOrderPage />} />
            <Route path="order/:id" element={<OrderPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="wishlist" element={<WishlistPage />} />
          </Route>

          {/* Password reset */}
          <Route path="forgotpassword" element={<ForgotPasswordPage />} />
          <Route
            path="resetpassword/:resettoken"
            element={<ResetPasswordPage />}
          />
        </Route>

        {/* ─── ADMIN SECTION ─────────────────────────────────────────────── */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductListPage />} />
          <Route path="product/create" element={<AdminProductCreatePage />} />
          <Route path="product/:id/edit" element={<AdminProductEditPage />} />
          <Route path="orders" element={<AdminOrderListPage />} />
          <Route path="order/:id" element={<AdminOrderPage />} />
          <Route path="users" element={<AdminUserListPage />} />
          <Route path="users/:userId/edit" element={<AdminUserEditPage />} />
        </Route>

        {/* ─── 404 ───────────────────────────────────────────────────────── */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ToastContainer />
    </Router>
  );
};

export default App;

