// Register Page — ISOGASPUL
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import './LoginPage.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(form.email, form.password, form.name);
    if (!useAuthStore.getState().error) navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/" className="auth-back"><ArrowLeft size={18} /> Kembali</Link>
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon"><UserPlus size={32} /></div>
            <h1>Daftar</h1>
            <p>Buat akun Isogaspul Anda</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label><User size={16} /> Nama Lengkap</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Nama lengkap" />
            </div>
            <div className="form-group">
              <label><Mail size={16} /> Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="email@example.com" />
            </div>
            <div className="form-group">
              <label><Lock size={16} /> Password</label>
              <div className="password-input">
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required placeholder="Min. 6 karakter" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading ? 'Memproses...' : 'Daftar'}
            </button>
          </form>

          <p className="auth-footer">
            Sudah punya akun? <Link to="/login">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
