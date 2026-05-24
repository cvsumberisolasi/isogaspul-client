import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, MapPin, User, LogOut, ShoppingBag, FileText, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getOrders, formatPrice } from '../api/insforge';
import type { Order } from '../types';
import './DashboardPage.css';
import '../styles/racing-theme.css';

const statusLabels: Record<string, string> = {
  pending: 'Menunggu', confirmed: 'Dikonfirmasi', processing: 'Diproses',
  shipped: 'Dikirim', delivered: 'Selesai', cancelled: 'Dibatalkan',
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) getOrders(user.id).then(setOrders).catch(console.error);
  }, [user]);

  const handleLogout = async () => { await logout(); navigate('/'); };
  if (!user) return null;

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const completedCount = orders.filter(o => o.status === 'delivered').length;
  const totalSpent = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);

  return (
    <div className="dashboard-page" style={{ background: 'var(--racing-black)', minHeight: '100vh', paddingTop: '80px' }}>
      <div className="container" style={{ padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }}>
          <aside className="racing-card" style={{ padding: '24px', height: 'fit-content', position: 'sticky', top: '100px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--racing-gray-light)' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--gradient-racing)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 900, color: 'var(--racing-white)', margin: '0 auto 16px' }}>
                {user.name?.charAt(0) || 'U'}
              </div>
              <h3 style={{ color: 'var(--racing-white)', fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{user.name || 'User'}</h3>
              <p style={{ color: 'var(--racing-silver)', fontSize: '14px' }}>{user.email}</p>
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'overview', label: 'Ringkasan', icon: ShoppingBag },
                { id: 'orders', label: 'Riwayat Pesanan', icon: Package },
                { id: 'invoices', label: 'Invoice', icon: FileText },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: activeTab === tab.id ? 'var(--gradient-racing)' : 'transparent', border: activeTab === tab.id ? '1px solid var(--racing-red)' : '1px solid transparent', borderRadius: '8px', color: activeTab === tab.id ? 'var(--racing-white)' : 'var(--racing-silver)', fontSize: '14px', fontWeight: activeTab === tab.id ? 700 : 400, cursor: 'pointer', transition: 'all 0.3s ease', width: '100%', textAlign: 'left' }}>
                  <tab.icon size={18} /><span style={{ flex: 1 }}>{tab.label}</span><ChevronRight size={16} />
                </button>
              ))}
              <Link to="/dashboard/addresses"
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'transparent', border: '1px solid transparent', borderRadius: '8px', color: 'var(--racing-silver)', fontSize: '14px', fontWeight: 400, textDecoration: 'none' }}>
                <MapPin size={18} /><span style={{ flex: 1 }}>Alamat Saya</span><ChevronRight size={16} />
              </Link>
              <Link to="/dashboard/profile"
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'transparent', border: '1px solid transparent', borderRadius: '8px', color: 'var(--racing-silver)', fontSize: '14px', fontWeight: 400, textDecoration: 'none' }}>
                <User size={18} /><span style={{ flex: 1 }}>Profil Saya</span><ChevronRight size={16} />
              </Link>
              <button onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'transparent', border: '1px solid var(--racing-gray-light)', borderRadius: '8px', color: 'var(--racing-red)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginTop: '16px', width: '100%' }}>
                <LogOut size={18} /> Keluar
              </button>
            </nav>
          </aside>

          <div>
            {activeTab === 'overview' && (
              <>
                <div className="racing-section-header" style={{ marginBottom: '32px' }}>
                  <h1>🏁 Ringkasan Dashboard</h1>
                  <p>Selamat datang kembali, {user.name}!</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                  <div className="racing-card" style={{ padding: '24px' }}>
                    <Package size={32} style={{ color: 'var(--racing-red)', marginBottom: '12px' }} />
                    <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--racing-white)', marginBottom: '4px' }}>{orders.length}</div>
                    <div style={{ color: 'var(--racing-silver)', fontSize: '14px' }}>Total Pesanan</div>
                  </div>
                  <div className="racing-card" style={{ padding: '24px' }}>
                    <ShoppingBag size={32} style={{ color: 'var(--racing-yellow)', marginBottom: '12px' }} />
                    <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--racing-white)', marginBottom: '4px' }}>{pendingCount}</div>
                    <div style={{ color: 'var(--racing-silver)', fontSize: '14px' }}>Menunggu</div>
                  </div>
                  <div className="racing-card" style={{ padding: '24px' }}>
                    <Package size={32} style={{ color: '#22C55E', marginBottom: '12px' }} />
                    <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--racing-white)', marginBottom: '4px' }}>{completedCount}</div>
                    <div style={{ color: 'var(--racing-silver)', fontSize: '14px' }}>Selesai</div>
                  </div>
                  <div className="racing-card" style={{ padding: '24px' }}>
                    <FileText size={32} style={{ color: 'var(--racing-red)', marginBottom: '12px' }} />
                    <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--racing-white)', marginBottom: '4px' }}>{formatPrice(totalSpent)}</div>
                    <div style={{ color: 'var(--racing-silver)', fontSize: '14px' }}>Total Belanja</div>
                  </div>
                </div>
                <div className="racing-section-header" style={{ marginBottom: '24px' }}>
                  <h2>📦 Pesanan Terakhir</h2>
                </div>
                {orders.length === 0 ? (
                  <div className="racing-card" style={{ padding: '60px', textAlign: 'center' }}>
                    <ShoppingBag size={64} style={{ color: 'var(--racing-gray)', marginBottom: '24px' }} />
                    <h3 style={{ color: 'var(--racing-white)', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Belum ada pesanan</h3>
                    <p style={{ color: 'var(--racing-silver)', marginBottom: '24px' }}>Mulai belanja produk peredam suara terbaik</p>
                    <Link to="/produk" className="btn-racing">Mulai Belanja</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {orders.slice(0, 5).map(order => (
                      <Link key={order.id} to={`/dashboard/orders/${order.id}`}
                        className="racing-card racing-stripe" style={{ padding: '20px', display: 'block', textDecoration: 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ color: 'var(--racing-white)', fontSize: '16px', fontWeight: 700 }}>{order.order_number}</span>
                          <span className="racing-badge">{statusLabels[order.status] || order.status}</span>
                        </div>
                        <div style={{ color: 'var(--racing-silver)', fontSize: '14px', marginBottom: '12px' }}>
                          {order.items?.slice(0, 2).map((item, i) => <div key={i}>{item.product_name} x{item.quantity}</div>)}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--racing-gray-light)' }}>
                          <span style={{ color: 'var(--racing-yellow)', fontSize: '18px', fontWeight: 700 }}>{formatPrice(order.total)}</span>
                          <span style={{ color: 'var(--racing-silver)', fontSize: '12px' }}>{order.created_at ? new Date(order.created_at).toLocaleDateString('id-ID') : '-'}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'orders' && (
              <>
                <div className="racing-section-header" style={{ marginBottom: '24px' }}>
                  <h1>📦 Riwayat Pesanan</h1>
                  <p>Semua pesanan Anda</p>
                </div>
                {orders.length === 0 ? (
                  <div className="racing-card" style={{ padding: '60px', textAlign: 'center' }}>
                    <Package size={64} style={{ color: 'var(--racing-gray)', marginBottom: '24px' }} />
                    <h3 style={{ color: 'var(--racing-white)', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Belum ada pesanan</h3>
                    <Link to="/produk" className="btn-racing">Mulai Belanja</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {orders.map(order => (
                      <Link key={order.id} to={`/dashboard/orders/${order.id}`}
                        className="racing-card racing-stripe" style={{ padding: '20px', display: 'block', textDecoration: 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ color: 'var(--racing-white)', fontSize: '16px', fontWeight: 700 }}>{order.order_number}</span>
                          <span className="racing-badge">{statusLabels[order.status] || order.status}</span>
                        </div>
                        <div style={{ color: 'var(--racing-silver)', fontSize: '14px', marginBottom: '12px' }}>
                          {order.items?.map((item, i) => <div key={i}>{item.product_name} x{item.quantity} — {formatPrice(item.price || 0)}</div>)}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--racing-gray-light)' }}>
                          <span style={{ color: 'var(--racing-yellow)', fontSize: '18px', fontWeight: 700 }}>{formatPrice(order.total)}</span>
                          <span style={{ color: 'var(--racing-silver)', fontSize: '12px' }}>{order.created_at ? new Date(order.created_at).toLocaleDateString('id-ID') : '-'}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'invoices' && (
              <>
                <div className="racing-section-header" style={{ marginBottom: '24px' }}>
                  <h1>📄 Invoice</h1>
                  <p>Daftar invoice pesanan Anda</p>
                </div>
                {orders.length === 0 ? (
                  <div className="racing-card" style={{ padding: '60px', textAlign: 'center' }}>
                    <FileText size={64} style={{ color: 'var(--racing-gray)', marginBottom: '24px' }} />
                    <h3 style={{ color: 'var(--racing-white)', fontSize: '24px', fontWeight: 700 }}>Belum ada invoice</h3>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {orders.map(order => (
                      <div key={order.id} className="racing-card" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <span style={{ color: 'var(--racing-white)', fontSize: '16px', fontWeight: 700 }}>{order.order_number}</span>
                          <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: 'rgba(234,179,8,0.2)', color: '#EAB308' }}>
                            {statusLabels[order.status] || order.status}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: 'var(--racing-yellow)', fontSize: '20px', fontWeight: 700 }}>{formatPrice(order.total)}</span>
                          <Link to={`/dashboard/invoices/${order.order_number}`}
                            className="btn-racing" style={{ fontSize: '14px', padding: '8px 20px' }}>
                            <FileText size={14} /> Lihat Invoice
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}