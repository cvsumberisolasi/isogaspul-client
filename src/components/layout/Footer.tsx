import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Truck, Award, Shield, Headphones } from 'lucide-react';
import type { SiteSettings } from '../../types';
import { getSiteSettings } from '../../api/insforge';
import './Footer.css';
import '../../styles/racing-theme.css';

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSiteSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const whatsappNumber = settings?.whatsapp_number || '081394373007';
  const email = settings?.email || 'cvsumberisolasi@gmail.com';
  const address = settings?.address || 'Jl. Sholeh Iskandar No. 43, Kayumanis, Tanah Sareal, Kota Bogor 16169';
  const operatingHours = settings?.operating_hours || 'Senin - Sabtu, 08:00 - 17:00 WIB';
  const waLink = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`;
  const siteName = settings?.site_name || 'ISOGASPUL';
  const description = settings?.description || 'Importir Glasswool, Rockwool, Ceramicwool, Fibercloth HT 800 untuk peredam suara dan knalpot racing. Berdiri sejak 2025.';
  const footerText = settings?.footer_text || 'Importir Glasswool — Peredam Suara & Knalpot Racing';
  const footerCopyright = settings?.footer_copyright || `© ${new Date().getFullYear()} Isogaspul Racing Shop. All rights reserved.`;

  return (
    <footer className="footer" style={{ background: 'var(--racing-black)', borderTop: '3px solid var(--racing-red)' }}>
      {/* Racing CTA Section */}
      <div className="footer-cta" style={{
        background: 'linear-gradient(135deg, var(--racing-red), var(--racing-red-dark))',
        padding: '60px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="checkered-pattern" style={{ opacity: 0.1 }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ color: 'var(--racing-white)', fontSize: '42px', fontWeight: 900, marginBottom: '16px', textTransform: 'uppercase' }}>
              🏁 Siap Pesan Produk Kami?
            </h2>
            <p style={{ color: 'var(--racing-silver)', fontSize: '18px', marginBottom: '32px' }}>
              Hubungi kami via WhatsApp untuk pesanan dan konsultasi produk
            </p>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-racing" style={{
              background: 'var(--racing-yellow)',
              color: 'var(--racing-black)',
              border: '2px solid var(--racing-yellow)',
              fontSize: '18px',
              padding: '16px 48px'
            }}>
              <Phone size={20} />
              Chat WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Racing Features Row */}
      <div className="footer-features" style={{ background: 'var(--racing-carbon)', padding: '60px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'var(--gradient-racing)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: 'var(--shadow-racing)'
              }}>
                <Truck size={36} style={{ color: 'var(--racing-white)' }} />
              </div>
              <h4 style={{ color: 'var(--racing-white)', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Pengiriman Cepat</h4>
              <p style={{ color: 'var(--racing-silver)', fontSize: '14px' }}>Ready stock & pengiriman ke seluruh Indonesia</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'var(--gradient-racing)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: 'var(--shadow-racing)'
              }}>
                <Award size={36} style={{ color: 'var(--racing-white)' }} />
              </div>
              <h4 style={{ color: 'var(--racing-white)', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Kualitas Import</h4>
              <p style={{ color: 'var(--racing-silver)', fontSize: '14px' }}>Produk langsung dari pabrik terbaik</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'var(--gradient-racing)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: 'var(--shadow-racing)'
              }}>
                <Shield size={36} style={{ color: 'var(--racing-white)' }} />
              </div>
              <h4 style={{ color: 'var(--racing-white)', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Garansi Produk</h4>
              <p style={{ color: 'var(--racing-silver)', fontSize: '14px' }}>Produk sesuai dengan spesifikasi</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'var(--gradient-racing)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: 'var(--shadow-racing)'
              }}>
                <Headphones size={36} style={{ color: 'var(--racing-white)' }} />
              </div>
              <h4 style={{ color: 'var(--racing-white)', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Support 24/7</h4>
              <p style={{ color: 'var(--racing-silver)', fontSize: '14px' }}>Admin siap membantu via WhatsApp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer-main" style={{ background: 'var(--racing-black)', padding: '60px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '48px' }}>
            {/* Company Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <img src="/src/assets/logo-isogaspul.png" alt="Isogaspul" style={{ height: '40px', width: 'auto' }} />
                <span style={{
                  fontSize: '24px',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, var(--racing-red), var(--racing-yellow))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>{siteName}</span>
              </div>
              <p style={{ color: 'var(--racing-silver)', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
                {description}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--racing-silver)', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} style={{ color: 'var(--racing-red)' }} /> {whatsappNumber}
                </a>
                <a href={`mailto:${email}`} style={{ color: 'var(--racing-silver)', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={16} style={{ color: 'var(--racing-red)' }} /> {email}
                </a>
                <span style={{ color: 'var(--racing-silver)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} style={{ color: 'var(--racing-red)' }} /> {address}
                </span>
                <span style={{ color: 'var(--racing-silver)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} style={{ color: 'var(--racing-red)' }} /> {operatingHours}
                </span>
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 style={{ color: 'var(--racing-white)', fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>🎯 Produk</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><Link to="/produk" style={{ color: 'var(--racing-silver)', fontSize: '14px', textDecoration: 'none' }}>Semua Produk</Link></li>
                <li><Link to="/produk?category=glasswool" style={{ color: 'var(--racing-silver)', fontSize: '14px', textDecoration: 'none' }}>Glasswool</Link></li>
                <li><Link to="/produk?category=rockwool" style={{ color: 'var(--racing-silver)', fontSize: '14px', textDecoration: 'none' }}>Rockwool</Link></li>
                <li><Link to="/produk?category=roving" style={{ color: 'var(--racing-silver)', fontSize: '14px', textDecoration: 'none' }}>Roving GRC</Link></li>
                <li><Link to="/produk?category=fibercloth" style={{ color: 'var(--racing-silver)', fontSize: '14px', textDecoration: 'none' }}>Fibercloth HT 800</Link></li>
                <li><Link to="/produk?category=ceramicwool" style={{ color: 'var(--racing-silver)', fontSize: '14px', textDecoration: 'none' }}>Ceramicwool</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 style={{ color: 'var(--racing-white)', fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>🏢 Perusahaan</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><Link to="/tentang" style={{ color: 'var(--racing-silver)', fontSize: '14px', textDecoration: 'none' }}>Tentang Kami</Link></li>
                <li><Link to="/blog" style={{ color: 'var(--racing-silver)', fontSize: '14px', textDecoration: 'none' }}>Blog</Link></li>
                <li><Link to="/testimoni" style={{ color: 'var(--racing-silver)', fontSize: '14px', textDecoration: 'none' }}>Testimoni</Link></li>
                <li><Link to="/kontak" style={{ color: 'var(--racing-silver)', fontSize: '14px', textDecoration: 'none' }}>Hubungi Kami</Link></li>
              </ul>
            </div>

            {/* Quick Order */}
            <div>
              <h3 style={{ color: 'var(--racing-white)', fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>⚡ Pesan Cepat</h3>
              <p style={{ color: 'var(--racing-silver)', fontSize: '14px', marginBottom: '16px' }}>Pesan produk via WhatsApp langsung:</p>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-racing" style={{ width: '100%', justifyContent: 'center' }}>
                <Phone size={18} />
                {whatsappNumber}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Racing Bottom Bar */}
      <div className="footer-bottom" style={{
        background: 'var(--racing-carbon)',
        padding: '24px 0',
        borderTop: '1px solid var(--racing-gray-light)'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--racing-silver)', fontSize: '14px', marginBottom: '8px' }}>
              {footerCopyright}
            </p>
            <p style={{ color: 'var(--racing-gray-light)', fontSize: '12px' }}>
              {address}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
