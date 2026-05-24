// ============================================
// Orders Admin Page — ISOGASPUL RACING
// ============================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, Eye, ShoppingCart, ChevronRight, Truck, Info } from 'lucide-react';
import type { Order } from '../../types';
import { getOrders, formatPrice, updateOrderStatus, updateOrderShipping } from '../../api/insforge';
import { updateOrderStatus as adminUpdateStatus } from '../../api/adminApi';

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [shippingModal, setShippingModal] = useState<{ orderId: string; currentCost: number; orderNumber: string } | null>(null);
  const [shippingCost, setShippingCost] = useState('');
  const itemsPerPage = 20;

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus as Order['status'] } : order
      ));
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Gagal mengupdate status pesanan');
    }
  };

  const handleShippingUpdate = async () => {
    if (!shippingModal || !shippingCost) return;
    try {
      const cost = parseInt(shippingCost, 10);
      if (isNaN(cost) || cost < 0) { alert('Biaya kirim harus berupa angka positif'); return; }
      await updateOrderShipping(shippingModal.orderId, cost);
      setOrders(prev => prev.map(order =>
        order.id === shippingModal.orderId
          ? { ...order, shipping_cost: cost, total: order.subtotal + cost, status: 'confirmed' as Order['status'] }
          : order
      ));
      setShippingModal(null);
      setShippingCost('');
    } catch (error) {
      console.error('Failed to update shipping:', error);
      alert('Gagal mengupdate biaya kirim');
    }
  };

  const getStatusStyle = (status: string) => {
    const styles: Record<string, { bg: string; color: string }> = {
      pending: { bg: 'rgba(234, 179, 8, 0.2)', color: '#EAB308' },
      confirmed: { bg: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6' },
      processing: { bg: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6' },
      shipped: { bg: 'rgba(34, 197, 94, 0.2)', color: '#22C55E' },
      delivered: { bg: 'rgba(34, 197, 94, 0.2)', color: '#22C55E' },
      cancelled: { bg: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' },
    };
    return styles[status] || { bg: 'rgba(148, 163, 184, 0.2)', color: '#94A3B8' };
  };

  const getStatusBadge = (status: string) => {
    const style = getStatusStyle(status);
    const labels: Record<string, string> = {
      pending: 'Menunggu', confirmed: 'Dikonfirmasi', processing: 'Diproses',
      shipped: 'Dikirim', delivered: 'Selesai', cancelled: 'Dibatalkan',
    };
    return (
      <span style={{ padding: '4px 12px', background: style.bg, color: style.color, borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
        {labels[status] || status}
      </span>
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid var(--racing-gray-light)', borderTopColor: 'var(--racing-red)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ color: 'var(--racing-white)', fontSize: '32px', fontWeight: 900, marginBottom: '8px', background: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            🛒 Pesanan
          </h1>
          <p style={{ color: 'var(--racing-silver)', fontSize: '16px' }}>Kelola pesanan pelanggan</p>
        </div>
        <button style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '12px 24px', 
          background: 'var(--racing-black)', 
          border: '1px solid var(--racing-gray-light)', 
          borderRadius: '8px', 
          color: 'var(--racing-silver)', 
          fontSize: '14px', 
          fontWeight: 600, 
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>
          <Download size={20} />
          Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {[
          { label: 'Total Pesanan', value: orders.length, color: '#3B82F6' },
          { label: 'Menunggu', value: orders.filter(o => o.status === 'pending').length, color: '#EAB308' },
          { label: 'Selesai', value: orders.filter(o => o.status === 'delivered').length, color: '#22C55E' },
          { label: 'Dibatalkan', value: orders.filter(o => o.status === 'cancelled').length, color: '#EF4444' },
        ].map((stat) => (
          <div key={stat.label} style={{ 
            padding: '20px', 
            background: 'var(--racing-gray)', 
            borderRadius: '12px', 
            border: '1px solid var(--racing-gray-light)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.borderColor = stat.color;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--racing-gray-light)';
          }}
          >
            <div style={{ color: 'var(--racing-silver)', fontSize: '14px', marginBottom: '8px' }}>{stat.label}</div>
            <div style={{ color: stat.color, fontSize: '24px', fontWeight: 900 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ 
        padding: '24px', 
        background: 'var(--racing-gray)', 
        borderRadius: '12px', 
        marginBottom: '24px',
        border: '1px solid var(--racing-gray-light)'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--racing-silver)' }} />
            <input
              type="text"
              placeholder="Cari nomor pesanan atau nama pelanggan..."
              style={{ 
                width: '100%', 
                padding: '12px 16px 12px 44px', 
                background: 'var(--racing-black)', 
                border: '1px solid var(--racing-gray-light)', 
                borderRadius: '8px', 
                color: 'var(--racing-white)', 
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--racing-red)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--racing-gray-light)'}
            />
          </div>
          <select
            style={{ 
              width: '200px', 
              padding: '12px 16px', 
              background: 'var(--racing-black)', 
              border: '1px solid var(--racing-gray-light)', 
              borderRadius: '8px', 
              color: 'var(--racing-white)', 
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer'
            }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="confirmed">Dikonfirmasi</option>
            <option value="processing">Diproses</option>
            <option value="shipped">Dikirim</option>
            <option value="delivered">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ 
        background: 'var(--racing-gray)', 
        borderRadius: '12px', 
        border: '1px solid var(--racing-gray-light)', 
        overflow: 'hidden' 
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--racing-gray-light)' }}>
              {['No. Pesanan', 'Pelanggan', 'Tanggal', 'Total', 'Ongkir', 'Status', 'Aksi'].map((header) => (
                <th key={header} style={{ 
                  padding: '16px', 
                  textAlign: 'left', 
                  color: 'var(--racing-silver)', 
                  fontSize: '14px', 
                  fontWeight: 600, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em' 
                }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: 'var(--racing-silver)' }}>
                  <ShoppingCart size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                  <p>Tidak ada pesanan ditemukan</p>
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--racing-gray-light)', transition: 'all 0.3s ease' }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <td style={{ padding: '16px', color: 'var(--racing-white)', fontSize: '14px', fontWeight: 700 }}>
                    {order.order_number || `#${order.id.slice(0, 8)}`}
                  </td>
                  <td style={{ padding: '16px', color: 'var(--racing-silver)', fontSize: '14px' }}>
                    {order.customer_name || order.customer_email || '-'}
                  </td>
                  <td style={{ padding: '16px', color: 'var(--racing-silver)', fontSize: '14px' }}>
                    {order.created_at ? new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                  </td>
                  <td style={{ padding: '16px', color: 'var(--racing-yellow)', fontSize: '14px', fontWeight: 700 }}>
                    {formatPrice(order.total || 0)}
                  </td>
                  <td style={{ padding: '16px', color: 'var(--racing-silver)', fontSize: '14px' }}>
                    {(order.shipping_cost && order.shipping_cost > 0) ? formatPrice(order.shipping_cost) : (
                      <button onClick={() => setShippingModal({ orderId: order.id, currentCost: order.shipping_cost || 0, orderNumber: order.order_number || order.id.slice(0, 8) })}
                        style={{ padding: '4px 12px', background: 'rgba(234,179,8,0.2)', color: '#EAB308', border: '1px solid #EAB308', borderRadius: '20px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                        <Truck size={12} /> Set Ongkir
                      </button>
                    )}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{ padding: '6px 12px', background: getStatusStyle(order.status).bg, color: getStatusStyle(order.status).color, border: `1px solid ${getStatusStyle(order.status).color}`, borderRadius: '20px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                      <option value="pending">Menunggu</option>
                      <option value="confirmed">Dikonfirmasi</option>
                      <option value="processing">Diproses</option>
                      <option value="shipped">Dikirim</option>
                      <option value="delivered">Selesai</option>
                      <option value="cancelled">Dibatalkan</option>
                    </select>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <Link 
                      to={`/admin/orders/${order.id}`} 
                      style={{ 
                        padding: '8px', 
                        background: 'var(--racing-black)', 
                        borderRadius: '6px', 
                        color: 'var(--racing-silver)', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        textDecoration: 'none'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = 'var(--racing-red)';
                        e.currentTarget.style.color = 'var(--racing-white)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'var(--racing-black)';
                        e.currentTarget.style.color = 'var(--racing-silver)';
                      }}
                    >
                      <Eye size={14} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', padding: '20px' }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{ padding: '10px 16px', background: 'var(--racing-gray)', border: '1px solid var(--racing-gray-light)', borderRadius: '8px', color: currentPage === 1 ? 'var(--racing-silver)' : 'var(--racing-white)', fontSize: '14px', fontWeight: 600, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
            Previous
          </button>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  style={{ width: '40px', height: '40px', background: currentPage === pageNum ? 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)' : 'var(--racing-gray)', border: `1px solid ${currentPage === pageNum ? 'transparent' : 'var(--racing-gray-light)'}`, borderRadius: '8px', color: currentPage === pageNum ? 'var(--racing-white)' : 'var(--racing-silver)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{ padding: '10px 16px', background: 'var(--racing-gray)', border: '1px solid var(--racing-gray-light)', borderRadius: '8px', color: currentPage === totalPages ? 'var(--racing-silver)' : 'var(--racing-white)', fontSize: '14px', fontWeight: 600, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Shipping Cost Modal */}
      {shippingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
          onClick={() => setShippingModal(null)}>
          <div style={{ background: 'var(--racing-gray)', borderRadius: '16px', border: '1px solid var(--racing-gray-light)', padding: '32px', width: '440px', maxWidth: '90vw' }}
            onClick={e => e.stopPropagation()}>
            <h3 style={{ color: 'var(--racing-white)', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
              <Truck size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Set Biaya Kirim
            </h3>
            <p style={{ color: 'var(--racing-silver)', fontSize: '14px', marginBottom: '24px' }}>
              Pesanan: <strong style={{ color: 'var(--racing-white)' }}>{shippingModal.orderNumber}</strong>
            </p>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: 'var(--racing-silver)', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Biaya Kirim (Rp)</label>
              <input type="number" value={shippingCost} onChange={e => setShippingCost(e.target.value)}
                placeholder="Masukkan biaya kirim" min="0"
                style={{ width: '100%', padding: '12px', background: 'var(--racing-black)', border: '1px solid var(--racing-gray-light)', borderRadius: '8px', color: 'var(--racing-white)', fontSize: '16px', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShippingModal(null)}
                style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--racing-gray-light)', borderRadius: '8px', color: 'var(--racing-silver)', fontWeight: 600, cursor: 'pointer' }}>
                Batal
              </button>
              <button onClick={handleShippingUpdate}
                style={{ padding: '10px 20px', background: 'var(--gradient-racing)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
                Simpan & Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
