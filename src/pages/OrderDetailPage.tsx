// ============================================
// Order Detail Page — ISOGASPUL
// ============================================

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, FileText, Phone, ShoppingBag } from 'lucide-react';
import { getOrders, formatPrice } from '../api/insforge';
import { useAuthStore } from '../store/authStore';
import type { Order } from '../types';
import './DashboardPage.css';

const statusLabels: Record<string, string> = {
  pending: 'Menunggu',
  confirmed: 'Dikonfirmasi',
  processing: 'Diproses',
  shipped: 'Dikirim',
  delivered: 'Selesai',
  cancelled: 'Dibatalkan',
};

const statusColors: Record<string, string> = {
  pending: '#EAB308',
  confirmed: '#3B82F6',
  processing: '#8B5CF6',
  shipped: '#F97316',
  delivered: '#22C55E',
  cancelled: '#EF4444',
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && id) {
      getOrders(user.id).then(orders => {
        const found = orders.find(o => o.id === id);
        setOrder(found || null);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [user, id]);

  if (loading) return (
    <div className="dashboard-page">
      <div className="container">
        <div className="loading-spinner">Memuat pesanan...</div>
      </div>
    </div>
  );

  if (!order) return (
    <div className="dashboard-page">
      <div className="container">
        <div className="empty-state">
          <Package size={48} />
          <h2>Pesanan Tidak Ditemukan</h2>
          <p>Pesanan yang Anda cari tidak tersedia.</p>
          <Link to="/dashboard" className="btn-back">← Kembali ke Dashboard</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="order-detail-page">
          <Link to="/dashboard" className="back-link"><ArrowLeft size={16} /> Kembali ke Dashboard</Link>

          <div className="order-detail-header">
            <div className="order-detail-title">
              <h1>Pesanan {order.order_number}</h1>
              <span className="order-status-badge" style={{ background: statusColors[order.status || 'pending'] }}>
                {statusLabels[order.status] || order.status}
              </span>
            </div>
            <p className="order-date">
              {order.created_at ? new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
            </p>
          </div>

          {/* Status Timeline */}
          <div className="status-timeline">
            {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status, i) => {
              const isActive = statusIndex(order.status || 'pending') >= i;
              const isCancelled = order.status === 'cancelled';
              return (
                <div key={status} className={`timeline-step ${isActive && !isCancelled ? 'active' : ''}`}>
                  <div className="timeline-dot" style={isActive && !isCancelled ? { background: statusColors[status] } : {}} />
                  <span>{statusLabels[status]}</span>
                </div>
              );
            })}
          </div>

          {/* Items */}
          <div className="order-detail-section">
            <h2><ShoppingBag size={20} /> Item Pesanan</h2>
            <div className="order-items-list">
              {order.items?.map((item, i) => (
                <div key={i} className="order-item-row">
                  <div className="order-item-info">
                    <span className="order-item-name">{item.product_name}</span>
                    <span className="order-item-qty">x{item.quantity}</span>
                  </div>
                  <span className="order-item-price">{formatPrice((item.price || 0) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="order-total-row">
              <span>Total</span>
              <span className="total-value">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Shipping */}
          {order.shipping_address && typeof order.shipping_address !== 'string' && (
            <div className="order-detail-section">
              <h2><MapPin size={20} /> Alamat Pengiriman</h2>
              <div className="address-detail">
                <p><strong>{(order.shipping_address as any).recipient_name || 'Penerima'}</strong></p>
                <p>{(order.shipping_address as any).phone}</p>
                <p className="address-text">
                  {(order.shipping_address as any).address_line || (order.shipping_address as any).address}, {(order.shipping_address as any).city}, {(order.shipping_address as any).province} {(order.shipping_address as any).postal_code}
                </p>
              </div>
            </div>
          )}

          {/* Invoice */}
          <div className="order-detail-section">
            <h2><FileText size={20} /> Invoice</h2>
            <Link to={`/dashboard/invoices/${order.order_number}`} className="btn-invoice">
              Lihat Invoice
            </Link>
          </div>

          {/* Help */}
          <div className="order-help">
            <p>Butuh bantuan dengan pesanan ini?</p>
            <a href={`https://wa.me/6281394373007?text=${encodeURIComponent(`Halo, saya butuh bantuan untuk pesanan ${order.order_number}`)}`} target="_blank" rel="noopener" className="btn-wa-help">
              <Phone size={16} /> Chat via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function statusIndex(status: string): number {
  const order = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  return order.indexOf(status);
}
