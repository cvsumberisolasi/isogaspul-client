// ============================================
// Blog Page — ISOGASPUL RACING
// SEO-optimized blog with racing theme
// ============================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, TrendingUp, BookOpen, Tag } from 'lucide-react';
import { getBlogs } from '../api/insforge';
import type { Blog } from '../types';
import SEO from '../components/seo/SEO';
import { websiteSchema } from '../lib/schema';
import './BlogPage.css';
import '../styles/racing-theme.css';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogs().then(data => {
      setBlogs(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const featuredBlog = blogs.find(b => b.is_featured);

  return (
    <>
      <SEO
        title="Blog & Artikel — Isogaspul Racing"
        description="Panduan lengkap glasswool, fiberglass, direct roving, roving gypsum, roving GRC, dan material insulasi. Tips peredam suara & knalpot racing dari importir terpercaya."
        canonical="https://isogaspul.com/blog"
        ogType="website"
        keywords="blog glasswool, artikel fiberglass, direct roving, roving gypsum, roving grc, peredam suara, knalpot racing, insulasi"
        schema={websiteSchema()}
      />
    <div className="blog-page" style={{ background: 'var(--racing-black)', minHeight: '100vh' }}>
      {/* Racing Hero */}
      <section className="blog-hero" style={{
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
          <div className="racing-badge" style={{ marginBottom: '20px' }}>
            <BookOpen size={16} /> Blog & Artikel
          </div>
          <h1 style={{
            fontSize: '56px',
            fontWeight: 900,
            background: 'linear-gradient(135deg, var(--racing-red), var(--racing-yellow))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>🏁 Racing Blog</h1>
          <p style={{ fontSize: '20px', color: 'var(--racing-silver)', maxWidth: '700px', margin: '0 auto' }}>
            Tips, panduan, dan informasi seputar material isolasi & peredam suara untuk racing
          </p>
        </div>
      </section>

      <div className="container" style={{ padding: '60px 0' }}>
        {/* Featured Post */}
        {featuredBlog && (
          <section style={{ marginBottom: '80px' }}>
            <div className="racing-card" style={{ padding: 0, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
              <div style={{
                height: '400px',
                background: `url(${featuredBlog.image_url || '/placeholder.jpg'}) center/cover`,
                position: 'relative'
              }}>
                <span className="racing-badge" style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  background: 'var(--racing-red)',
                  border: '2px solid var(--racing-yellow)'
                }}>
                  <TrendingUp size={14} /> Featured
                </span>
              </div>
              <div style={{ padding: '40px' }}>
                <h2 style={{
                  color: 'var(--racing-white)',
                  fontSize: '32px',
                  fontWeight: 900,
                  marginBottom: '16px',
                  lineHeight: 1.3
                }}>
                  {featuredBlog.title}
                </h2>
                <p style={{
                  color: 'var(--racing-silver)',
                  fontSize: '16px',
                  lineHeight: 1.8,
                  marginBottom: '24px'
                }}>
                  {featuredBlog.excerpt}
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '24px',
                  paddingBottom: '24px',
                  borderBottom: '1px solid var(--racing-gray-light)'
                }}>
                  <span style={{ color: 'var(--racing-silver)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} /> {featuredBlog.published_at ? new Date(featuredBlog.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                  </span>
                  {featuredBlog.category && (
                    <span className="racing-badge" style={{ fontSize: '12px', padding: '4px 12px' }}>
                      <Tag size={12} /> {featuredBlog.category}
                    </span>
                  )}
                </div>
                <Link to={`/blog/${featuredBlog.slug}`} className="btn-racing">
                  Baca Selengkapnya <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Blog Grid */}
        <section>
          <div className="racing-section-header" style={{ marginBottom: '48px' }}>
            <h2>📰 Artikel Terbaru</h2>
            <p>Panduan lengkap seputar peredam suara dan insulasi racing</p>
          </div>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="racing-card" style={{ padding: '0', overflow: 'hidden' }}>
                  <div style={{ height: '200px', background: 'var(--racing-gray)', animation: 'pulse 1.5s infinite' }} />
                  <div style={{ padding: '20px' }}>
                    <div style={{ height: '20px', background: 'var(--racing-gray)', marginBottom: '12px', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
                    <div style={{ height: '16px', background: 'var(--racing-gray)', marginBottom: '8px', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
                    <div style={{ height: '16px', background: 'var(--racing-gray)', width: '60%', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="racing-card" style={{ padding: '60px', textAlign: 'center' }}>
              <BookOpen size={64} style={{ color: 'var(--racing-gray)', marginBottom: '24px' }} />
              <h3 style={{ color: 'var(--racing-white)', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
                Belum Ada Artikel
              </h3>
              <p style={{ color: 'var(--racing-silver)' }}>
                Artikel blog akan segera hadir. Stay tuned!
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {blogs.filter(b => !b.is_featured || b.id !== featuredBlog?.id).map(blog => (
                <Link
                  to={`/blog/${blog.slug}`}
                  key={blog.id}
                  className="racing-card racing-stripe"
                  style={{ padding: 0, overflow: 'hidden', textDecoration: 'none' }}
                >
                  <div style={{
                    height: '200px',
                    background: `url(${blog.image_url || '/placeholder.jpg'}) center/cover`,
                    position: 'relative'
                  }}>
                    {blog.category && (
                      <span className="racing-badge" style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        fontSize: '12px',
                        padding: '4px 12px'
                      }}>
                        <Tag size={12} /> {blog.category}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{
                      color: 'var(--racing-white)',
                      fontSize: '20px',
                      fontWeight: 700,
                      marginBottom: '12px',
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {blog.title}
                    </h3>
                    <p style={{
                      color: 'var(--racing-silver)',
                      fontSize: '14px',
                      lineHeight: 1.6,
                      marginBottom: '16px',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {blog.excerpt}
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '16px',
                      borderTop: '1px solid var(--racing-gray-light)'
                    }}>
                      <span style={{ color: 'var(--racing-silver)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={12} /> {blog.published_at ? new Date(blog.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                      </span>
                      <span style={{
                        color: 'var(--racing-red)',
                        fontSize: '14px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        Baca <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
    </>
  );
}
