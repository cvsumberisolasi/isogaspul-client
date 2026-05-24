// ============================================
// Addresses Page — ISOGASPUL Dashboard
// Migrated to Database (user_addresses table)
// ============================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, MapPin, Pencil, Trash2, Star, Home, Building } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getUserAddresses, createAddress, updateAddress, deleteAddress, type UserAddress } from '../api/insforge';
import './DashboardPage.css';

export default function AddressesPage() {
  const { user } = useAuthStore();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<UserAddress | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      loadAddresses();
      migrateFromLocalStorage();
    }
  }, [user]);

  async function loadAddresses() {
    if (!user) return;
    try {
      const data = await getUserAddresses(user.id);
      setAddresses(data);
    } catch (error) {
      console.error('Failed to load addresses:', error);
    } finally {
      setLoading(false);
    }
  }

  // Migrate addresses from localStorage to database (one-time)
  async function migrateFromLocalStorage() {
    if (!user) return;
    
    const localKey = `addresses_${user.id}`;
    const localData = localStorage.getItem(localKey);
    
    if (localData) {
      try {
        const localAddresses = JSON.parse(localData);
        
        // Check if already migrated
        const existingAddresses = await getUserAddresses(user.id);
        if (existingAddresses.length > 0) {
          // Already migrated, clear localStorage
          localStorage.removeItem(localKey);
          return;
        }

        // Migrate each address
        for (const addr of localAddresses) {
          await createAddress({
            customer_id: user.id,
            label: addr.label || 'Rumah',
            recipient_name: addr.name,
            phone: addr.phone,
            address: addr.address,
            city: addr.city || '',
            province: addr.province || '',
            postal_code: addr.postal_code || '',
            is_default: addr.is_default || false,
          });
        }

        // Clear localStorage after successful migration
        localStorage.removeItem(localKey);
        await loadAddresses();
        console.log('✅ Addresses migrated from localStorage to database');
      } catch (error) {
        console.error('Failed to migrate addresses:', error);
      }
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    
    const addressData = {
      customer_id: user.id,
      label: form.get('label') as string || 'Rumah',
      recipient_name: form.get('recipient_name') as string,
      phone: form.get('phone') as string,
      address: form.get('address') as string,
      city: form.get('city') as string || '',
      province: form.get('province') as string || '',
      postal_code: form.get('postal_code') as string || '',
      is_default: form.get('is_default') === 'on',
    };

    try {
      if (editing) {
        await updateAddress(editing.id, addressData);
      } else {
        await createAddress(addressData);
      }
      
      setShowForm(false);
      setEditing(null);
      await loadAddresses();
    } catch (error) {
      console.error('Failed to save address:', error);
      alert('Gagal menyimpan alamat. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSetDefault(addr: UserAddress) {
    if (!user) return;
    try {
      await updateAddress(addr.id, { is_default: true, customer_id: user.id });
      await loadAddresses();
    } catch (error) {
      console.error('Failed to set default:', error);
      alert('Gagal mengatur alamat default.');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus alamat ini?')) return;
    try {
      await deleteAddress(id);
      await loadAddresses();
    } catch (error) {
      console.error('Failed to delete address:', error);
      alert('Gagal menghapus alamat.');
    }
  }

  if (loading) return (
    <div className="dashboard-page">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid var(--racing-gray-light)', borderTopColor: 'var(--racing-red)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="order-detail-page">
          <Link to="/dashboard" className="back-link"><ArrowLeft size={16} /> Kembali ke Dashboard</Link>

          <div className="page-header">
            <h1><MapPin size={24} /> Alamat Saya</h1>
            <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-add-address">
              <Plus size={16} /> Tambah Alamat
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSave} className="address-form">
              <h3>{editing ? 'Edit Alamat' : 'Tambah Alamat Baru'}</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Label</label>
                  <select name="label" defaultValue={editing?.label || 'Rumah'}>
                    <option value="Rumah">🏠 Rumah</option>
                    <option value="Kantor">🏢 Kantor</option>
                    <option value="Gudang">🏭 Gudang</option>
                    <option value="Lainnya">📍 Lainnya</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Nama Penerima</label>
                  <input name="recipient_name" required defaultValue={editing?.recipient_name || ''} />
                </div>
                <div className="form-group">
                  <label>No. Telepon</label>
                  <input name="phone" required defaultValue={editing?.phone || ''} />
                </div>
                <div className="form-group full">
                  <label>Alamat Lengkap</label>
                  <textarea name="address" required defaultValue={editing?.address || ''} rows={3} />
                </div>
                <div className="form-group">
                  <label>Kota</label>
                  <input name="city" required defaultValue={editing?.city || ''} />
                </div>
                <div className="form-group">
                  <label>Provinsi</label>
                  <input name="province" required defaultValue={editing?.province || ''} />
                </div>
                <div className="form-group">
                  <label>Kode Pos</label>
                  <input name="postal_code" defaultValue={editing?.postal_code || ''} />
                </div>
                <div className="form-group full">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" name="is_default" defaultChecked={editing?.is_default || false} />
                    <Star size={16} style={{ color: 'var(--racing-yellow)' }} />
                    Jadikan alamat default
                  </label>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="btn-cancel" disabled={submitting}>Batal</button>
                <button type="submit" className="btn-save" disabled={submitting}>
                  {submitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          )}

          {addresses.length === 0 ? (
            <div className="empty-addresses">
              <MapPin size={48} />
              <h3>Belum ada alamat tersimpan</h3>
              <p>Tambahkan alamat pengiriman Anda.</p>
            </div>
          ) : (
            <div className="addresses-list">
              {addresses.map(addr => (
                <div key={addr.id} className={`address-card ${addr.is_default ? 'default' : ''}`}>
                  <div className="address-card-header">
                    <span className="address-label">
                      {addr.label === 'Rumah' ? <Home size={16} /> : <Building size={16} />}
                      {addr.label || 'Alamat'}
                      {addr.is_default && <span className="default-badge"><Star size={12} /> Default</span>}
                    </span>
                  </div>
                  <div className="address-card-body">
                    <p><strong>{addr.recipient_name}</strong></p>
                    <p>{addr.phone}</p>
                    <p className="address-full">{addr.address}, {addr.city}, {addr.province} {addr.postal_code}</p>
                  </div>
                  <div className="address-card-actions">
                    <button onClick={() => { setEditing(addr); setShowForm(true); }} className="btn-action-edit">
                      <Pencil size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(addr.id)} className="btn-action-delete">
                      <Trash2 size={14} /> Hapus
                    </button>
                    {!addr.is_default && (
                      <button onClick={() => handleSetDefault(addr)} className="btn-action-default">
                        <Star size={14} /> Set Default
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
