// Cart Page — ISOGASPUL
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { formatPrice, getProductImage } from '../api/insforge';
import './CartPage.css';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <ShoppingBag size={64} />
            <h2>Keranjang Kosong</h2>
            <p>Belum ada produk di keranjang Anda.</p>
            <Link to="/produk" className="btn-primary">Lihat Produk</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Keranjang Belanja</h1>
          <span className="cart-count">{items.reduce((s, i) => s + i.quantity, 0)} item</span>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => {
              const price = item.tier_price || item.product.price;
              return (
                <div key={item.product.id} className="cart-item">
                  <Link to={`/produk/${item.product.slug}`} className="cart-item-image">
                    <img src={getProductImage(item.product)} alt={item.product.name} />
                  </Link>
                  <div className="cart-item-info">
                    <h3><Link to={`/produk/${item.product.slug}`}>{item.product.name}</Link></h3>
                    {item.product.thickness && <span className="cart-item-tag">{item.product.thickness}</span>}
                    {item.product.density && <span className="cart-item-tag">{item.product.density}</span>}
                  </div>
                  <div className="cart-item-actions">
                    <div className="quantity-selector">
                      <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}><Minus size={16} /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}><Plus size={16} /></button>
                    </div>
                    <div className="cart-item-price">
                      <span className="price-per-item">{formatPrice(price)}</span>
                      <span className="price-total">{formatPrice(price * item.quantity)}</span>
                    </div>
                    <button onClick={() => removeItem(item.product.id)} className="remove-btn" title="Hapus">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
            <button onClick={clearCart} className="clear-cart-btn">Kosongkan Keranjang</button>
          </div>

          <div className="cart-summary">
            <h2>Ringkasan</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="summary-row shipping-note">
              <span>Biaya Kirim</span>
              <span>Menunggu konfirmasi admin via WA</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <button onClick={() => navigate('/checkout')} className="checkout-btn">
              Checkout <ArrowRight size={18} />
            </button>
            <p className="checkout-note">Checkout via WhatsApp — admin akan konfirmasi biaya kirim</p>
          </div>
        </div>
      </div>
    </div>
  );
}
