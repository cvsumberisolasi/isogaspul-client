// Checkout Page — ISOGASPUL RACING
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, User, Mail, Home, CheckCircle, Clock, Package } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { formatPrice, sendWhatsAppOrder, createOrder, getUserAddresses, createInvoice } from '../api/insforge';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../context/ToastContext';
import './CheckoutPage.css';

interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  is_default: boolean;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { showToast } = useToast();
  const subtotal = getSubtotal();
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    notes: '',
  });

  // Load saved addresses from database
  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    if (!user) return;
    try {
      const dbAddresses = await getUserAddresses(user.id);
      
      // Convert UserAddress to Address format for compatibility
      const formattedAddresses = dbAddresses.map(addr => ({
        id: addr.id,
        label: addr.label,
        name: addr.recipient_name,
        phone: addr.phone,
        address: addr.address,
        city: addr.city,
        province: addr.province,
        postal_code: addr.postal_code,
        is_default: addr.is_default,
      }));
      
      setAddresses(formattedAddresses);
      
      // Auto-select default address or first address
      const defaultAddress = formattedAddresses.find(a => a.is_default) || formattedAddresses[0];
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
        setForm(prev => ({
          ...prev,
          name: defaultAddress.name,
          phone: defaultAddress.phone,
          address: defaultAddress.address,
          city: defaultAddress.city,
          province: defaultAddress.province,
          postalCode: defaultAddress.postal_code,
        }));
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
    }
  };

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    const selectedAddress = addresses.find(a => a.id === addressId);
    if (selectedAddress) {
      setForm(prev => ({
        ...prev,
        name: selectedAddress.name,
        phone: selectedAddress.phone,
        address: selectedAddress.address,
        city: selectedAddress.city,
        province: selectedAddress.province,
        postalCode: selectedAddress.postal_code,
      }));
    }
  };

  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [savedOrder, setSavedOrder] = useState<any>(null);

  if (items.length === 0 && !orderSuccess) {
    navigate('/keranjang');
    return null;
  }

  const generateOrderNumber = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${dateStr}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.phone.trim()) { showToast('Mohon isi nomor WhatsApp Anda', 'error'); return; }
    if (!form.address.trim()) { showToast('Mohon isi alamat pengiriman', 'error'); return; }

    setSubmitting(true);

    try {
      const orderNumber = generateOrderNumber();
      const orderData = {
        customer_id: user?.id || null,
        order_number: orderNumber,
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        status: 'pending',
        subtotal: subtotal,
        shipping_cost: 0,
        total: subtotal,
        notes: form.notes,
        items: items.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.quantity,
          price: item.tier_price || item.product.price,
          total: (item.tier_price || item.product.price) * item.quantity,
        })),
        shipping_address: {
          name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          province: form.province,
          postal_code: form.postalCode,
        },
      };

      const savedOrderResult = await createOrder(orderData);
      setSavedOrder(savedOrderResult);

      // Auto-generate invoice
      try {
        await createInvoice({
          invoice_number: orderNumber,
          order_id: savedOrderResult.id,
          customer_name: form.name,
          customer_phone: form.phone,
          customer_address: form.address,
          customer_city: form.city || undefined,
          items: items.map(item => ({
            product_name: item.product.name,
            quantity: item.quantity,
            price: item.tier_price || item.product.price,
            total: (item.tier_price || item.product.price) * item.quantity,
          })),
          product_total: subtotal,
          shipping_cost: 0,
          grand_total: subtotal,
          status: 'pending',
          notes: form.notes || undefined,
        });
      } catch (invErr) {
        console.warn('Invoice creation failed (non-blocking):', invErr);
      }

      const orderItems = items.map(item => {
        const price = item.tier_price || item.product.price;
        return { name: item.product.name, quantity: item.quantity, price, total: price * item.quantity };
      });

      sendWhatsAppOrder({
        customer_name: form.name,
        customer_phone: form.phone,
        address: form.address,
        city: form.city,
        notes: form.notes,
        items: orderItems,
        subtotal,
        order_number: orderNumber,
      });

      clearCart();
      setOrderSuccess(true);
      showToast('Pesanan berhasil dibuat! Invoice telah diterbitkan.', 'success');
    } catch (error) {
      console.error('Failed to create order:', error);
      showToast('Gagal membuat pesanan. Silakan coba lagi.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <button onClick={() => navigate('/keranjang')} className="back-btn">
          <ArrowLeft size={18} /> Kembali ke Keranjang
        </button>

        <div className="checkout-layout">
          {/* Form */}
          <form onSubmit={handleSubmit} className="checkout-form">
            <h1>Checkout</h1>
            <p className="checkout-subtitle">Isi data pengiriman untuk melanjutkan pesanan</p>

            {/* Saved Addresses Section */}
            {addresses.length > 0 && (
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
                  <MapPin size={16} /> Pilih Alamat Tersimpan
                </label>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {addresses.map(address => (
                    <div
                      key={address.id}
                      onClick={() => handleAddressSelect(address.id)}
                      style={{
                        padding: '16px',
                        background: selectedAddressId === address.id ? 'rgba(239, 68, 68, 0.1)' : 'var(--racing-gray)',
                        border: `2px solid ${selectedAddressId === address.id ? 'var(--racing-red)' : 'var(--racing-gray-light)'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Home size={16} style={{ color: 'var(--racing-red)' }} />
                          <strong style={{ color: 'var(--racing-white)' }}>{address.label}</strong>
                          {address.is_default && (
                            <span style={{
                              padding: '2px 8px',
                              background: 'var(--racing-red)',
                              color: 'var(--racing-white)',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: 600,
                            }}>
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ color: 'var(--racing-silver)', fontSize: '14px', lineHeight: 1.6 }}>
                        <div>{address.name} - {address.phone}</div>
                        <div>{address.address}</div>
                        <div>{address.city}, {address.province} {address.postal_code}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAddressId('');
                    setForm({
                      name: user?.name || '',
                      phone: '',
                      email: user?.email || '',
                      address: '',
                      city: '',
                      province: '',
                      postalCode: '',
                      notes: '',
                    });
                  }}
                  style={{
                    marginTop: '12px',
                    padding: '8px 16px',
                    background: 'transparent',
                    border: '1px solid var(--racing-gray-light)',
                    borderRadius: '6px',
                    color: 'var(--racing-silver)',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  Gunakan alamat baru
                </button>
              </div>
            )}

            <div className="form-group">
              <label><User size={16} /> Nama Lengkap *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Nama lengkap" />
            </div>

            <div className="form-group">
              <label><Phone size={16} /> Nomor WhatsApp *</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} required placeholder="08xxxxxxxxxx" />
            </div>

            <div className="form-group">
              <label><Mail size={16} /> Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@example.com" />
            </div>

            <div className="form-group">
              <label><MapPin size={16} /> Alamat Lengkap *</label>
              <textarea name="address" value={form.address} onChange={handleChange} required placeholder="Jalan, nomor, RT/RW, kelurahan" rows={3} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Kota *</label>
                <input type="text" name="city" value={form.city} onChange={handleChange} required placeholder="Kota" />
              </div>
              <div className="form-group">
                <label>Provinsi</label>
                <input type="text" name="province" value={form.province} onChange={handleChange} placeholder="Provinsi" />
              </div>
              <div className="form-group">
                <label>Kode Pos</label>
                <input type="text" name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="Kode pos" />
              </div>
            </div>

            <div className="form-group">
              <label>Catatan</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Catatan tambahan (opsional)" rows={2} />
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={submitting}
              style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
            >
              {submitting ? (
                <>
                  <div style={{ width: '20px', height: '20px', border: '2px solid transparent', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: '8px' }}></div>
                  Memproses...
                </>
              ) : (
                <>
                  <Phone size={20} />
                  Pesan via WhatsApp
                </>
              )}
            </button>
            <p className="submit-note">Anda akan diarahkan ke WhatsApp untuk konfirmasi pesanan. Admin akan menghubungi Anda untuk biaya kirim.</p>
          </form>

          {/* Order Summary */}
          <div className="checkout-summary">
            <h2>Ringkasan Pesanan</h2>
            <div className="summary-items">
              {items.map(item => {
                const price = item.tier_price || item.product.price;
                return (
                  <div key={item.product.id} className="summary-item">
                    <div className="item-info">
                      <h4>{item.product.name}</h4>
                      <span>{item.quantity} x {formatPrice(price)}</span>
                    </div>
                    <span className="item-total">{formatPrice(price * item.quantity)}</span>
                  </div>
                );
              })}
            </div>
            <div className="summary-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="total-row shipping">
                <span>Biaya Kirim</span>
                <span>Dikonfirmasi admin via WA</span>
              </div>
              <div className="grand-total">
                <span>Total Pesanan</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {orderSuccess && savedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '24px',
        }}>
          <div style={{
            background: 'var(--racing-gray)',
            borderRadius: '16px',
            padding: '48px',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            border: '1px solid var(--racing-gray-light)',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'var(--racing-green)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <CheckCircle size={40} style={{ color: 'var(--racing-white)' }} />
            </div>
            
            <h2 style={{ color: 'var(--racing-white)', fontSize: '28px', fontWeight: 900, marginBottom: '16px' }}>
              Pesanan Berhasil!
            </h2>
            
            <p style={{ color: 'var(--racing-silver)', fontSize: '16px', marginBottom: '24px' }}>
              Terima kasih telah berbelanja. Pesanan Anda telah tersimpan dengan nomor:
            </p>
            
            <div style={{
              background: 'var(--racing-black)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              border: '1px solid var(--racing-gray-light)',
            }}>
              <div style={{ color: 'var(--racing-silver)', fontSize: '14px', marginBottom: '8px' }}>Nomor Pesanan</div>
              <div style={{ color: 'var(--racing-yellow)', fontSize: '24px', fontWeight: 900 }}>
                {savedOrder.order_number}
              </div>
              <div style={{ color: 'var(--racing-silver)', fontSize: '14px', marginTop: '12px' }}>
                <Clock size={14} style={{ marginRight: '6px', display: 'inline' }} />
                Status: <span style={{ color: 'var(--racing-yellow)', fontWeight: 600 }}>Menunggu Konfirmasi</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
              <button
                onClick={() => navigate('/dashboard?tab=orders')}
                style={{
                  padding: '14px 24px',
                  background: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'var(--racing-white)',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Package size={20} />
                Lihat Pesanan Saya
              </button>
              
              <button
                onClick={() => navigate('/')}
                style={{
                  padding: '14px 24px',
                  background: 'transparent',
                  border: '1px solid var(--racing-gray-light)',
                  borderRadius: '10px',
                  color: 'var(--racing-silver)',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
