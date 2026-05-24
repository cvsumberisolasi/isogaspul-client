// ============================================
// Admin Dashboard Overview — ISOGASPUL RACING
// ============================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, AlertTriangle, Eye, Plus, ChevronRight, BarChart3 } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { AdminStats } from '../../types';
import { getAdminStats, getRevenueChartData, getOrdersByStatus, getRecentOrders, getLowStockProducts } from '../../api/adminApi';
import type { RevenueDataPoint, OrderStatusData } from '../../api/adminApi';

const COLORS = ['#F97316', '#3B82F6', '#22C55E', '#EAB308', '#EF4444'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<OrderStatusData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, revenueChartData, statusData, recentOrdersData, lowStockData] = await Promise.all([
        getAdminStats(),
        getRevenueChartData(7),
        getOrdersByStatus(),
        getRecentOrders(5),
        getLowStockProducts(5),
      ]);

      setStats(statsData);
      setRevenueData(revenueChartData);
      setOrdersByStatus(statusData);
      setRecentOrders(recentOrdersData);
      setLowStockItems(lowStockData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: '#EAB308',
      confirmed: '#3B82F6',
      processing: '#3B82F6',
      shipped: '#22C55E',
      delivered: '#22C55E',
      cancelled: '#EF4444',
    };
    return colors[status?.toLowerCase()] || '#94A3B8';
  };

  const getStatusBadge = (status: string) => {
    const color = getStatusColor(status);
    return (
      <span style={{ 
        padding: '4px 12px', 
        background: color, 
        color: 'white', 
        borderRadius: '20px', 
        fontSize: '12px', 
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid var(--racing-gray-light)', borderTopColor: 'var(--racing-red)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ color: 'var(--racing-white)', fontSize: '32px', fontWeight: 900, marginBottom: '8px', background: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🏁 Dashboard
        </h1>
        <p style={{ color: 'var(--racing-silver)', fontSize: '16px' }}>Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {/* Total Revenue */}
        <div style={{ 
          padding: '24px', 
          background: 'var(--racing-gray)', 
          borderRadius: '12px',
          border: '1px solid var(--racing-gray-light)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.borderColor = 'var(--racing-yellow)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(234, 179, 8, 0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = 'var(--racing-gray-light)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        >
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            width: '60px', 
            height: '60px', 
            background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, transparent 100%)',
            borderRadius: '0 12px 0 0'
          }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(234, 179, 8, 0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={24} style={{ color: 'var(--racing-yellow)' }} />
            </div>
            <div style={{ color: 'var(--racing-silver)', fontSize: '14px', fontWeight: 600 }}>Total Revenue</div>
          </div>
          <div style={{ color: 'var(--racing-yellow)', fontSize: '28px', fontWeight: 900, marginBottom: '8px' }}>{formatPrice(stats?.total_revenue || 0)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--racing-green)', fontSize: '14px', fontWeight: 600 }}>
            <TrendingUp size={14} />
            +{stats?.revenue_growth}% from last month
          </div>
        </div>

        {/* Total Orders */}
        <div style={{ 
          padding: '24px', 
          background: 'var(--racing-gray)', 
          borderRadius: '12px',
          border: '1px solid var(--racing-gray-light)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.borderColor = 'var(--racing-red)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = 'var(--racing-gray-light)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        >
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            width: '60px', 
            height: '60px', 
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, transparent 100%)',
            borderRadius: '0 12px 0 0'
          }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingCart size={24} style={{ color: 'var(--racing-red)' }} />
            </div>
            <div style={{ color: 'var(--racing-silver)', fontSize: '14px', fontWeight: 600 }}>Total Orders</div>
          </div>
          <div style={{ color: 'var(--racing-white)', fontSize: '28px', fontWeight: 900, marginBottom: '8px' }}>{stats?.total_orders}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--racing-green)', fontSize: '14px', fontWeight: 600 }}>
            <TrendingUp size={14} />
            +{stats?.orders_growth}% from last month
          </div>
        </div>

        {/* Total Customers */}
        <div style={{ 
          padding: '24px', 
          background: 'var(--racing-gray)', 
          borderRadius: '12px',
          border: '1px solid var(--racing-gray-light)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.borderColor = 'var(--racing-blue)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = 'var(--racing-gray-light)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        >
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            width: '60px', 
            height: '60px', 
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, transparent 100%)',
            borderRadius: '0 12px 0 0'
          }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={24} style={{ color: '#3B82F6' }} />
            </div>
            <div style={{ color: 'var(--racing-silver)', fontSize: '14px', fontWeight: 600 }}>Total Customers</div>
          </div>
          <div style={{ color: 'var(--racing-white)', fontSize: '28px', fontWeight: 900, marginBottom: '8px' }}>{stats?.total_customers}</div>
          <div style={{ color: 'var(--racing-silver)', fontSize: '14px' }}>Active members</div>
        </div>

        {/* Total Products */}
        <div style={{ 
          padding: '24px', 
          background: 'var(--racing-gray)', 
          borderRadius: '12px',
          border: '1px solid var(--racing-gray-light)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.borderColor = 'var(--racing-green)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(34, 197, 94, 0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = 'var(--racing-gray-light)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        >
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            width: '60px', 
            height: '60px', 
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, transparent 100%)',
            borderRadius: '0 12px 0 0'
          }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(34, 197, 94, 0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={24} style={{ color: 'var(--racing-green)' }} />
            </div>
            <div style={{ color: 'var(--racing-silver)', fontSize: '14px', fontWeight: 600 }}>Total Products</div>
          </div>
          <div style={{ color: 'var(--racing-white)', fontSize: '28px', fontWeight: 900, marginBottom: '8px' }}>{stats?.total_products}</div>
          {stats?.low_stock_products ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--racing-red)', fontSize: '14px', fontWeight: 600 }}>
              <AlertTriangle size={14} />
              {stats.low_stock_products} low stock
            </div>
          ) : (
            <div style={{ color: 'var(--racing-green)', fontSize: '14px', fontWeight: 600 }}>All in stock</div>
          )}
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Revenue Chart */}
        <div style={{ 
          padding: '24px', 
          background: 'var(--racing-gray)', 
          borderRadius: '12px',
          border: '1px solid var(--racing-gray-light)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: 'var(--racing-white)', fontSize: '18px', fontWeight: 700 }}>📊 Revenue Overview</h3>
            <div style={{ color: 'var(--racing-silver)', fontSize: '12px' }}>Last 7 days</div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip 
                contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#F8FAFC' }}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={3} name="Revenue (IDR)" dot={{ fill: '#F97316', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Status */}
        <div style={{ 
          padding: '24px', 
          background: 'var(--racing-gray)', 
          borderRadius: '12px',
          border: '1px solid var(--racing-gray-light)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: 'var(--racing-white)', fontSize: '18px', fontWeight: 700 }}>🛒 Orders by Status</h3>
          </div>
          {ordersByStatus.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--racing-silver)' }}>
              <div style={{ textAlign: 'center' }}>
                <ShoppingCart size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p>No orders yet</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {ordersByStatus.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Empty State Message if no data at all */}
      {stats?.total_orders === 0 && stats?.total_products === 0 && stats?.total_customers === 0 && (
        <div style={{ 
          marginTop: '24px', 
          textAlign: 'center', 
          padding: '48px', 
          background: 'var(--racing-gray)', 
          borderRadius: '12px',
          border: '1px solid var(--racing-gray-light)'
        }}>
          <Package size={64} style={{ color: 'var(--racing-gray-light)', marginBottom: '16px' }} />
          <h3 style={{ color: 'var(--racing-white)', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Dashboard Empty</h3>
          <p style={{ color: 'var(--racing-silver)', marginBottom: '24px' }}>Start by adding some products or wait for your first order to appear here.</p>
          <Link 
            to="/admin/products/new" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '12px 24px', 
              background: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)', 
              border: 'none', 
              borderRadius: '8px', 
              color: 'var(--racing-white)', 
              fontSize: '14px', 
              fontWeight: 700, 
              cursor: 'pointer', 
              textDecoration: 'none' 
            }}
          >
            <Plus size={20} />
            Add Product
          </Link>
        </div>
      )}

      {/* Recent Orders & Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Recent Orders */}
        <div style={{ 
          padding: '24px', 
          background: 'var(--racing-gray)', 
          borderRadius: '12px',
          border: '1px solid var(--racing-gray-light)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: 'var(--racing-white)', fontSize: '18px', fontWeight: 700 }}>📦 Recent Orders</h3>
            <Link 
              to="/admin/orders" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px', 
                padding: '8px 16px', 
                background: 'var(--racing-black)', 
                border: '1px solid var(--racing-gray-light)', 
                borderRadius: '8px', 
                color: 'var(--racing-silver)', 
                fontSize: '12px', 
                fontWeight: 600, 
                cursor: 'pointer', 
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'var(--racing-gray-light)';
                e.currentTarget.style.color = 'var(--racing-white)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'var(--racing-black)';
                e.currentTarget.style.color = 'var(--racing-silver)';
              }}
            >
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div>
            {recentOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: 'var(--racing-silver)' }}>
                No orders yet
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '16px', 
                  marginBottom: '8px', 
                  background: 'var(--racing-black)', 
                  borderRadius: '8px',
                  border: '1px solid var(--racing-gray-light)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--racing-red)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'var(--racing-gray-light)';
                }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'var(--racing-white)', fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>
                      {order.order_number || `#${order.id.slice(0, 8)}`}
                    </div>
                    <div style={{ color: 'var(--racing-silver)', fontSize: '12px' }}>
                      {order.customer_name || order.customer_email || '-'} • {order.created_at ? new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
                    </div>
                  </div>
                  <div style={{ color: 'var(--racing-yellow)', fontSize: '16px', fontWeight: 700, marginRight: '16px' }}>
                    {formatPrice(order.total || 0)}
                  </div>
                  {getStatusBadge(order.status)}
                  <Link 
                    to={`/admin/orders/${order.id}`}
                    style={{ 
                      marginLeft: '12px', 
                      padding: '8px', 
                      background: 'var(--racing-gray)', 
                      borderRadius: '6px', 
                      color: 'var(--racing-silver)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'var(--racing-red)';
                      e.currentTarget.style.color = 'var(--racing-white)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'var(--racing-gray)';
                      e.currentTarget.style.color = 'var(--racing-silver)';
                    }}
                  >
                    <Eye size={14} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Alerts */}
        <div style={{ 
          padding: '24px', 
          background: 'var(--racing-gray)', 
          borderRadius: '12px',
          border: '1px solid var(--racing-gray-light)'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: 'var(--racing-white)', fontSize: '18px', fontWeight: 700 }}>⚠️ Alerts</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {lowStockItems.length > 0 && (
              <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', borderLeft: '4px solid #EF4444' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <AlertTriangle size={16} color="#EF4444" />
                  <strong style={{ color: '#EF4444', fontSize: '14px' }}>Low Stock Alert</strong>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--racing-silver)' }}>
                  {lowStockItems.length} products are running low on stock
                </p>
                <Link 
                  to="/admin/products"
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '4px', 
                    marginTop: '12px', 
                    color: 'var(--racing-red)', 
                    fontSize: '12px', 
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  View Products <ChevronRight size={12} />
                </Link>
              </div>
            )}

            <div style={{ padding: '16px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', borderLeft: '4px solid #22C55E' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <TrendingUp size={16} color="#22C55E" />
                <strong style={{ color: '#22C55E', fontSize: '14px' }}>Revenue Growth</strong>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--racing-silver)' }}>
                Revenue {stats?.revenue_growth && stats.revenue_growth > 0 ? 'increased' : 'changed'} by {Math.abs(stats?.revenue_growth || 0).toFixed(1)}% this month
              </p>
            </div>

            <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', borderLeft: '4px solid #3B82F6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <BarChart3 size={16} color="#3B82F6" />
                <strong style={{ color: '#3B82F6', fontSize: '14px' }}>Analytics Available</strong>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--racing-silver)' }}>
                View detailed analytics and reports
              </p>
              <Link 
                to="/admin/analytics"
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  marginTop: '12px', 
                  color: '#3B82F6', 
                  fontSize: '12px', 
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                View Analytics <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
