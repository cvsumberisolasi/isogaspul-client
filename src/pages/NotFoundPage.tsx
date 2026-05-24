import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <h1 style={{ fontSize: '120px', fontWeight: 900, background: 'linear-gradient(135deg, #F97316, #EF4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: '16px' }}>404</h1>
        <h2 style={{ color: 'var(--racing-white)', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Halaman Tidak Ditemukan</h2>
        <p style={{ color: 'var(--racing-silver)', fontSize: '16px', marginBottom: '32px' }}>
          Halaman yang Anda cari mungkin sudah dipindahkan atau tidak tersedia.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: 'var(--gradient-racing)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 700, textDecoration: 'none', fontSize: '16px' }}>
            <Home size={18} /> Ke Beranda
          </Link>
          <Link to="/produk" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: 'var(--racing-gray)', border: '1px solid var(--racing-gray-light)', borderRadius: '8px', color: 'var(--racing-silver)', fontWeight: 600, textDecoration: 'none', fontSize: '16px' }}>
            <Search size={18} /> Lihat Produk
          </Link>
        </div>
      </div>
    </div>
  );
}