// ============================================
// Admin API Functions — ISOGASPUL
// CRUD operations for admin dashboard
// ============================================

import type { Product, Order, Blog, Category } from '../types';
import { getAuthToken } from './insforge';

const API_BASE_URL = 'https://c8kze9fw.ap-southeast.insforge.app';
const ANON_KEY = 'ik_a2c69f99f1209ba9b4bc9ff9e7ed9762';

function getAuthHeader(): string {
  const token = getAuthToken();
  // Use anon key for admin-dev-token or when no valid token exists
  if (token === 'admin-dev-token' || !token) {
    return `Bearer ${ANON_KEY}`;
  }
  return `Bearer ${token}`;
}

async function adminFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}/api/database/records/${endpoint}`;

  const headers: Record<string, string> = {
    'Authorization': getAuthHeader(),
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    let errorMsg = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errBody = await response.json();
      if (errBody.message) errorMsg = errBody.message;
    } catch {}
    throw new Error(errorMsg);
  }

  if (response.status === 204) return {} as T;
  return response.json();
}

// ============================================
// Products Admin API
// ============================================

export async function createProduct(data: Partial<Product>): Promise<Product> {
  return adminFetch<Product>('products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  return adminFetch<Product>(`products?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await adminFetch<void>(`products?id=eq.${id}`, {
    method: 'DELETE',
  });
}

// ============================================
// Orders Admin API
// ============================================

export async function updateOrderStatus(
  id: string,
  status: string,
  notes?: string,
  shippingCost?: number
): Promise<Order> {
  const body: Record<string, unknown> = { status };
  if (notes !== undefined) body.notes = notes;
  if (shippingCost !== undefined) {
    body.shipping_cost = shippingCost;
    const [order] = await adminFetch<Order[]>(`orders?id=eq.${id}&limit=1`);
    if (order) body.total = order.subtotal + shippingCost;
  }
  return adminFetch<Order>(`orders?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function deleteOrder(id: string): Promise<void> {
  await adminFetch<void>(`orders?id=eq.${id}`, {
    method: 'DELETE',
  });
}

// ============================================
// Blogs Admin API
// ============================================

export async function createBlog(data: Partial<Blog>): Promise<Blog> {
  return adminFetch<Blog>('blogs', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      published_at: data.is_published ? new Date().toISOString() : null,
    }),
  });
}

export async function updateBlog(id: string, data: Partial<Blog>): Promise<Blog> {
  return adminFetch<Blog>(`blogs?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      ...data,
      published_at: data.is_published ? new Date().toISOString() : null,
    }),
  });
}

export async function deleteBlog(id: string): Promise<void> {
  await adminFetch<void>(`blogs?id=eq.${id}`, {
    method: 'DELETE',
  });
}

// ============================================
// Categories Admin API
// ============================================

export async function createCategory(data: Partial<Category>): Promise<Category> {
  return adminFetch<Category>('categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<Category> {
  return adminFetch<Category>(`categories?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  await adminFetch<void>(`categories?id=eq.${id}`, {
    method: 'DELETE',
  });
}

// ============================================
// Settings Admin API
// ============================================

export async function updateSiteSettings(data: Record<string, any>): Promise<void> {
  // Assuming settings table has a single row with id=1
  await adminFetch<void>('site_settings?id=eq.1', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// ============================================
// Analytics API
// ============================================

export interface AdminStats {
  total_orders: number;
  total_revenue: number;
  total_customers: number;
  total_products: number;
  pending_orders: number;
  low_stock_products: number;
  revenue_growth: number;
  orders_growth: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    // Fetch all orders
    const ordersResponse = await adminFetch<any[]>('orders?limit=1000&order=created_at.desc');
    const orders = ordersResponse || [];

    // Fetch all products
    const productsResponse = await adminFetch<any[]>('products?limit=1000');
    const products = productsResponse || [];

    // Fetch all customers
    const customersResponse = await adminFetch<any[]>('customers?limit=1000');
    const customers = customersResponse || [];

    // Calculate stats
    const total_orders = orders.length;
    const total_revenue = orders.reduce((sum: number, order: any) => {
      return sum + (Number(order.total) || 0);
    }, 0);
    const total_customers = customers.length;
    const total_products = products.length;

    // Count pending orders
    const pending_orders = orders.filter((o: any) => 
      o.status === 'pending' || o.status === 'Pending'
    ).length;

    // Count low stock products (stock < 10)
    const low_stock_products = products.filter((p: any) => {
      const stock = Number(p.stock) || 0;
      return stock < 10;
    }).length;

    // Calculate revenue growth (compare current month vs last month)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthOrders = orders.filter((o: any) => {
      const date = new Date(o.created_at);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const lastMonthOrders = orders.filter((o: any) => {
      const date = new Date(o.created_at);
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    });

    const currentRevenue = currentMonthOrders.reduce((sum: number, order: any) => 
      sum + (Number(order.total) || 0), 0
    );
    const lastMonthRevenue = lastMonthOrders.reduce((sum: number, order: any) => 
      sum + (Number(order.total) || 0), 0
    );

    const revenue_growth = lastMonthRevenue > 0 
      ? ((currentRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    const orders_growth = lastMonthOrders.length > 0
      ? ((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100
      : 0;

    return {
      total_orders,
      total_revenue,
      total_customers,
      total_products,
      pending_orders,
      low_stock_products,
      revenue_growth: Math.round(revenue_growth * 10) / 10,
      orders_growth: Math.round(orders_growth * 10) / 10,
    };
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    // Return zeros on error instead of mock data
    return {
      total_orders: 0,
      total_revenue: 0,
      total_customers: 0,
      total_products: 0,
      pending_orders: 0,
      low_stock_products: 0,
      revenue_growth: 0,
      orders_growth: 0,
    };
  }
}

// ============================================
// Dashboard Data Functions
// ============================================

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface OrderStatusData {
  status: string;
  count: number;
  percentage: number;
}

export async function getRevenueChartData(days: number = 30): Promise<RevenueDataPoint[]> {
  try {
    const ordersResponse = await adminFetch<any[]>('orders?limit=1000&order=created_at.desc');
    const orders = ordersResponse || [];

    // Group orders by date
    const revenueByDate: Record<string, { revenue: number; orders: number }> = {};

    orders.forEach(order => {
      if (!order.created_at || !order.total) return;
      const date = new Date(order.created_at);
      const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

      if (!revenueByDate[dateStr]) {
        revenueByDate[dateStr] = { revenue: 0, orders: 0 };
      }
      revenueByDate[dateStr].revenue += Number(order.total) || 0;
      revenueByDate[dateStr].orders += 1;
    });

    // Convert to array and limit to last N days
    const data = Object.entries(revenueByDate)
      .map(([date, data]) => ({ date, ...data }))
      .slice(-days);

    return data;
  } catch (error) {
    console.error('Failed to fetch revenue data:', error);
    return [];
  }
}

export async function getOrdersByStatus(): Promise<OrderStatusData[]> {
  try {
    const ordersResponse = await adminFetch<any[]>('orders?limit=1000');
    const orders = ordersResponse || [];

    // Count orders by status
    const statusCounts: Record<string, number> = {};
    orders.forEach(order => {
      const status = order.status || 'unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    const total = orders.length;
    return Object.entries(statusCounts).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));
  } catch (error) {
    console.error('Failed to fetch orders by status:', error);
    return [];
  }
}

export async function getRecentOrders(limit: number = 10): Promise<any[]> {
  try {
    const ordersResponse = await adminFetch<any[]>(`orders?limit=${limit}&order=created_at.desc`);
    return ordersResponse || [];
  } catch (error) {
    console.error('Failed to fetch recent orders:', error);
    return [];
  }
}

export async function getLowStockProducts(limit: number = 10): Promise<any[]> {
  try {
    const productsResponse = await adminFetch<any[]>('products?limit=1000');
    const products = productsResponse || [];

    // Filter products with low stock
    const lowStock = products
      .filter((p: any) => (Number(p.stock) || 0) < 10)
      .sort((a: any, b: any) => (Number(a.stock) || 0) - (Number(b.stock) || 0))
      .slice(0, limit);

    return lowStock;
  } catch (error) {
    console.error('Failed to fetch low stock products:', error);
    return [];
  }
}

// ============================================
// Customers API
// ============================================

export async function getCustomers(limit: number = 100): Promise<any[]> {
  try {
    const usersResponse = await adminFetch<any[]>(`customers?limit=${limit}&order=created_at.desc`);
    const users = usersResponse || [];

    // Fetch orders to calculate total_orders and total_spent per customer
    const ordersResponse = await adminFetch<any[]>('orders?limit=1000');
    const orders = ordersResponse || [];

    // Calculate customer stats
    const customerStats: Record<string, { total_orders: number; total_spent: number }> = {};
    orders.forEach((order: any) => {
      const customerId = order.customer_id;
      if (!customerId) return;

      if (!customerStats[customerId]) {
        customerStats[customerId] = { total_orders: 0, total_spent: 0 };
      }
      customerStats[customerId].total_orders += 1;
      customerStats[customerId].total_spent += Number(order.total) || 0;
    });

    // Map users with their stats
    return users.map((user: any) => ({
      ...user,
      total_orders: customerStats[user.id]?.total_orders || 0,
      total_spent: customerStats[user.id]?.total_spent || 0,
    }));
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    return [];
  }
}

export async function getCustomerById(id: string): Promise<any | null> {
  try {
    const [userResponse, ordersResponse] = await Promise.all([
      adminFetch<any[]>(`users?id=eq.${id}&limit=1`),
      adminFetch<any[]>(`orders?customer_id=eq.${id}&order=created_at.desc`),
    ]);

    const user = userResponse?.[0];
    if (!user) return null;

    const orders = ordersResponse || [];
    const total_orders = orders.length;
    const total_spent = orders.reduce((sum: number, order: any) => sum + (Number(order.total) || 0), 0);

    return {
      ...user,
      total_orders,
      total_spent,
      orders,
    };
  } catch (error) {
    console.error('Failed to fetch customer:', error);
    return null;
  }
}

// ============================================
// Site Settings API
// ============================================

export async function getSiteSettings(): Promise<any> {
  try {
    const response = await adminFetch<any[]>('site_settings?limit=1');
    return response?.[0] || null;
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
    return null;
  }
}

export async function saveSiteSettings(data: Record<string, any>): Promise<void> {
  try {
    // Try to update existing settings (id=1)
    const existing = await getSiteSettings();
    
    if (existing) {
      await adminFetch<void>('site_settings?id=eq.' + existing.id, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    } else {
      // Create new settings if none exist
      await adminFetch<void>('site_settings', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  } catch (error) {
    console.error('Failed to save site settings:', error);
    throw error;
  }
}
