// ============================================
// Customers Admin Page — ISOGASPUL
// ============================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Eye, Mail, Phone } from 'lucide-react';
import { formatPrice } from '../../api/insforge';
import { getCustomers } from '../../api/adminApi';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  total_orders: number;
  total_spent: number;
  created_at: string;
}

export default function CustomersAdmin() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers(100);
      // Map user data to Customer interface
      const mappedCustomers = data.map((user: any) => ({
        id: user.id,
        name: user.name || user.email?.split('@')[0] || 'Unknown',
        email: user.email,
        phone: user.phone,
        total_orders: user.total_orders || 0,
        total_spent: user.total_spent || 0,
        created_at: user.created_at,
      }));
      setCustomers(mappedCustomers);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.phone?.includes(searchQuery);
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          <h1 className="admin-page-title">Customers</h1>
          <p className="admin-page-subtitle">Manage your customer base</p>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              className="admin-input"
              style={{ paddingLeft: '2.5rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="admin-btn admin-btn-secondary">
            <Filter size={20} />
            More Filters
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="admin-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Total Orders</th>
                <th>Total Spent</th>
                <th>Registered</th>
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="admin-empty-state">
                      <div className="admin-empty-icon">👥</div>
                      <h3 className="admin-empty-title">No customers found</h3>
                      <p className="admin-empty-text">Customers will appear here once they register</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{customer.name}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ fontSize: '0.875rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Mail size={14} />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div style={{ fontSize: '0.875rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Phone size={14} />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="admin-badge admin-badge-info">{customer.total_orders} orders</span>
                    </td>
                    <td>{formatPrice(customer.total_spent)}</td>
                    <td>{new Date(customer.created_at).toLocaleDateString('id-ID')}</td>
                    <td>
                      <Link to={`/admin/customers/${customer.id}`} className="admin-btn admin-btn-sm admin-btn-icon" title="View Details">
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--admin-border)' }}>
            <div style={{ color: '#94A3B8', fontSize: '0.875rem' }}>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="admin-btn admin-btn-sm admin-btn-secondary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`admin-btn admin-btn-sm ${page === currentPage ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="admin-btn admin-btn-sm admin-btn-secondary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
