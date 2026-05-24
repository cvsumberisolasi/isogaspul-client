import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Phone, FileText, Download } from 'lucide-react';
import { getOrders, getInvoiceByNumber, formatPrice } from '../api/insforge';
import { useAuthStore } from '../store/authStore';
import type { Order } from '../types';
import './DashboardPage.css';

export default function InvoicePage() {
  const { number } = useParams<{ number: string }>();
  const { user } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && number) {
      Promise.all([
        getOrders(user.id),
        getInvoiceByNumber(number),
      ]).then(([orders, inv]) => {
        const found = orders.find(o => o.order_number === number);
        setOrder(found || null);
        setInvoice(inv);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [user, number]);

  const handlePrint = () => window.print();

  if (loading) return (
    <div className="dashboard-page"><div className="container"><div className="loading-spinner">Memuat invoice...</div></div></div>
  );

  if (!order) return (
    <div className="dashboard-page">
      <div className="container">
        <div className="empty-state">
          <FileText size={48} />
          <h2>Invoice Tidak Ditemukan</h2>
          <p>Invoice yang Anda cari tidak tersedia.</p>
          <Link to="/dashboard" className="btn-back">← Kembali ke Dashboard</Link>
        </div>
      </div>
    </div>
  );

  const shippingCost = invoice?.shipping_cost || order.shipping_cost || 0;
  const grandTotal = invoice?.grand_total || order.total || order.subtotal;
  const address = typeof order.shipping_address === 'string' ? null : order.shipping_address;

  return (
    <div className="dashboard-page invoice-page-outer">
      <div className="container">
        <div className="invoice-page">
          <Link to="/dashboard" className="back-link no-print"><ArrowLeft size={16} /> Kembali ke Dashboard</Link>

          <div className="invoice-actions no-print">
            <button onClick={handlePrint} className="btn-print"><Printer size={16} /> Cetak</button>
            <a href={`https://wa.me/6281394373007?text=${encodeURIComponent(`Halo, saya ingin menanyakan invoice ${order.order_number}`)}`} target="_blank" rel="noopener" className="btn-invoice-wa"><Phone size={16} /> Chat WA</a>
          </div>

          <div className="invoice-document">
            <div className="invoice-header">
              <div className="invoice-brand">
                <h1 className="invoice-logo">ISOGASPUL</h1>
                <p className="invoice-tagline">Importir Glasswool — Peredam Suara & Peredam Knalpot Racing</p>
                <p style={{ color: '#64748B', fontSize: '13px', marginTop: '4px' }}>Jl. Sholeh Iskandar No. 43, Kayumanis, Tanah Sareal, Kota Bogor 16169</p>
                <p style={{ color: '#64748B', fontSize: '13px' }}>WA: 081394373007 · Email: cvsumberisolasi@gmail.com</p>
              </div>
              <div className="invoice-info-right">
                <h2>INVOICE</h2>
                <p className="invoice-number">#{order.order_number}</p>
                <p>{order.created_at ? new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</p>
              </div>
            </div>

            <hr className="invoice-divider" />

            <div className="invoice-addresses">
              <div>
                <h4>Kepada:</h4>
                <p><strong>{order.customer_name || user?.name || '-'}</strong></p>
                {address ? (
                  <>
                    <p>{address.address}</p>
                    <p>{address.city}, {address.province} {address.postal_code}</p>
                    <p>📱 {address.phone}</p>
                  </>
                ) : (
                  <p>{typeof order.shipping_address === 'string' ? order.shipping_address : '-'}</p>
                )}
              </div>
              <div>
                <h4>Status:</h4>
                <p style={{
                  display: 'inline-block', padding: '4px 16px', borderRadius: '20px',
                  background: order.status === 'delivered' ? 'rgba(34,197,94,0.2)' : order.status === 'pending' ? 'rgba(234,179,8,0.2)' : 'rgba(59,130,246,0.2)',
                  color: order.status === 'delivered' ? '#22C55E' : order.status === 'pending' ? '#EAB308' : '#3B82F6',
                  fontSize: '13px', fontWeight: 600
                }}>
                  {order.status === 'pending' ? '⏳ Menunggu Konfirmasi' :
                   order.status === 'confirmed' ? '✅ Dikonfirmasi' :
                   order.status === 'shipped' ? '🚚 Dikirim' :
                   order.status === 'delivered' ? '📦 Selesai' : order.status}
                </p>
              </div>
            </div>

            <hr className="invoice-divider" />

            <table className="invoice-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Produk</th>
                  <th>Qty</th>
                  <th>Harga</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{item.product_name}</td>
                    <td>{item.quantity}</td>
                    <td>{formatPrice(item.price || 0)}</td>
                    <td>{formatPrice((item.price || 0) * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr><td colSpan={4}>Total Produk</td><td>{formatPrice(order.subtotal)}</td></tr>
                <tr><td colSpan={4}>Biaya Kirim</td><td>{shippingCost > 0 ? formatPrice(shippingCost) : '⚠️ Dikonfirmasi Admin'}</td></tr>
                <tr className="grand-total"><td colSpan={4}>GRAND TOTAL</td><td>{formatPrice(grandTotal)}</td></tr>
              </tfoot>
            </table>

            <hr className="invoice-divider" />

            <div className="invoice-footer">
              <p>Pembayaran & biaya kirim dikonfirmasi oleh admin via WhatsApp.</p>
              <p>Invoice ini sah dan diproses oleh sistem Isogaspul.</p>
              <p style={{ marginTop: '16px', fontWeight: 600 }}>🏁 ISOGASPUL — Importir Glasswool #1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}