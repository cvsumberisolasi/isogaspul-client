// Contact Page — ISOGASPUL RACING
import { Phone, Mail, MapPin, Clock, MessageCircle, Truck, Send, Zap } from 'lucide-react';
import './ContactPage.css';
import '../styles/racing-theme.css';

export default function ContactPage() {
  const waNumber = import.meta.env.VITE_WA_NUMBER || '6281394373007';
  const waLink = `https://wa.me/${waNumber}`;

  return (
    <div className="contact-page" style={{ background: 'var(--racing-black)', minHeight: '100vh' }}>
      {/* Racing Hero */}
      <div className="contact-hero" style={{
        background: 'linear-gradient(135deg, var(--racing-carbon), var(--racing-black))',
        padding: '100px 0 60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="speed-lines">
          <div className="speed-line" style={{ width: '200px' }}></div>
          <div className="speed-line" style={{ width: '250px' }}></div>
          <div className="speed-line" style={{ width: '180px' }}></div>
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <span className="racing-badge" style={{ marginBottom: '20px' }}>
            <MessageCircle size={16} /> Hubungi Kami
          </span>
          <h1 style={{
            fontSize: '56px',
            fontWeight: 900,
            background: 'linear-gradient(135deg, var(--racing-red), var(--racing-yellow))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>📞 Kontak Isogaspul</h1>
          <p style={{ fontSize: '20px', color: 'var(--racing-silver)', maxWidth: '700px', margin: '0 auto' }}>
            Hubungi kami untuk konsultasi produk, pemesanan, dan informasi harga
          </p>
        </div>
      </div>

      <div className="contact-content" style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
            {/* Contact Info */}
            <div>
              <h2 style={{ color: 'var(--racing-white)', fontSize: '32px', fontWeight: 900, marginBottom: '32px' }}>
                📍 Informasi Kontak
              </h2>
              
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="racing-card" style={{
                padding: '24px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                textDecoration: 'none',
                background: 'var(--gradient-racing)',
                border: '2px solid var(--racing-red)'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'var(--racing-yellow)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <MessageCircle size={28} style={{ color: 'var(--racing-black)' }} />
                </div>
                <div>
                  <h3 style={{ color: 'var(--racing-white)', fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>WhatsApp</h3>
                  <p style={{ color: 'var(--racing-yellow)', fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>081394373007</p>
                  <span style={{ color: 'var(--racing-silver)', fontSize: '14px' }}>Chat untuk pesanan & konsultasi</span>
                </div>
              </a>

              <a href="mailto:cvsumberisolasi@gmail.com" className="racing-card" style={{
                padding: '24px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                textDecoration: 'none'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'var(--racing-gray)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Mail size={28} style={{ color: 'var(--racing-red)' }} />
                </div>
                <div>
                  <h3 style={{ color: 'var(--racing-white)', fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>Email</h3>
                  <p style={{ color: 'var(--racing-yellow)', fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>cvsumberisolasi@gmail.com</p>
                  <span style={{ color: 'var(--racing-silver)', fontSize: '14px' }}>Balasan dalam 1x24 jam</span>
                </div>
              </a>

              <div className="racing-card" style={{
                padding: '24px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'var(--racing-gray)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <MapPin size={28} style={{ color: 'var(--racing-red)' }} />
                </div>
                <div>
                  <h3 style={{ color: 'var(--racing-white)', fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>Alamat</h3>
                  <p style={{ color: 'var(--racing-silver)', fontSize: '14px', lineHeight: 1.6 }}>Jl. Sholeh Iskandar No. 43<br/>Kayumanis, Tanah Sareal, Kota Bogor 16169</p>
                </div>
              </div>

              <div className="racing-card" style={{
                padding: '24px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'var(--racing-gray)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Clock size={28} style={{ color: 'var(--racing-red)' }} />
                </div>
                <div>
                  <h3 style={{ color: 'var(--racing-white)', fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>Jam Operasional</h3>
                  <p style={{ color: 'var(--racing-silver)', fontSize: '14px' }}>Senin - Sabtu<br/>08:00 - 17:00 WIB</p>
                </div>
              </div>

              <div className="racing-card" style={{
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'var(--racing-gray)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Truck size={28} style={{ color: 'var(--racing-red)' }} />
                </div>
                <div>
                  <h3 style={{ color: 'var(--racing-white)', fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>Pengiriman</h3>
                  <p style={{ color: 'var(--racing-silver)', fontSize: '14px' }}>Ke seluruh Indonesia<br/>Biaya kirim dikonfirmasi via WhatsApp</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 style={{ color: 'var(--racing-white)', fontSize: '32px', fontWeight: 900, marginBottom: '32px' }}>
                ⚡ Pesan Cepat
              </h2>
              
              <div className="racing-card racing-stripe" style={{ padding: '32px', marginBottom: '24px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📱</div>
                <h3 style={{ color: 'var(--racing-white)', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
                  Pesan via WhatsApp
                </h3>
                <p style={{ color: 'var(--racing-silver)', fontSize: '16px', lineHeight: 1.6, marginBottom: '24px' }}>
                  Langsung chat untuk pemesanan produk. Admin akan membantu Anda.
                </p>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-racing" style={{ width: '100%', justifyContent: 'center' }}>
                  <Phone size={20} />
                  Chat WhatsApp
                  <Send size={18} />
                </a>
              </div>

              <div className="racing-card racing-stripe" style={{ padding: '32px', marginBottom: '24px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>
                <h3 style={{ color: 'var(--racing-white)', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
                  Formulir Testimoni
                </h3>
                <p style={{ color: 'var(--racing-silver)', fontSize: '16px', lineHeight: 1.6, marginBottom: '24px' }}>
                  Sudah belanja? Berikan testimoni Anda via WhatsApp.
                </p>
                <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Halo Isogaspul! Saya ingin memberikan testimoni:\n\nNama:\nRating:\nReview:')}`} target="_blank" rel="noopener noreferrer" className="btn-racing" style={{ width: '100%', justifyContent: 'center', background: 'var(--racing-gray)', border: '2px solid var(--racing-gray-light)' }}>
                  Kirim Testimoni
                </a>
              </div>

              <div className="racing-card racing-stripe" style={{ padding: '32px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>💡</div>
                <h3 style={{ color: 'var(--racing-white)', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
                  Konsultasi Produk
                </h3>
                <p style={{ color: 'var(--racing-silver)', fontSize: '16px', lineHeight: 1.6, marginBottom: '24px' }}>
                  Bingung pilih produk? Konsultasikan kebutuhan Anda.
                </p>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-racing" style={{ width: '100%', justifyContent: 'center', background: 'var(--racing-gray)', border: '2px solid var(--racing-gray-light)' }}>
                  <Zap size={20} />
                  Konsultasi Gratis
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
