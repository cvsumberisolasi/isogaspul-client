// ============================================
// Admin Layout Component — ISOGASPUL
// ============================================

import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  FolderTree, 
  Settings, 
  BarChart3,
  LogOut,
  Search,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import '../styles/admin.css';

const adminNavItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/products', icon: Package, label: 'Products' },
  { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { path: '/admin/customers', icon: Users, label: 'Customers' },
  { path: '/admin/blogs', icon: FileText, label: 'Blog' },
  { path: '/admin/categories', icon: FolderTree, label: 'Categories' },
  { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    return paths.map((path, index) => ({
      label: path.charAt(0).toUpperCase() + path.slice(1),
      path: '/' + paths.slice(0, index + 1).join('/')
    }));
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-logo">
            <Package size={24} />
            ISOGASPUL
          </Link>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-section">
            <div className="admin-nav-title">Main</div>
            {adminNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={20} className="admin-nav-icon" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="admin-nav-section">
            <button onClick={handleLogout} className="admin-nav-item" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}>
              <LogOut size={20} className="admin-nav-icon" />
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Top Bar */}
        <header className="admin-topbar">
          <div className="admin-breadcrumb">
            <button 
              className="admin-btn-icon admin-btn-secondary"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ marginRight: '1rem' }}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            {getBreadcrumbs().map((crumb, index) => (
              <span key={crumb.path}>
                {index > 0 && <span className="admin-breadcrumb-separator">/</span>}
                <Link to={crumb.path}>{crumb.label}</Link>
              </span>
            ))}
          </div>

          <div className="admin-topbar-actions">
            <div className="admin-search">
              <Search size={16} className="admin-search-icon" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="admin-search-input"
              />
            </div>

            <button className="admin-btn-icon admin-btn-secondary">
              <Bell size={20} />
            </button>

            <div className="admin-user-menu">
              <div className="admin-user-avatar">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="admin-user-info">
                <div className="admin-user-name">{user?.name || 'Admin'}</div>
                <div className="admin-user-role">Super Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
