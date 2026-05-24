// ============================================
// Settings Admin Page — ISOGASPUL RACING
// ============================================

import { useState, useEffect } from 'react';
import { Save, Home, FileText, MapPin, Layout, Globe, Phone, Mail, Clock, MessageSquare } from 'lucide-react';
import type { SiteSettings } from '../../types';
import { getSiteSettings, saveSiteSettings } from '../../api/adminApi';

export default function SettingsAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: 'ISOGASPUL',
    tagline: 'Solusi Isolasi Terpercaya',
    description: '',
    whatsapp_number: '6281394373007',
    email: 'info@isogaspul.com',
    address: '',
    city: '',
    province: '',
    postal_code: '',
    operating_hours: '',
    social_media: {},
    // Default frontend content
    home_hero_title: 'Solusi Isolasi Terbaik untuk Proyek Anda',
    home_hero_subtitle: 'Material insulasi berkualitas tinggi dengan harga kompetitif',
    home_hero_cta: 'Lihat Produk',
    home_featured_text: 'Produk Unggulan',
    about_title: 'Tentang Kami',
    about_content: 'Isogaspul adalah penyedia material insulasi terpercaya untuk kebutuhan industri dan rumahan.',
    about_mission: 'Memberikan solusi insulasi terbaik dengan produk berkualitas dan layanan profesional.',
    about_vision: 'Menjadi mitra terpercaya dalam solusi insulasi di Indonesia.',
    contact_phone: '021-1234567',
    contact_whatsapp: '6281394373007',
    contact_email: 'info@isogaspul.com',
    contact_address: 'Jl. Raya Industri No. XX, Jakarta',
    contact_hours: 'Senin-Jumat: 08.00-17.00',
    contact_map_embed: '',
    footer_text: 'Isogaspul - Solusi Isolasi Terpercaya',
    footer_copyright: '© 2024 Isogaspul. All rights reserved.',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await getSiteSettings();
      if (data) {
        setSettings(prev => ({
          ...prev,
          ...data,
          social_media: data.social_media || prev.social_media,
        }));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      social_media: { ...prev.social_media, [platform]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await saveSiteSettings(settings);
      alert('✅ Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('❌ Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: '⚙️ General', icon: Globe },
    { id: 'home', label: '🏠 Home Page', icon: Home },
    { id: 'about', label: '📖 About Page', icon: FileText },
    { id: 'contact', label: '📞 Contact Page', icon: MapPin },
    { id: 'footer', label: '📝 Footer', icon: Layout },
    { id: 'social', label: '📱 Social Media', icon: MessageSquare },
  ];

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">⚙️ Settings</h1>
          <p className="admin-page-subtitle">Kelola semua pengaturan website</p>
        </div>
      </div>

      <div className="admin-card">
        {/* Tabs */}
        <div style={{ borderBottom: '1px solid var(--admin-border)', marginBottom: '2rem', overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '1rem', minWidth: 'max-content' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)' : 'transparent',
                  border: activeTab === tab.id ? 'none' : '1px solid var(--admin-border)',
                  borderRadius: '8px',
                  color: activeTab === tab.id ? 'white' : 'var(--admin-text-muted)',
                  fontWeight: activeTab === tab.id ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '14px',
                }}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* General Tab */}
          {activeTab === 'general' && (
            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="admin-form-group">
                  <label className="admin-label admin-label-required">🏁 Site Name</label>
                  <input type="text" name="site_name" className="admin-input" value={settings.site_name || ''} onChange={handleInputChange} required />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">🏷️ Tagline</label>
                  <input type="text" name="tagline" className="admin-input" value={settings.tagline || ''} onChange={handleInputChange} placeholder="Your store's tagline" />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">📝 Description</label>
                <textarea name="description" className="admin-textarea" value={settings.description || ''} onChange={handleInputChange} rows={4} placeholder="Brief description of your store" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">🕐 Operating Hours</label>
                <input type="text" name="operating_hours" className="admin-input" value={settings.operating_hours || ''} onChange={handleInputChange} placeholder="e.g., Mon-Fri: 9AM-5PM" />
              </div>
            </div>
          )}

          {/* Home Page Tab */}
          {activeTab === 'home' && (
            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{ padding: '16px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '8px', borderLeft: '4px solid #F97316' }}>
                <h3 style={{ color: '#F97316', marginBottom: '8px' }}>🏠 Pengaturan Halaman Home</h3>
                <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px' }}>Kelola konten yang ditampilkan di halaman utama website</p>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">🏁 Hero Title (Judul Utama)</label>
                <input type="text" name="home_hero_title" className="admin-input" value={settings.home_hero_title || ''} onChange={handleInputChange} placeholder="Solusi Isolasi Terbaik" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">📝 Hero Subtitle (Subjudul)</label>
                <textarea name="home_hero_subtitle" className="admin-textarea" value={settings.home_hero_subtitle || ''} onChange={handleInputChange} rows={2} placeholder="Material insulasi berkualitas tinggi" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">🔘 Hero CTA (Tombol)</label>
                <input type="text" name="home_hero_cta" className="admin-input" value={settings.home_hero_cta || ''} onChange={handleInputChange} placeholder="Lihat Produk" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">⭐ Featured Section Title</label>
                <input type="text" name="home_featured_text" className="admin-input" value={settings.home_featured_text || ''} onChange={handleInputChange} placeholder="Produk Unggulan" />
              </div>
            </div>
          )}

          {/* About Page Tab */}
          {activeTab === 'about' && (
            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', borderLeft: '4px solid #3B82F6' }}>
                <h3 style={{ color: '#3B82F6', marginBottom: '8px' }}>📖 Pengaturan Halaman About</h3>
                <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px' }}>Kelola konten halaman tentang kami</p>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">📌 About Title</label>
                <input type="text" name="about_title" className="admin-input" value={settings.about_title || ''} onChange={handleInputChange} placeholder="Tentang Kami" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">📝 About Content</label>
                <textarea name="about_content" className="admin-textarea" value={settings.about_content || ''} onChange={handleInputChange} rows={5} placeholder="Deskripsi perusahaan..." />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">🎯 Misi</label>
                <textarea name="about_mission" className="admin-textarea" value={settings.about_mission || ''} onChange={handleInputChange} rows={3} placeholder="Misi perusahaan..." />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">👁️ Visi</label>
                <textarea name="about_vision" className="admin-textarea" value={settings.about_vision || ''} onChange={handleInputChange} rows={3} placeholder="Visi perusahaan..." />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">💎 Nilai-nilai Perusahaan</label>
                <textarea name="about_values" className="admin-textarea" value={settings.about_values || ''} onChange={handleInputChange} rows={3} placeholder="Nilai-nilai perusahaan..." />
              </div>
            </div>
          )}

          {/* Contact Page Tab */}
          {activeTab === 'contact' && (
            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{ padding: '16px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', borderLeft: '4px solid #22C55E' }}>
                <h3 style={{ color: '#22C55E', marginBottom: '8px' }}>📞 Pengaturan Halaman Contact</h3>
                <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px' }}>Kelola informasi kontak perusahaan</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">📱 WhatsApp</label>
                  <input type="text" name="contact_whatsapp" className="admin-input" value={settings.contact_whatsapp || ''} onChange={handleInputChange} placeholder="6281394373007" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">☎️ Phone</label>
                  <input type="text" name="contact_phone" className="admin-input" value={settings.contact_phone || ''} onChange={handleInputChange} placeholder="021-1234567" />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">📧 Email</label>
                <input type="email" name="contact_email" className="admin-input" value={settings.contact_email || ''} onChange={handleInputChange} placeholder="info@isogaspul.com" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">📍 Address</label>
                <textarea name="contact_address" className="admin-textarea" value={settings.contact_address || ''} onChange={handleInputChange} rows={2} placeholder="Jl. Raya Industri No. XX" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">🕐 Operating Hours</label>
                  <input type="text" name="contact_hours" className="admin-input" value={settings.contact_hours || ''} onChange={handleInputChange} placeholder="Senin-Jumat: 08.00-17.00" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">🗺️ Google Maps Embed</label>
                  <input type="text" name="contact_map_embed" className="admin-input" value={settings.contact_map_embed || ''} onChange={handleInputChange} placeholder="Google Maps embed URL" />
                </div>
              </div>
            </div>
          )}

          {/* Footer Tab */}
          {activeTab === 'footer' && (
            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{ padding: '16px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '8px', borderLeft: '4px solid #A855F7' }}>
                <h3 style={{ color: '#A855F7', marginBottom: '8px' }}>📝 Pengaturan Footer</h3>
                <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px' }}>Kelola konten yang tampil di bagian bawah website</p>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">📝 Footer Text</label>
                <textarea name="footer_text" className="admin-textarea" value={settings.footer_text || ''} onChange={handleInputChange} rows={2} placeholder="Footer description" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">©️ Copyright Text</label>
                <input type="text" name="footer_copyright" className="admin-input" value={settings.footer_copyright || ''} onChange={handleInputChange} placeholder="© 2024 Isogaspul. All rights reserved." />
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{ padding: '16px', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '8px', borderLeft: '4px solid #EC4899' }}>
                <h3 style={{ color: '#EC4899', marginBottom: '8px' }}>📱 Social Media</h3>
                <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px' }}>Kelola link social media perusahaan</p>
              </div>
              {['facebook', 'instagram', 'twitter', 'linkedin', 'youtube'].map(platform => (
                <div key={platform} className="admin-form-group">
                  <label className="admin-label" style={{ textTransform: 'capitalize' }}>{platform}</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={settings.social_media?.[platform] || ''}
                    onChange={(e) => handleSocialMediaChange(platform, e.target.value)}
                    placeholder={`https://${platform}.com/yourpage`}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Contact Tab (Legacy - merge into contact tab) */}
          {activeTab === 'contact' && (
            <div style={{ display: 'grid', gap: '20px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--admin-border)' }}>
              <div className="admin-form-group">
                <label className="admin-label">📧 Email</label>
                <input type="email" name="email" className="admin-input" value={settings.email || ''} onChange={handleInputChange} placeholder="contact@example.com" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">📱 WhatsApp Number</label>
                <input type="text" name="whatsapp_number" className="admin-input" value={settings.whatsapp_number || ''} onChange={handleInputChange} placeholder="628123456789" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">📍 Address</label>
                <textarea name="address" className="admin-textarea" value={settings.address || ''} onChange={handleInputChange} rows={3} placeholder="Street address" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="admin-form-group">
                  <label className="admin-label">City</label>
                  <input type="text" name="city" className="admin-input" value={settings.city || ''} onChange={handleInputChange} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Province</label>
                  <input type="text" name="province" className="admin-input" value={settings.province || ''} onChange={handleInputChange} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Postal Code</label>
                  <input type="text" name="postal_code" className="admin-input" value={settings.postal_code || ''} onChange={handleInputChange} />
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving} style={{ padding: '12px 32px', fontSize: '16px' }}>
              <Save size={20} />
              {saving ? 'Saving...' : '💾 Save All Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
