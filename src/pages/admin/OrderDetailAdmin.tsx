import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, FileText, Truck } from 'lucide-react';
import type { Order } from '../../types';
import { getOrders, formatPrice, updateOrderShipping } from '../../api/insforge';
import { updateOrderStatus } from '../../api/adminApi';

const statusLabels: Record<string, string> = { pending: 'Menunggu', confirmed: 'Dikonfirmasi', processing: 'Diproses', shipped: 'Dikirim', delivered: 'Selesai', cancelled: 'Dibatalkan' };

export default function OrderDetailAdmin() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [shippingCost, setShippingCost] = useState('');

  useEffect(() => { loadOrder(); }, [id]);

  const loadOrder = async () => {
    try { setLoading(true); const orders = await getOrders(); const found = orders.find(o => o.id === id); if (found) { setOrder(found); setNewStatus(found.status); } } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleUpdateStatus = async () => {
    if (!order || !newStatus) return;
    try {
      setUpdating(true);
      const costNum = shippingCost ? parseInt(shippingCost, 10) : undefined;
      await updateOrderStatus(order.id, newStatus, notes, costNum);
      if (costNum && costNum > 0) { try { await updateOrderShipping(order.id, costNum); } catch {} }
      loadOrder(); setNotes(''); setShippingCost('');
    } catch (error) { alert(`Gagal: ${error instanceof Error ? error.message : 'Unknown'}`); } finally { setUpdating(false); }
  };

  const getStatusColor = (status: string) => ({ pending: '#EAB308', confirmed: '#3B82F6', processing: '#3B82F6', shipped: '#22C55E', delivered: '#22C55E', cancelled: '#EF4444' } as any)[status] || '#94A3B8';

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /></div>;
  if (!order) return <div className="admin-empty-state"><h3>Pesanan tidak ditemukan</h3><button onClick={() => navigate('/admin/orders')} className="admin-btn admin-btn-primary">Kembali</button></div>;

  const shippingAddress = typeof order.shipping_address === 'string' ? null : order.shipping_address;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <button onClick={() => navigate('/admin/orders')} className="admin-btn admin-btn-sm admin-btn-secondary" style={{ marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} /> Kembali ke Pesanan
          </button>
          <h1 className="admin-page-title">Pesanan {order.order_number}</h1>
          <p className="admin-page-subtitle">{order.created_at ? new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div>
          <div className="admin-card">
            <div className="admin-card-header"><h3 className="admin-card-title">Item Pesanan</h3></div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead><tr><th>Produk</th><th>Qty</th><th>Harga</th><th>Total</th></tr></thead>
                <tbody>
                  {order.items?.map((item, i) => (
                    <tr key={i}>
                      <td><div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img src={item.product_image || '/placeholder.jpg'} alt={item.product_name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '0.5rem' }} onError={e => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }} />
                        <div><div style={{ fontWeight: 500 }}>{item.product_name}</div></div>
                      </div></td>
                      <td>{item.quantity}</td><td>{formatPrice(item.price)}</td><td>{formatPrice(item.quantity * item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--admin-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span style={{ color: '#94A3B8' }}>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span style={{ color: '#94A3B8' }}>Biaya Kirim</span><span>{order.shipping_cost ? formatPrice(order.shipping_cost) : 'Belum di-set'}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 600, marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--admin-border)' }}><span>Total</span><span style={{ color: '#F97316' }}>{formatPrice(order.total)}</span></div>
            </div>
          </div>
          <div className="admin-card">
            <div className="admin-card-header"><h3 className="admin-card-title">Alamat Pengiriman</h3></div>
            {shippingAddress ? (
              <div style={{ display: 'flex', gap: '1rem' }}><MapPin size={20} style={{ color: '#F97316', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 500 }}>{(shippingAddress as any).recipient_name || (shippingAddress as any).name}</div>
                  <div style={{ color: '#94A3B8', fontSize: '0.875rem' }}><Phone size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />{(shippingAddress as any).phone}</div>
                  <div style={{ color: '#94A3B8', fontSize: '0.875rem' }}>{(shippingAddress as any).address}<br />{(shippingAddress as any).city}, {(shippingAddress as any).province} {(shippingAddress as any).postal_code}</div>
                </div>
              </div>
            ) : <p style={{ color: '#94A3B8' }}>Belum ada alamat</p>}
          </div>
        </div>

        <div>
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '1rem' }}>Pelanggan</h3>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 500 }}>{order.customer_name || 'Guest'}</div>
              <div style={{ fontSize: '0.875rem', color: '#94A3B8' }}>{order.customer_email}</div>
              {order.customer_phone && <div style={{ fontSize: '0.875rem', color: '#94A3B8' }}>{order.customer_phone}</div>}
            </div>
          </div>

          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '1rem' }}>Update Status</h3>
            <div className="admin-form-group">
              <label className="admin-label">Status Saat Ini</label>
              <div style={{ padding: '0.75rem', background: 'rgba(249,115,22,0.1)', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                <span className="admin-badge" style={{ background: getStatusColor(order.status), color: 'white' }}>{statusLabels[order.status] || order.status}</span>
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Biaya Kirim (Rp)</label>
              <input type="number" value={shippingCost} onChange={e => setShippingCost(e.target.value)}
                placeholder={order.shipping_cost ? formatPrice(order.shipping_cost).replace('Rp', '').trim() : 'Masukkan biaya kirim'}
                style={{ width: '100%', padding: '10px', background: 'var(--racing-black)', border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--racing-white)', fontSize: '14px', outline: 'none' }} />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Status Baru</label>
              <select className="admin-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Catatan</label>
              <textarea className="admin-textarea" rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Tambahkan catatan..." />
            </div>
            <button onClick={handleUpdateStatus} className="admin-btn admin-btn-primary" style={{ width: '100%' }} disabled={updating || newStatus === order.status}>
              {updating ? 'Memperbarui...' : 'Update Status'}
            </button>
          </div>

          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '1rem' }}>Aksi</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to={`/dashboard/invoices/${order.order_number}`} className="admin-btn admin-btn-sm admin-btn-secondary" style={{ width: '100%', textDecoration: 'none', textAlign: 'center' }}>
                <FileText size={14} /> Lihat Invoice
              </Link>
              {order.customer_phone && (
                <a href={`https://wa.me/62${order.customer_phone.replace(/^0+/, '')}`} target="_blank" rel="noopener" className="admin-btn admin-btn-sm admin-btn-secondary" style={{ width: '100%', textDecoration: 'none', textAlign: 'center' }}>
                  <Phone size={14} /> Chat Pelanggan
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}