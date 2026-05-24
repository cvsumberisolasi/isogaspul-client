// ============================================
// Admin Login Page — ISOGASPUL
// Dedicated login page for admin users
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(email, password);
      
      // Check if user has admin role
      const user = useAuthStore.getState().user;
      if (user?.role === 'super_admin') {
        navigate('/admin');
      } else {
        alert('Access denied. Admin privileges required.');
        useAuthStore.getState().logout();
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#1E293B',
        borderRadius: '1rem',
        padding: '2.5rem',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        border: '1px solid #334155'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #F97316, #EAB308)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 10px 30px rgba(249, 115, 22, 0.3)'
          }}>
            <Shield size={40} color="white" />
          </div>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 700,
            color: '#F8FAFC',
            marginBottom: '0.5rem'
          }}>
            Admin Login
          </h1>
          <p style={{
            color: '#94A3B8',
            fontSize: '0.875rem'
          }}>
            ISOGASPUL Dashboard
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #EF4444',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <AlertCircle size={20} color="#EF4444" />
            <span style={{ color: '#FCA5A5', fontSize: '0.875rem' }}>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: '#F8FAFC',
              fontSize: '0.875rem',
              fontWeight: 500,
              marginBottom: '0.5rem'
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748B'
              }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@isogaspul.com"
                required
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 3rem',
                  background: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: '0.5rem',
                  color: '#F8FAFC',
                  fontSize: '0.9375rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#F97316'}
                onBlur={(e) => e.target.style.borderColor = '#334155'}
              />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              color: '#F8FAFC',
              fontSize: '0.875rem',
              fontWeight: 500,
              marginBottom: '0.5rem'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748B'
              }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 3rem',
                  background: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: '0.5rem',
                  color: '#F8FAFC',
                  fontSize: '0.9375rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#F97316'}
                onBlur={(e) => e.target.style.borderColor = '#334155'}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '1rem',
              background: isLoading ? '#64748B' : 'linear-gradient(135deg, #F97316, #EAB308)',
              border: 'none',
              borderRadius: '0.5rem',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(249, 115, 22, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.3)';
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #334155',
          textAlign: 'center'
        }}>
          <p style={{ color: '#64748B', fontSize: '0.8125rem' }}>
            Protected area. Authorized personnel only.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              marginTop: '1rem',
              background: 'none',
              border: 'none',
              color: '#F97316',
              fontSize: '0.875rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Back to Website
          </button>
        </div>
      </div>
    </div>
  );
}
