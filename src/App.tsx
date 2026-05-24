// ============================================
// App.tsx — ISOGASPUL E-Commerce & Company Profile
// ============================================

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import FloatingWhatsApp from './components/layout/FloatingWhatsApp';
import HomePage from './pages/HomePage';
import ProductCatalogPage from './pages/ProductCatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import TestimonialsPage from './pages/TestimonialsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AddressesPage from './pages/AddressesPage';
import ProfilePage from './pages/ProfilePage';
import InvoicePage from './pages/InvoicePage';
import NotFoundPage from './pages/NotFoundPage';
import { useAuthStore } from './store/authStore';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductsAdmin from './pages/admin/ProductsAdmin';
import ProductForm from './pages/admin/ProductForm';
import OrdersAdmin from './pages/admin/OrdersAdmin';
import OrderDetailAdmin from './pages/admin/OrderDetailAdmin';
import CustomersAdmin from './pages/admin/CustomersAdmin';
import BlogsAdmin from './pages/admin/BlogsAdmin';
import BlogForm from './pages/admin/BlogForm';
import CategoriesAdmin from './pages/admin/CategoriesAdmin';
import SettingsAdmin from './pages/admin/SettingsAdmin';
import AnalyticsAdmin from './pages/admin/AnalyticsAdmin';
import AdminLoginPage from './pages/AdminLoginPage';
import './App.css';

function ProtectedRoute({ children, adminOnly }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, isInitialized } = useAuthStore();
  
  if (!isInitialized) {
    return <div className="loading-page"><div className="loader"></div></div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check admin role for admin-only routes
  if (adminOnly && user.role !== 'super_admin') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

// Wrapper component to conditionally show/hide header/footer
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app">
      {!isAdminRoute && <Header />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/produk" element={<ProductCatalogPage />} />
          <Route path="/produk/:slug" element={<ProductDetailPage />} />
          <Route path="/keranjang" element={<CartPage />} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/testimoni" element={<TestimonialsPage />} />
          <Route path="/tentang" element={<AboutPage />} />
          <Route path="/kontak" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/dashboard/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
          <Route path="/dashboard/addresses" element={<ProtectedRoute><AddressesPage /></ProtectedRoute>} />
          <Route path="/dashboard/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/dashboard/invoices/:number" element={<ProtectedRoute><InvoicePage /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route path="orders" element={<OrdersAdmin />} />
            <Route path="orders/:id" element={<OrderDetailAdmin />} />
            <Route path="customers" element={<CustomersAdmin />} />
            <Route path="blogs" element={<BlogsAdmin />} />
            <Route path="blogs/new" element={<BlogForm />} />
            <Route path="blogs/:id/edit" element={<BlogForm />} />
            <Route path="categories" element={<CategoriesAdmin />} />
            <Route path="analytics" element={<AnalyticsAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FloatingWhatsApp />}
    </div>
  );
}

function App() {
  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  return (
    <BrowserRouter>
      <ToastProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
