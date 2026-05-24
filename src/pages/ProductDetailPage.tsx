// ============================================
// Product Detail Page — ISOGASPUL
// ============================================

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Truck, Shield, Minus, Plus } from 'lucide-react';
import { getProduct, getTierPricing, formatPrice, getImageUrl, getProductImage } from '../api/insforge';
import { useCartStore } from '../store/cartStore';
import type { Product, TierPricing } from '../types';
import SEO from '../components/seo/SEO';
import { productSchema, breadcrumbSchema, faqSchema } from '../lib/schema';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [tiers, setTiers] = useState<TierPricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore(s => s.addItem);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getProduct(slug)
      .then((product) => {
        setProduct(product);
        if (product?.id) {
          return getTierPricing(product.id).then(setTiers).catch(() => setTiers([]));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const tierPrice = tiers.length > 0 
    ? tiers.sort((a, b) => b.min_quantity - a.min_quantity).find(t => quantity >= t.min_quantity)?.price 
    : undefined;
  const currentPrice = tierPrice || product?.price || 0;

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, tiers);
    }
  };

  if (loading) {
    return (
      <div className="detail-page">
        <div className="container">
          <div className="detail-loading">
            <div className="skeleton detail-image-skeleton" />
            <div className="detail-info-loading">
              <div className="skeleton title-skeleton" />
              <div className="skeleton price-skeleton" />
              <div className="skeleton desc-skeleton" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="detail-page">
        <div className="container">
          <div className="not-found">
            <h2>Produk tidak ditemukan</h2>
            <Link to="/produk" className="back-link"><ArrowLeft size={18} /> Kembali ke Katalog</Link>
          </div>
        </div>
      </div>
    );
  }

  const images = [
    product.image_url,
    ...(product.images || []),
  ].filter(Boolean);

  return (
    <>
      {product && (
        <SEO
          title={`${product.name} — Isogaspul Racing`}
          description={product.short_description || product.description?.replace(/[#*\|-]/g, '').substring(0, 160) || `${product.name} — produk insulasi premium dari Isogaspul`}
          canonical={`https://isogaspul.com/produk/${product.slug}`}
          ogImage={images[0] || undefined}
          ogType="product"
          keywords={`${product.name}, glasswool, rockwool, ceramicwool, insulasi, peredam suara, knalpot racing, isogaspul`}
          schema={{
            ...productSchema({
              name: product.name,
              description: product.short_description || product.name,
              image: images[0] || '/logo-isogaspul.png',
              price: product.price,
              url: `https://isogaspul.com/produk/${product.slug}`,
              sku: product.sku,
            }),
            ...breadcrumbSchema([
              { name: 'Home', url: 'https://isogaspul.com' },
              { name: 'Produk', url: 'https://isogaspul.com/produk' },
              { name: product.name, url: `https://isogaspul.com/produk/${product.slug}` },
            ]),
          }}
        />
      )}
    <div className="detail-page">
      <div className="container">
        <Link to="/produk" className="back-link"><ArrowLeft size={18} /> Kembali ke Katalog</Link>

        <div className="detail-layout">
          {/* Image Section */}
          <div className="detail-gallery">
            <div className="detail-main-image">
              <img 
                src={images[0] ? (images[0].startsWith('data:') ? images[0] : getImageUrl(images[0])) : '/placeholder.jpg'} 
                alt={product.name}
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
              />
            </div>
            {images.length > 1 && (
              <div className="detail-thumbnails">
                {images.slice(0, 5).map((img, i) => (
                  img && (
                    <div key={i} className="thumbnail">
                      <img src={img.startsWith('data:') ? img : getImageUrl(img)} alt="" />
                    </div>
                  )
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="detail-info">
            <span className="detail-category">
              {typeof product.category === 'object' ? product.category?.name : product.category}
            </span>
            <h1>{product.name}</h1>
            
            <div className="detail-price">
              {tierPrice && tierPrice < product.price && (
                <>
                  <span className="original-price">{formatPrice(product.price)}</span>
                  <span className="discount-badge">-{Math.round((1 - tierPrice / product.price) * 100)}%</span>
                </>
              )}
              <span className="current-price">{formatPrice(currentPrice)}</span>
              <span className="unit">/ {product.unit || 'unit'}</span>
            </div>

            <p className="detail-description">{product.description}</p>

            {/* Specs */}
            <div className="detail-specs">
              {product.thickness && (
                <div className="spec-item">
                  <span className="spec-label">Ketebalan</span>
                  <span className="spec-value">{product.thickness}</span>
                </div>
              )}
              {product.density && (
                <div className="spec-item">
                  <span className="spec-label">Densitas</span>
                  <span className="spec-value">{product.density}</span>
                </div>
              )}
              {product.temperature_max && (
                <div className="spec-item">
                  <span className="spec-label">Suhu Maks</span>
                  <span className="spec-value">{product.temperature_max}</span>
                </div>
              )}
              {product.fire_rating && (
                <div className="spec-item">
                  <span className="spec-label">Fire Rating</span>
                  <span className="spec-value">{product.fire_rating}</span>
                </div>
              )}
            </div>

            {/* Tier Pricing */}
            {tiers.length > 0 && (
              <div className="tier-pricing">
                <h3>Harga Grosir</h3>
                <div className="tier-list">
                  {tiers.map((tier) => (
                    <div key={tier.id} className={`tier-item ${quantity >= tier.min_quantity ? 'active' : ''}`}>
                      <span className="tier-qty">{tier.max_quantity ? `${tier.min_quantity}-${tier.max_quantity}` : `${tier.min_quantity}+`} pcs</span>
                      <span className="tier-price">{formatPrice(tier.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="detail-actions">
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={18} /></button>
                <span className="quantity-value">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}><Plus size={18} /></button>
              </div>
              <button onClick={handleAddToCart} className="add-to-cart-btn">
                <ShoppingBag size={20} />
                Tambah ke Keranjang
              </button>
            </div>

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="badge-item">
                <Truck size={20} />
                <span>Pengiriman ke seluruh Indonesia</span>
              </div>
              <div className="badge-item">
                <Shield size={20} />
                <span>Produk original import</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
