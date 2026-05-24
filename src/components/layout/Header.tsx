import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, ChevronDown, Phone } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { getCategories, getSiteSettings } from '../../api/insforge';
import type { Category, SiteSettings } from '../../types';
import './Header.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({});
  const location = useLocation();
  const items = useCartStore((s) => s.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
    getSiteSettings().then(setSettings).catch(console.error);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsCategoryOpen(false);
  }, [location.pathname]);

  return (
    <header className="header">
      <div className="header-glass">
        <div className="container header-inner">
          {/* Logo */}
          <Link to="/" className="header-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src="/src/assets/logo-isogaspul.png" 
              alt="Isogaspul Racing" 
              className="logo-img"
              style={{ height: '50px', width: 'auto', filter: 'drop-shadow(0 0 10px rgba(227, 30, 36, 0.5))' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <span className="logo-text" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <strong style={{ 
                fontSize: '24px', 
                fontWeight: 900, 
                background: 'linear-gradient(135deg, #E31E24, #FFD700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '1px'
              }}>🏁 ISOGASPUL</strong>
              <small style={{ fontSize: '12px', color: '#C0C0C0', fontWeight: 600, letterSpacing: '0.5px' }}>Racing Shop Premium</small>
            </span>
          </Link>

          {/* Navigation */}
          <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
            
            {/* Products with Dropdown */}
            <div className="nav-dropdown">
              <button 
                className="nav-link dropdown-trigger"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              >
                Produk <ChevronDown size={16} />
              </button>
              {isCategoryOpen && (
                <div className="dropdown-menu">
                  <Link to="/produk" className="dropdown-item" onClick={() => setIsCategoryOpen(false)}>
                    Semua Produk
                  </Link>
                  {categories.map((cat) => (
                    <Link 
                      key={cat.id}
                      to={`/produk?category=${cat.slug}`}
                      className="dropdown-item"
                      onClick={() => setIsCategoryOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/testimoni" className="nav-link" onClick={() => setIsMenuOpen(false)}>Testimoni</Link>
            <Link to="/blog" className="nav-link" onClick={() => setIsMenuOpen(false)}>Blog</Link>
            <Link to="/tentang" className="nav-link" onClick={() => setIsMenuOpen(false)}>Tentang Kami</Link>
            <Link to="/kontak" className="nav-link" onClick={() => setIsMenuOpen(false)}>Kontak</Link>
          </nav>

          {/* Actions */}
          <div className="header-actions">
            {/* WA Button */}
            <a 
              href={`https://wa.me/${settings.whatsapp_number?.replace(/^0/, '62') || '6281394373007'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-btn-header"
            >
              <Phone size={18} />
            </a>

            {/* Cart */}
            <Link to="/keranjang" className="cart-btn">
              <ShoppingCart size={22} />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>

            {/* User */}
            {user ? (
              <Link to="/dashboard" className="user-btn">
                <User size={22} />
              </Link>
            ) : (
              <Link to="/login" className="user-btn">
                <User size={22} />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
