// Testimonials Page — ISOGASPUL RACING
import { useState, useEffect } from 'react';
import { Star, MessageCircle, Image as ImageIcon } from 'lucide-react';
import { getTestimonials } from '../api/insforge';
import type { Testimonial } from '../types';
import SEO from '../components/seo/SEO';
import { websiteSchema } from '../lib/schema';
import './TestimonialsPage.css';
import '../styles/racing-theme.css';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTestimonials()
      .then(data => setTestimonials(data.filter(t => t.is_active).slice(0, 10)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const featuredTestimonials = testimonials.filter(t => t.is_featured);
  const regularTestimonials = testimonials.filter(t => !t.is_featured);

  // Product Gallery
  const galleryPhotos = [
    { src: '/src/assets/product_gallery_1.jpg', title: 'Ceramicwool 25mm 128KG', category: 'Ceramicwool' },
    { src: '/src/assets/product_gallery_2.jpg', title: 'Ceramicwool High Temp', category: 'Ceramicwool' },
    { src: '/src/assets/product_gallery_3.jpg', title: 'Direct Roving 18kg', category: 'Roving GRC' },
    { src: '/src/assets/product_gallery_4.jpg', title: 'Fibercloth HT 800', category: 'Fibercloth' },
    { src: '/src/assets/product_gallery_5.jpg', title: 'Fibercloth HT 800 Roll', category: 'Fibercloth' },
    { src: '/src/assets/product_gallery_6.jpg', title: 'Fibercloth HT 800 Detail', category: 'Fibercloth' },
    { src: '/src/assets/product_gallery_7.jpg', title: 'Glasswool Kuning 25mm', category: 'Glasswool' },
    { src: '/src/assets/product_gallery_8.jpg', title: 'Glasswool Kuning Premium', category: 'Glasswool' },
    { src: '/src/assets/product_gallery_9.jpg', title: 'Glasswool Putih 5mm', category: 'Glasswool' },
    { src: '/src/assets/product_gallery_10.jpg', title: 'Rockwool 25mm Slab', category: 'Rockwool' },
    { src: '/src/assets/product_gallery_11.jpg', title: 'Rockwool 25mm Premium', category: 'Rockwool' },
    { src: '/src/assets/product_gallery_12.jpg', title: 'Rockwool Surface Detail', category: 'Rockwool' },
    { src: '/src/assets/product_gallery_13.jpg', title: 'Roving GRC', category: 'Roving GRC' },
    { src: '/src/assets/product_gallery_14.jpg', title: 'Roving Gypsum', category: 'Roving GRC' },
  ];

  return (
    <>
      <SEO
        title="Testimoni Pelanggan — Isogaspul Racing"
        description="Baca pengalaman nyata pelanggan Isogaspul. Testimoni dari bengkel racing, kontraktor, dan industri yang menggunakan glasswool, rockwool, ceramicwool kami."
        canonical="https://isogaspul.com/testimoni"
        ogType="website"
        keywords="testimoni glasswool, review isogaspul, pelanggan isogaspul, pengalaman pelanggan"
        schema={websiteSchema()}
      />
    <div className="testimonials-page" style={{ background: 'var(--racing-black)', minHeight: '100vh' }}>
      {/* Racing Hero */}
      <div className="testimonials-hero" style={{
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
            <MessageCircle size={16} /> Testimoni Pelanggan
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
          }}>⭐ Apa Kata Pelanggan</h1>
          <p style={{ fontSize: '20px', color: 'var(--racing-silver)', maxWidth: '700px', margin: '0 auto' }}>
            Kepuasan pelanggan adalah prioritas utama kami
          </p>
        </div>
      </div>

      <div className="testimonials-content" style={{ padding: '60px 0' }}>
        <div className="container">
          {/* Featured Testimonials */}
          {featuredTestimonials.length > 0 && (
            <section style={{ marginBottom: '80px' }}>
              <div className="racing-section-header">
                <h2>🏆 Testimoni Unggulan</h2>
                <p>Pengalaman terbaik dari pelanggan setia kami</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                {featuredTestimonials.map(t => (
                  <div key={t.id} className="racing-card" style={{ padding: '32px', border: '2px solid var(--racing-red)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        background: 'var(--gradient-racing)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        fontWeight: 900,
                        color: 'var(--racing-white)'
                      }}>
                        {t.customer_name.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ color: 'var(--racing-white)', fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
                          {t.customer_name}
                        </h3>
                        <span style={{ color: 'var(--racing-silver)', fontSize: '14px' }}>{t.customer_company}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={20} fill={i < t.rating ? "#FFD700" : "none"} color="#FFD700" />
                      ))}
                    </div>
                    <p style={{ color: 'var(--racing-silver)', fontSize: '16px', lineHeight: 1.8, fontStyle: 'italic' }}>
                      "{t.content}"
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* All Testimonials */}
          <section style={{ marginBottom: '80px' }}>
            <div className="racing-section-header">
              <h2>💬 Semua Testimoni</h2>
              <p>Pengalaman nyata dari pelanggan kami</p>
            </div>
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {[1,2,3,4].map(i => (
                  <div key={i} className="racing-card" style={{ padding: '24px' }}>
                    <div style={{ height: '100px', background: 'var(--racing-gray)', borderRadius: '8px', animation: 'pulse 1.5s infinite' }} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {regularTestimonials.map(t => (
                  <div key={t.id} className="racing-card racing-stripe" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        background: 'var(--racing-gray)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        fontWeight: 700,
                        color: 'var(--racing-red)'
                      }}>
                        {t.customer_name.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ color: 'var(--racing-white)', fontSize: '18px', fontWeight: 700, marginBottom: '2px' }}>
                          {t.customer_name}
                        </h3>
                        <span style={{ color: 'var(--racing-silver)', fontSize: '12px' }}>{t.customer_company}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < t.rating ? "#FFD700" : "none"} color="#FFD700" />
                      ))}
                    </div>
                    <p style={{ color: 'var(--racing-silver)', fontSize: '14px', lineHeight: 1.6, fontStyle: 'italic' }}>
                      "{t.content}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Product Gallery */}
          <section style={{ marginBottom: '80px' }}>
            <div className="racing-section-header">
              <h2>📸 Galeri Produk</h2>
              <p>Koleksi lengkap produk peredam suara dan insulasi kami</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {galleryPhotos.map((photo, index) => (
                <div key={index} className="racing-card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{
                    height: '220px',
                    background: `url(${photo.src}) center/cover`,
                    position: 'relative'
                  }}>
                    <span className="racing-badge" style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      fontSize: '12px',
                      padding: '4px 12px'
                    }}>
                      {photo.category}
                    </span>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ color: 'var(--racing-white)', fontSize: '16px', fontWeight: 700 }}>
                      {photo.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </section>


        </div>
      </div>
    </div>
    </>
  );
}
