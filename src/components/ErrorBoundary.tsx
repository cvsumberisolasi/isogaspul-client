import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: '40px 20px' }}>
          <div style={{ textAlign: 'center', maxWidth: '500px' }}>
            <div style={{ width: '80px', height: '80px', background: 'rgba(239,68,68,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <AlertTriangle size={40} color="#EF4444" />
            </div>
            <h2 style={{ color: 'var(--racing-white)', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Terjadi Kesalahan</h2>
            <p style={{ color: 'var(--racing-silver)', fontSize: '14px', marginBottom: '24px' }}>
              {this.state.error?.message || 'Halaman ini mengalami masalah. Silakan coba lagi.'}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => this.setState({ hasError: false, error: null })} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--gradient-racing)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                <RefreshCw size={16} /> Coba Lagi
              </button>
              <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--racing-gray)', border: '1px solid var(--racing-gray-light)', borderRadius: '8px', color: 'var(--racing-silver)', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}>
                <Home size={16} /> Ke Beranda
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}