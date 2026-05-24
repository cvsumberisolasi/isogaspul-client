// ============================================
// HomePage — ISOGASPUL RACING SHOP
// Premium Racing Theme with Warehouse & Delivery Showcase
// ============================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Package, Phone, ChevronRight, ShoppingBag, Warehouse, Clock } from 'lucide-react';
import { formatPrice, getProductImage, getProducts } from '../api/insforge';
import type { Product } from '../types';
import SEO from '../components/seo/SEO';
import { organizationSchema, websiteSchema, localBusinessSchema } from '../lib/schema';
import './HomePage.css';
import '../styles/racing-theme.css';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ featured: true, limit: 6 })
      .then(products => {
        setFeaturedProducts(products);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO 
        title="Isogaspul Racing — Importir Glasswool & Peredam Suara Premium"
        description="Importir glasswool, rockwool, ceramicwool, fibercloth HT 800, roving GRC. Peredam suara & knalpot racing #1 di Indonesia. Harga langsung pabrik, siap kirim seluruh Indonesia."
        ogType="website"
        keywords="glasswool, rockwool, ceramicwool, fibercloth, roving grc, direct roving, roving gypsum, peredam suara, knalpot racing, insulasi, fiberglass, isogaspul"
        schema={{...organizationSchema(), ...websiteSchema(), ...localBusinessSchema()}}
      />
    <div className="home-page racing-theme">
      {/* Racing Hero Section */}
      <section className="hero-section racing-hero">
        <div className="speed-lines">
          <div className="speed-line" style={{ width: '200px' }}></div>
          <div className="speed-line" style={{ width: '250px' }}></div>
          <div className="speed-line" style={{ width: '180px' }}></div>
          <div className="speed-line" style={{ width: '220px' }}></div>
        </div>
        <div className="hero-bg">
          <div className="hero-gradient-1" style={{ background: 'radial-gradient(circle at 30% 50%, rgba(227, 30, 36, 0.15), transparent)' }} />
          <div className="hero-gradient-2" style={{ background: 'radial-gradient(circle at 70% 50%, rgba(255, 215, 0, 0.1), transparent)' }} />
          <div className="checkered-pattern" style={{ opacity: 0.05 }}></div>
        </div>
        <div className="container hero-content">
          <div className="hero-text">
            <div className="racing-badge">
              <span className="badge-dot" style={{ background: 'var(--racing-red)' }} />
              Importir Premium Sejak 2025
            </div>
            <h1 className="hero-title" style={{ animation: 'engineRev 2s ease-in-out infinite' }}>
              <span className="hero-title-main" style={{ 
                fontSize: '72px',
                fontWeight: 900,
                background: 'linear-gradient(135deg, var(--racing-red), var(--racing-yellow))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textTransform: 'uppercase',
                letterSpacing: '4px'
              }}>
                🏁 ISOGASPUL
              </span>
              <span className="hero-title-sub" style={{ 
                fontSize: '32px',
                color: 'var(--racing-silver)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}>
                Peredam Suara & Knalpot Racing
              </span>
            </h1>
            <p className="hero-desc" style={{ fontSize: '18px', color: 'var(--racing-silver)', lineHeight: 1.8 }}>
              Importir <strong style={{ color: 'var(--racing-yellow)' }}>glasswool</strong>, <strong style={{ color: 'var(--racing-yellow)' }}>rockwool</strong>, <strong style={{ color: 'var(--racing-yellow)' }}>ceramicwool</strong>, <strong style={{ color: 'var(--racing-yellow)' }}>fibercloth HT 800</strong>, dan <strong style={{ color: 'var(--racing-yellow)' }}>roving GRC</strong> kualitas terbaik. 
              Langsung dari pabrik, harga kompetitif, pengiriman ke seluruh Indonesia.
            </p>
            <div className="hero-actions" style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
              <Link to="/produk" className="btn-racing">
                <ShoppingBag size={20} />
                Lihat Produk
                <ArrowRight size={18} />
              </Link>
              <a href="https://wa.me/6281394373007" target="_blank" rel="noopener noreferrer" className="btn-racing" style={{ background: 'var(--racing-yellow)', color: 'var(--racing-black)', border: '2px solid var(--racing-yellow)' }}>
                <Phone size={20} />
                Chat WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Warehouse Showcase */}
      <section className="warehouse-section" style={{ padding: '80px 0', background: 'var(--racing-black)' }}>
        <div className="container">
          <div className="racing-section-header">
            <h2>🏭 Fasilitas Gudang Kami</h2>
            <p>Gudang modern dengan standar internasional untuk menjaga kualitas produk</p>
          </div>
          <div className="warehouse-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            <div className="racing-card">
              <div style={{ height: '250px', backgroundImage: 'url(/src/assets/warehouse-main.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px', marginBottom: '20px' }} />
              <h3 style={{ color: '#FFF', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}><Warehouse size={24} style={{ display: 'inline', marginRight: '8px', color: '#E31E24' }} />Gudang Utama</h3>
              <p style={{ color: '#C0C0C0', lineHeight: 1.6 }}>Gudang modern dengan kapasitas <strong style={{ color: '#FFD700' }}>500+ roll</strong> glasswool dan rockwool. Dilengkapi sistem penyimpanan terorganisir, kontrol suhu, dan standar keamanan tinggi.</p>
              <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span className="racing-badge" style={{ fontSize: '12px', padding: '4px 12px' }}>✓ Climate Control</span>
                <span className="racing-badge" style={{ fontSize: '12px', padding: '4px 12px' }}>✓ CCTV 24/7</span>
              </div>
            </div>
            <div className="racing-card">
              <div style={{ height: '250px', backgroundImage: 'url(/src/assets/warehouse-quality.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px', marginBottom: '20px' }} />
              <h3 style={{ color: '#FFF', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}><Shield size={24} style={{ display: 'inline', marginRight: '8px', color: '#E31E24' }} />Quality Control</h3>
              <p style={{ color: '#C0C0C0', lineHeight: 1.6 }}>Area inspeksi kualitas produk sebelum pengiriman. Setiap produk melalui <strong style={{ color: '#FFD700' }}>quality check</strong> ketat untuk memastikan spesifikasi sesuai standar.</p>
              <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span className="racing-badge" style={{ fontSize: '12px', padding: '4px 12px' }}>✓ QA Team</span>
                <span className="racing-badge" style={{ fontSize: '12px', padding: '4px 12px' }}>✓ ISO Standard</span>
              </div>
            </div>
            <div className="racing-card">
              <div style={{ height: '250px', backgroundImage: 'url(/src/assets/delivery-fleet.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px', marginBottom: '20px' }} />
              <h3 style={{ color: '#FFF', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}><Package size={24} style={{ display: 'inline', marginRight: '8px', color: '#E31E24' }} />Loading Bay</h3>
              <p style={{ color: '#C0C0C0', lineHeight: 1.6 }}>Area loading dengan akses mudah untuk truk pengiriman. Dilengkapi <strong style={{ color: '#FFD700' }}>multiple loading docks</strong> untuk efisiensi logistik.</p>
              <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span className="racing-badge" style={{ fontSize: '12px', padding: '4px 12px' }}>✓ Fast Loading</span>
                <span className="racing-badge" style={{ fontSize: '12px', padding: '4px 12px' }}>✓ Efficient</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Fleet */}
      <section className="delivery-section" style={{ padding: '80px 0', background: 'var(--racing-carbon)' }}>
        <div className="container">
          <div className="racing-section-header">
            <h2>🚚 Armada Pengiriman</h2>
            <p>Pengiriman cepat, aman, dan terpercaya ke seluruh Indonesia</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            <div className="racing-card">
              <div style={{ height: '250px', backgroundImage: 'url(/src/assets/delivery-fleet.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px', marginBottom: '20px' }} />
              <h3 style={{ color: '#FFF', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}><Truck size={24} style={{ display: 'inline', marginRight: '8px', color: '#FFD700' }} />Armada Modern</h3>
              <p style={{ color: '#C0C0C0', lineHeight: 1.6 }}>Armada pengiriman ISOGASPUL siap melayani seluruh Indonesia. Dilengkapi <strong style={{ color: '#FFD700' }}>GPS tracking</strong> dan driver profesional.</p>
            </div>
            <div className="racing-card">
              <div style={{ height: '250px', backgroundImage: 'url(/src/assets/delivery-packaging.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px', marginBottom: '20px' }} />
              <h3 style={{ color: '#FFF', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}><Package size={24} style={{ display: 'inline', marginRight: '8px', color: '#FFD700' }} />Packaging Aman</h3>
              <p style={{ color: '#C0C0C0', lineHeight: 1.6 }}>Proses packaging profesional menggunakan <strong style={{ color: '#FFD700' }}>protective wrapping</strong> dan weather protection.</p>
            </div>
            <div className="racing-card">
              <div style={{ height: '250px', backgroundImage: 'url(/src/assets/delivery-ontime.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px', marginBottom: '20px' }} />
              <h3 style={{ color: '#FFF', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}><Clock size={24} style={{ display: 'inline', marginRight: '8px', color: '#FFD700' }} />Tepat Waktu</h3>
              <p style={{ color: '#C0C0C0', lineHeight: 1.6 }}>Komitmen <strong style={{ color: '#FFD700' }}>on-time delivery</strong> dengan real-time tracking dan 24/7 support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '80px 0', background: 'var(--racing-black)' }}>
        <div className="container">
          <div className="racing-section-header">
            <h2>🏁 Kategori Produk</h2>
            <p>Solusi peredam suara dan insulasi untuk berbagai kebutuhan racing</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <Link to="/produk?category=glasswool" className="racing-card racing-stripe">
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔶</div>
              <h3 style={{ color: '#FFF', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Glasswool</h3>
              <p style={{ color: '#C0C0C0', marginBottom: '16px' }}>Peredam suara knalpot racing</p>
              <span className="btn-racing" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '14px' }}>Lihat <ChevronRight size={16} /></span>
            </Link>
            <Link to="/produk?category=rockwool" className="racing-card racing-stripe">
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🪨</div>
              <h3 style={{ color: '#FFF', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Rockwool</h3>
              <p style={{ color: '#C0C0C0', marginBottom: '16px' }}>Insulasi tahan panas tinggi</p>
              <span className="btn-racing" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '14px' }}>Lihat <ChevronRight size={16} /></span>
            </Link>
            <Link to="/produk?category=ceramicwool" className="racing-card racing-stripe">
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔥</div>
              <h3 style={{ color: '#FFF', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Ceramicwool</h3>
              <p style={{ color: '#C0C0C0', marginBottom: '16px' }}>Tahan suhu ekstrem</p>
              <span className="btn-racing" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '14px' }}>Lihat <ChevronRight size={16} /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '80px 0', background: 'var(--racing-carbon)' }}>
        <div className="container">
          <div className="racing-section-header">
            <h2>⭐ Produk Unggulan</h2>
          </div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
              <div className="racing-loader"></div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {featuredProducts.map(product => (
                <Link key={product.id} to={`/produk/${product.slug}`} className="racing-card racing-stripe">
                  <div style={{ height: '200px', background: `url(${getProductImage(product)}) center/cover`, borderRadius: '8px', marginBottom: '16px' }} />
                  <h3 style={{ color: '#FFF', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{product.name}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#E31E24', fontSize: '24px', fontWeight: 900 }}>{formatPrice(product.price)}</span>
                    <span className="btn-racing" style={{ padding: '8px 16px', fontSize: '12px' }}>Detail</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
    </>
  );
}
