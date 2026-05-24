// ============================================
// Profile Page — ISOGASPUL Dashboard
// ============================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Save, Key, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import './DashboardPage.css';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState((user as any)?.phone || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  const API_BASE = import.meta.env.VITE_INSFORGE_API_URL || 'https://c8kze9fw.ap-southeast.insforge.app';
  const ANON_KEY = import.meta.env.VITE_INSFORGE_ADMIN_KEY || 'ik_a2c69f99f1209ba9b4bc9ff9e7ed9762';
  const token = localStorage.getItem('auth_token');

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await fetch(`${API_BASE}/api/database/records/customers/${user?.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token || ANON_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });

      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
    } catch {
      setMessage({ type: 'error', text: 'Gagal memperbarui profil.' });
    } finally { setLoading(false); }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const newPass = formData.get('new_password') as string;
    const confirmPass = formData.get('confirm_password') as string;

    if (newPass !== confirmPass) {
      setMessage({ type: 'error', text: 'Password baru tidak cocok!' });
      return;
    }

    if (newPass.length < 6) {
      setMessage({ type: 'error', text: 'Password minimal 6 karakter!' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await fetch(`${API_BASE}/api/auth/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, password: newPass }),
      });

      setMessage({ type: 'success', text: 'Password berhasil diubah!' });
      form.reset();
    } catch {
      setMessage({ type: 'error', text: 'Gagal mengubah password. Hubungi admin.' });
    } finally { setLoading(false); }
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="order-detail-page">
          <Link to="/dashboard" className="back-link"><ArrowLeft size={16} /> Kembali ke Dashboard</Link>

          <div className="page-header">
            <h1><User size={24} /> Profil Saya</h1>
          </div>

          {message && (
            <div className={`alert ${message.type}`}>
              {message.type === 'error' ? <AlertTriangle size={16} /> : null}
              {message.text}
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSaveProfile} className="profile-form">
            <h3>Informasi Profil</h3>
            <div className="form-grid">
              <div className="form-group">
                <label><Mail size={14} /> Email</label>
                <input type="email" value={user?.email || ''} disabled className="input-disabled" />
                <span className="input-note">Email tidak dapat diubah</span>
              </div>
              <div className="form-group">
                <label><User size={14} /> Nama</label>
                <input name="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label><Phone size={14} /> No. Telepon</label>
                <input name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            <button type="submit" className="btn-save" disabled={loading}>
              <Save size={16} /> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>

          {/* Password Form */}
          <form onSubmit={handleChangePassword} className="profile-form">
            <h3><Key size={16} /> Ganti Password</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Password Baru</label>
                <input type="password" name="new_password" required minLength={6} />
              </div>
              <div className="form-group">
                <label>Konfirmasi Password</label>
                <input type="password" name="confirm_password" required minLength={6} />
              </div>
            </div>
            <button type="submit" className="btn-save" disabled={loading}>
              <Key size={16} /> {loading ? 'Mengubah...' : 'Ganti Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
