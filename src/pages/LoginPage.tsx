// Login Page — ISOGASPUL
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(form.email, form.password);
    if (!useAuthStore.getState().error) navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/" className="auth-back"><ArrowLeft size={18} /> Kembali</Link>
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon"><LogIn size={32} /></div>
            <h1>Masuk</h1>
            <p>Masuk ke akun Isogaspul Anda</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label><Mail size={16} /> Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="email@example.com" />
            </div>
            <div className="form-group">
              <label><Lock size={16} /> Password</label>
              <div className="password-input">
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required placeholder="Password Anda" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <p className="auth-footer">
            Belum punya akun? <Link to="/register">Daftar Sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
