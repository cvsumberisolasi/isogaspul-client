// ============================================
// Product Catalog Page — ISOGASPUL RACING
// Racing-themed product catalog with filters
// ============================================

import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Filter, ArrowRight } from 'lucide-react';
import { getProducts, getCategories, formatPrice, getProductImage } from '../api/insforge';
import type { Product, Category } from '../types';
import SEO from '../components/seo/SEO';
import { websiteSchema } from '../lib/schema';
import './ProductCatalogPage.css';
import '../styles/racing-theme.css';

export default function ProductCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');

  useEffect(() => {
    Promise.all([
      getProducts(),
      getCategories()
    ]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filteredProducts = activeCategory
    ? products.filter(p => {
        const catSlug = typeof p.category === 'object' ? p.category?.slug : p.category;
        return catSlug === activeCategory;
      })
    : products;

  return (
    <>
      <SEO
        title="Katalog Produk — Isogaspul Racing"
        description="Katalog lengkap glasswool, rockwool, ceramicwool, fibercloth HT 800. Material peredam suara & insulasi premium. Harga importir langsung."
        canonical="https://isogaspul.com/produk"
        ogType="website"
        keywords="katalog glasswool, rockwool, ceramicwool, fibercloth, produk insulasi, peredam suara, isogaspul"
        schema={websiteSchema()}
      />
    <div className="catalog-page" style={{ background: 'var(--racing-black)', minHeight: '100vh' }}>
      {/* Racing Hero */}
      <div className="catalog-hero" style={{ 
        background: 'linear-gradient(135deg, var(--racing-carbon), var(--racing-black))',
        padding: '80px 0 40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="speed-lines">
          <div className="speed-line" style={{ width: '200px' }}></div>
          <div className="speed-line" style={{ width: '250px' }}></div>
          <div className="speed-line" style={{ width: '180px' }}></div>
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="racing-badge" style={{ marginBottom: '16px' }}>🏁 Racing Products</div>
          <h1 style={{ 
            fontSize: '56px', 
            fontWeight: 900, 
            color: 'var(--racing-white)',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>Katalog Produk</h1>
          <p style={{ fontSize: '20px', color: 'var(--racing-silver)', maxWidth: '600px' }}>
            Semua produk peredam suara dan insulasi berkualitas import untuk kebutuhan racing Anda
          </p>
        </div>
      </div>

      <div className="catalog-content" style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="catalog-layout" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }}>
            {/* Racing Sidebar */}
            <aside className="catalog-sidebar" style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
              <div className="racing-card" style={{ padding: '24px' }}>
                <h3 style={{ 
                  color: 'var(--racing-white)', 
                  fontSize: '20px', 
                  fontWeight: 700, 
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Filter size={20} style={{ color: 'var(--racing-red)' }} />
                  Kategori
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={() => setSearchParams({})}
                    className={!activeCategory ? 'btn-racing' : ''}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: !activeCategory ? 'var(--gradient-racing)' : 'var(--racing-gray)',
                      color: 'var(--racing-white)',
                      border: `2px solid ${!activeCategory ? 'var(--racing-red)' : 'var(--racing-gray-light)'}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      textAlign: 'left'
                    }}
                  >
                    🏁 Semua Produk
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSearchParams({ category: cat.slug })}
                      className={activeCategory === cat.slug ? 'btn-racing' : ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: activeCategory === cat.slug ? 'var(--gradient-racing)' : 'var(--racing-gray)',
                        color: 'var(--racing-white)',
                        border: `2px solid ${activeCategory === cat.slug ? 'var(--racing-red)' : 'var(--racing-gray-light)'}`,
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        textAlign: 'left'
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Racing Stats */}
              <div className="racing-card" style={{ padding: '24px', marginTop: '24px' }}>
                <h3 style={{ color: 'var(--racing-white)', fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
                  📊 Statistik
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--racing-silver)', fontSize: '14px' }}>Total Produk</span>
                    <span style={{ color: 'var(--racing-red)', fontSize: '20px', fontWeight: 900 }}>{products.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--racing-silver)', fontSize: '14px' }}>Kategori</span>
                    <span style={{ color: 'var(--racing-yellow)', fontSize: '20px', fontWeight: 900 }}>{categories.length}</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Racing Product Grid */}
            <main>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                  <div className="racing-loader"></div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="racing-card" style={{ padding: '60px', textAlign: 'center' }}>
                  <ShoppingBag size={64} style={{ color: 'var(--racing-gray)', marginBottom: '24px' }} />
                  <h3 style={{ color: 'var(--racing-white)', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
                    Tidak Ada Produk
                  </h3>
                  <p style={{ color: 'var(--racing-silver)', marginBottom: '24px' }}>
                    Belum ada produk dalam kategori ini
                  </p>
                  <button onClick={() => setSearchParams({})} className="btn-racing">
                    Lihat Semua Produk
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ color: 'var(--racing-white)', fontSize: '24px', fontWeight: 700 }}>
                      {activeCategory 
                        ? categories.find(c => c.slug === activeCategory)?.name || 'Produk'
                        : 'Semua Produk'
                      }
                    </h2>
                    <span style={{ color: 'var(--racing-silver)', fontSize: '14px' }}>
                      {filteredProducts.length} produk ditemukan
                    </span>
                  </div>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                    gap: '24px' 
                  }}>
                    {filteredProducts.map(product => (
                      <Link 
                        key={product.id} 
                        to={`/produk/${product.slug}`} 
                        className="racing-card racing-stripe"
                        style={{ padding: '0', overflow: 'hidden' }}
                      >
                        <div style={{ 
                          height: '220px',
                          background: `url(${getProductImage(product)}) center/cover`,
                          position: 'relative'
                        }}>
                          {product.is_featured && (
                            <span className="racing-badge" style={{ 
                              position: 'absolute', 
                              top: '12px', 
                              right: '12px',
                              background: 'var(--racing-red)',
                              border: '2px solid var(--racing-yellow)'
                            }}>
                              ⭐ Featured
                            </span>
                          )}
                          {product.stock < 10 && product.stock > 0 && (
                            <span className="racing-badge" style={{ 
                              position: 'absolute', 
                              top: '12px', 
                              left: '12px',
                              background: 'var(--racing-yellow)',
                              color: 'var(--racing-black)',
                              border: '2px solid var(--racing-yellow)'
                            }}>
                              ⚡ Stok Terbatas
                            </span>
                          )}
                        </div>
                        <div style={{ padding: '20px' }}>
                          <h3 style={{ 
                            color: 'var(--racing-white)', 
                            fontSize: '18px', 
                            fontWeight: 700, 
                            marginBottom: '8px',
                            lineHeight: 1.3
                          }}>
                            {product.name}
                          </h3>
                          <p style={{ 
                            color: 'var(--racing-silver)', 
                            fontSize: '14px', 
                            marginBottom: '16px',
                            lineHeight: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {product.short_description || product.description?.substring(0, 80) + '...'}
                          </p>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            paddingTop: '16px',
                            borderTop: '1px solid var(--racing-gray-light)'
                          }}>
                            <div>
                              <div style={{ color: 'var(--racing-red)', fontSize: '24px', fontWeight: 900 }}>
                                {formatPrice(product.price)}
                              </div>
                              {product.unit && (
                                <div style={{ color: 'var(--racing-silver)', fontSize: '12px' }}>per {product.unit}</div>
                              )}
                            </div>
                            <span className="btn-racing" style={{ padding: '8px 16px', fontSize: '12px' }}>
                              Detail <ArrowRight size={14} />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
