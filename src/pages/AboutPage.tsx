// About Page — ISOGASPUL RACING (Dynamic Content from Database)
import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Clock, Truck, Shield, Award, Building } from 'lucide-react';
import type { SiteSettings } from '../types';
import { getSiteSettings } from '../api/insforge';
import SEO from '../components/seo/SEO';
import { organizationSchema, breadcrumbSchema, localBusinessSchema } from '../lib/schema';
import './AboutPage.css';
import '../styles/racing-theme.css';

export default function AboutPage() {
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

  const features = [
    { icon: Building, title: 'Importir Resmi', desc: 'Importir langsung dari pabrik terpercaya' },
    { icon: Truck, title: 'Pengiriman Nasional', desc: 'Ready stock dan pengiriman ke seluruh Indonesia' },
    { icon: Shield, title: 'Kualitas Terjamin', desc: 'Produk sesuai spesifikasi teknis' },
    { icon: Award, title: 'Harga Kompetitif', desc: 'Langsung dari importir, harga terbaik' },
  ];

  const products = [
    { name: 'Glasswool Kuning', desc: 'Peredam suara knalpot racing', icon: '🔶' },
    { name: 'Glasswool Putih', desc: 'Peredam suara premium', icon: '⚪' },
    { name: 'Rockwool Slab', desc: 'Insulasi termal & peredam suara', icon: '🪨' },
    { name: 'Ceramicwool', desc: 'Peredam high-temp 1100°C', icon: '🔥' },
    { name: 'Fibercloth HT 800', desc: 'Kain fiberglass high-temp', icon: '🧵' },
    { name: 'Roving GRC', desc: 'Fiber roving untuk konstruksi', icon: '🎯' },
  ];

  // Use settings values or fallback to defaults
  const siteName = settings?.site_name || 'ISOGASPUL';
  const aboutTitle = settings?.about_title || 'Siapa Isogaspul?';
  const aboutContent = settings?.about_content || `<strong style={{ color: 'var(--racing-yellow)' }}>Isogaspul</strong> adalah importir material peredam suara dan insulasi yang berdiri sejak 2025. Kami berlokasi di ${settings?.address || 'Jl. Sholeh Iskandar No. 43, Kayumanis, Tanah Sareal, Kota Bogor 16169'}.`;
  const aboutMission = settings?.about_mission;
  const aboutVision = settings?.about_vision;
  const aboutValues = settings?.about_values;
  const whatsappNumber = settings?.whatsapp_number || '081394373007';
  const email = settings?.email || 'cvsumberisolasi@gmail.com';
  const address = settings?.address || 'Jl. Sholeh Iskandar No. 43, Kayumanis, Tanah Sareal, Kota Bogor 16169';
  const operatingHours = settings?.operating_hours || 'Senin - Sabtu\n08:00 - 17:00 WIB';

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', background: 'var(--racing-black)' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid var(--racing-gray-light)', borderTopColor: 'var(--racing-red)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Tentang Isogaspul — Importir Glasswool & Insulasi Premium"
        description="Isogaspul adalah importir glasswool, rockwool, ceramicwool, fibercloth HT 800, roving GRC terpercaya sejak 2025. Gudang di Bogor, pengiriman seluruh Indonesia."
        canonical="https://isogaspul.com/tentang"
        ogType="website"
        schema={{
          ...organizationSchema(),
          ...breadcrumbSchema([
            { name: 'Home', url: 'https://isogaspul.com' },
            { name: 'Tentang Kami', url: 'https://isogaspul.com/tentang' },
          ]),
          ...localBusinessSchema(),
        }}
      />
    <div className="about-page" style={{ background: 'var(--racing-black)', minHeight: '100vh' }}>
      {/* Racing Hero */}
      <div className="about-hero" style={{
        background: 'linear-gradient(135deg, var(--racing-carbon), var(--racing-black))',
        padding: '120px 0 80px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="speed-lines">
          <div className="speed-line" style={{ width: '200px' }}></div>
          <div className="speed-line" style={{ width: '250px' }}></div>
          <div className="speed-line" style={{ width: '180px' }}></div>
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <span className="racing-badge" style={{ marginBottom: '24px' }}>🏁 Tentang Kami</span>
          <h1 style={{
            fontSize: '64px',
            fontWeight: 900,
            background: 'linear-gradient(135deg, var(--racing-red), var(--racing-yellow))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '24px',
            textTransform: 'uppercase',
            letterSpacing: '3px'
          }}>{siteName}</h1>
          <p style={{ fontSize: '24px', color: 'var(--racing-silver)', fontWeight: 600, letterSpacing: '1px' }}>
            {settings?.tagline || 'Importir Glasswool — Peredam Suara & Knalpot Racing'}
          </p>
        </div>
      </div>

      <div className="about-content" style={{ padding: '80px 0' }}>
        <div className="container">
          {/* Company Story */}
          <section style={{ marginBottom: '80px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
              <div>
                <h2 style={{ color: 'var(--racing-white)', fontSize: '42px', fontWeight: 900, marginBottom: '24px' }}>
                  {aboutTitle}
                </h2>
                <div style={{ color: 'var(--racing-silver)', fontSize: '18px', lineHeight: 1.8, marginBottom: '20px' }}>
                  {aboutContent.split('\n').map((line, i) => (
                    <p key={i} style={{ marginBottom: '16px' }}>{line}</p>
                  ))}
                </div>
                
                {aboutMission && (
                  <div style={{ marginBottom: '24px', padding: '20px', background: 'var(--racing-gray)', borderRadius: '12px', border: '1px solid var(--racing-gray-light)' }}>
                    <h3 style={{ color: 'var(--racing-yellow)', fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>🎯 Misi Kami</h3>
                    <p style={{ color: 'var(--racing-silver)', lineHeight: 1.6 }}>{aboutMission}</p>
                  </div>
                )}
                
                {aboutVision && (
                  <div style={{ marginBottom: '24px', padding: '20px', background: 'var(--racing-gray)', borderRadius: '12px', border: '1px solid var(--racing-gray-light)' }}>
                    <h3 style={{ color: 'var(--racing-blue)', fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>👁️ Visi Kami</h3>
                    <p style={{ color: 'var(--racing-silver)', lineHeight: 1.6 }}>{aboutVision}</p>
                  </div>
                )}
                
                {aboutValues && (
                  <div style={{ padding: '20px', background: 'var(--racing-gray)', borderRadius: '12px', border: '1px solid var(--racing-gray-light)' }}>
                    <h3 style={{ color: 'var(--racing-red)', fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>💎 Nilai Kami</h3>
                    <p style={{ color: 'var(--racing-silver)', lineHeight: 1.6 }}>{aboutValues}</p>
                  </div>
                )}
              </div>
              <div className="racing-stats" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="racing-stat-item">
                  <div className="racing-stat-number">6+</div>
                  <div className="racing-stat-label">Produk Premium</div>
                </div>
                <div className="racing-stat-item">
                  <div className="racing-stat-number">5</div>
                  <div className="racing-stat-label">Kategori Produk</div>
                </div>
                <div className="racing-stat-item">
                  <div className="racing-stat-number">100%</div>
                  <div className="racing-stat-label">Produk Import</div>
                </div>
                <div className="racing-stat-item">
                  <div className="racing-stat-number">🇮🇩</div>
                  <div className="racing-stat-label">Pengiriman Nasional</div>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section style={{ marginBottom: '80px' }}>
            <div className="racing-section-header">
              <h2>🏆 Mengapa Memilih Kami?</h2>
              <p>Keunggulan yang membuat kami berbeda dari kompetitor</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              {features.map((f, i) => (
                <div key={i} className="racing-card" style={{ padding: '32px', textAlign: 'center' }}>
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
                    <f.icon size={40} style={{ color: 'var(--racing-white)' }} />
                  </div>
                  <h3 style={{ color: 'var(--racing-white)', fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>
                    {f.title}
                  </h3>
                  <p style={{ color: 'var(--racing-silver)', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Products List */}
          <section style={{ marginBottom: '80px' }}>
            <div className="racing-section-header">
              <h2>🎯 Produk Kami</h2>
              <p>Rangkaian lengkap produk peredam suara dan insulasi berkualitas</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {products.map((product, i) => (
                <div key={i} className="racing-card racing-stripe" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{
                    fontSize: '48px',
                    width: '70px',
                    height: '70px',
                    background: 'var(--racing-gray)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {product.icon}
                  </div>
                  <div>
                    <h3 style={{ color: 'var(--racing-white)', fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
                      {product.name}
                    </h3>
                    <p style={{ color: 'var(--racing-silver)', fontSize: '14px', lineHeight: 1.5 }}>
                      {product.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section>
            <div className="racing-section-header">
              <h2>📞 Hubungi Kami</h2>
              <p>Siap melayani kebutuhan peredam suara dan insulasi Anda</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <a href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="racing-card" style={{ padding: '32px', textAlign: 'center', textDecoration: 'none' }}>
                <Phone size={40} style={{ color: 'var(--racing-red)', marginBottom: '16px' }} />
                <h3 style={{ color: 'var(--racing-white)', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>WhatsApp</h3>
                <p style={{ color: 'var(--racing-yellow)', fontSize: '18px', fontWeight: 600 }}>{whatsappNumber}</p>
              </a>
              <a href={`mailto:${email}`} className="racing-card" style={{ padding: '32px', textAlign: 'center', textDecoration: 'none' }}>
                <Mail size={40} style={{ color: 'var(--racing-red)', marginBottom: '16px' }} />
                <h3 style={{ color: 'var(--racing-white)', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Email</h3>
                <p style={{ color: 'var(--racing-yellow)', fontSize: '16px', fontWeight: 600 }}>{email}</p>
              </a>
              <div className="racing-card" style={{ padding: '32px', textAlign: 'center' }}>
                <MapPin size={40} style={{ color: 'var(--racing-red)', marginBottom: '16px' }} />
                <h3 style={{ color: 'var(--racing-white)', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Alamat</h3>
                <p style={{ color: 'var(--racing-silver)', fontSize: '14px', lineHeight: 1.6 }}>{address}</p>
              </div>
              <div className="racing-card" style={{ padding: '32px', textAlign: 'center' }}>
                <Clock size={40} style={{ color: 'var(--racing-red)', marginBottom: '16px' }} />
                <h3 style={{ color: 'var(--racing-white)', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Jam Operasional</h3>
                <p style={{ color: 'var(--racing-silver)', fontSize: '14px' }}>{operatingHours.split('\n').map((line, i) => (<span key={i}>{line}<br/></span>))}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
    </>
  );
}
