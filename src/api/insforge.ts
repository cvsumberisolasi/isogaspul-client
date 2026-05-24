// ============================================
// API Client — ISOGASPUL
// InsForge Backend (PostgreSQL + REST API)
// ============================================

import type {
  Product, Category, Order, Blog, SiteSettings,
  Banner, Testimonial, TierPricing,
  ShippingAddress, OrderItem
} from '../types';

// Configuration
const API_BASE_URL = 'https://c8kze9fw.ap-southeast.insforge.app';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NTk2MTh9.akZ1zoSDtqaLMVp8ptgcN3KPNwJRoMJ2MPZsDl7khII';

// Auth Token Management
export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

export function clearAuthToken(): void {
  localStorage.removeItem('auth_token');
}

function getAuthHeader(): string {
  const token = getAuthToken();
  return token ? `Bearer ${token}` : `Bearer ${ANON_KEY}`;
}

// HTTP Client
async function insforgeFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
    console.error(`InsForge API Error:`, errorMsg);
    throw new Error(errorMsg);
  }

  if (response.status === 204) return {} as T;
  return response.json();
}

// ============================================
// Products API
// ============================================
export async function getProducts(params?: { category?: string; limit?: number; featured?: boolean }): Promise<Product[]> {
  const query = new URLSearchParams();
  query.set('is_active', 'eq.true');
  if (params?.featured) query.set('is_featured', 'eq.true');
  if (params?.limit) query.set('limit', String(params.limit));
  query.set('order', 'name.asc');

  const products = await insforgeFetch<Product[]>('products?' + query.toString());

  const categories = await getCategories();
  return products.map(p => {
    const catId = (p as any).category_id;
    const matchedCat = categories.find(c => c.id === catId || c.name === catId || c.slug === catId);
    return { ...p, category: matchedCat || String(catId) };
  });
}

export async function getFeaturedProducts(limit?: number): Promise<Product[]> {
  return getProducts({ featured: true, limit: limit || 8 });
}

export async function getProduct(idOrSlug: string): Promise<Product | null> {
  try {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    const filterField = isUUID ? 'id' : 'slug';
    const query = new URLSearchParams();
    query.set(filterField, `eq.${idOrSlug}`);
    query.set('limit', '1');

    const [product] = await insforgeFetch<Product[]>('products?' + query.toString());
    if (!product) return null;

    const categories = await getCategories();
    const catId = (product as any).category_id;
    const matchedCat = categories.find(c => c.id === catId || c.name === catId || c.slug === catId);
    return { ...product, category: matchedCat || String(catId) };
  } catch {
    return null;
  }
}

// ============================================
// Categories API
// ============================================
export async function getCategories(): Promise<Category[]> {
  try {
    return await insforgeFetch<Category[]>('categories?order=sort_order.asc');
  } catch {
    return [];
  }
}

// ============================================
// Tier Pricing API
// ============================================
export async function getTierPricing(productId: string): Promise<TierPricing[]> {
  try {
    return await insforgeFetch<TierPricing[]>('tier_pricing?product_id=eq.' + productId + '&order=min_quantity.asc');
  } catch {
    return [];
  }
}

// ============================================
// Testimonials API
// ============================================
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    return await insforgeFetch<Testimonial[]>('testimonials?is_active=eq.true&order=created_at.desc');
  } catch {
    return [];
  }
}

// ============================================
// Banners API
// ============================================
export async function getBanners(): Promise<Banner[]> {
  try {
    return await insforgeFetch<Banner[]>('banners?is_active=eq.true&order=sort_order.asc');
  } catch {
    return [];
  }
}

// ============================================
// Blogs API
// ============================================
export async function getBlogs(params?: { limit?: number; featured?: boolean }): Promise<Blog[]> {
  const query = new URLSearchParams();
  query.set('is_published', 'eq.true');
  query.set('order', 'published_at.desc');
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.featured) query.set('is_featured', 'eq.true');

  try {
    return await insforgeFetch<Blog[]>('blogs?' + query.toString());
  } catch {
    return [];
  }
}

export async function getBlog(idOrSlug: string): Promise<Blog | null> {
  try {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    const filterField = isUUID ? 'id' : 'slug';
    const query = new URLSearchParams();
    query.set(filterField, `eq.${idOrSlug}`);
    query.set('limit', '1');

    const [blog] = await insforgeFetch<Blog[]>('blogs?' + query.toString());
    return blog || null;
  } catch {
    return null;
  }
}

// ============================================
// Site Settings API
// ============================================
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const settings = await insforgeFetch<SiteSettings[]>('site_settings?limit=1');
    return settings[0] || {};
  } catch {
    return {};
  }
}

// ============================================
// Orders API
// ============================================
export async function getOrders(customerId?: string): Promise<Order[]> {
  const query = new URLSearchParams();
  query.set('order', 'created_at.desc');
  if (customerId) query.set('customer_id', 'eq.' + customerId);
  return insforgeFetch<Order[]>('orders?' + query.toString());
}

export async function createOrder(data: {
  customer_id: string | null;
  order_number: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  status: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  notes?: string;
  items: OrderItem[];
  shipping_address: ShippingAddress;
}): Promise<Order> {
  return insforgeFetch<Order>('orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
    body: JSON.stringify(data),
  });
}

export async function updateOrderStatus(orderId: string, status: string): Promise<Order> {
  return insforgeFetch<Order>(`orders?id=eq.${orderId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}

// ============================================
// User Addresses API
// ============================================
export interface UserAddress {
  id: string;
  customer_id: string;
  label: string;
  recipient_name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  is_default: boolean;
  created_at: string;
}

export async function getUserAddresses(customerId: string): Promise<UserAddress[]> {
  const query = new URLSearchParams();
  query.set('customer_id', `eq.${customerId}`);
  query.set('order', 'is_default.desc,created_at.desc');
  return insforgeFetch<UserAddress[]>('user_addresses?' + query.toString());
}

export async function createAddress(data: {
  customer_id: string;
  label: string;
  recipient_name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  is_default: boolean;
}): Promise<UserAddress> {
  // If setting as default, unset other defaults first
  if (data.is_default) {
    try {
      await insforgeFetch(`user_addresses?customer_id=eq.${data.customer_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_default: false }),
      });
    } catch (e) {
      console.warn('Failed to unset default addresses:', e);
    }
  }

  return insforgeFetch<UserAddress>('user_addresses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function updateAddress(addressId: string, data: Partial<UserAddress>): Promise<UserAddress> {
  // If setting as default, unset other defaults first
  if (data.is_default && data.customer_id) {
    try {
      await insforgeFetch(`user_addresses?customer_id=eq.${data.customer_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_default: false }),
      });
    } catch (e) {
      console.warn('Failed to unset default addresses:', e);
    }
  }

  return insforgeFetch<UserAddress>(`user_addresses?id=eq.${addressId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteAddress(addressId: string): Promise<void> {
  await insforgeFetch(`user_addresses?id=eq.${addressId}`, {
    method: 'DELETE',
  });
}

// ============================================
// Utility Functions
// ============================================
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('data:')) return path;
  if (path.startsWith('http')) return path;
  if (path.includes('/api/storage/')) return path;
  return `${API_BASE_URL}/api/storage/buckets/product-images/objects/${encodeURIComponent(path)}`;
}

export function getProductImage(product: Product): string {
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    const img = product.images[0];
    if (img && typeof img === 'string' && img.startsWith('data:')) return img;
    if (img && typeof img === 'string') return getImageUrl(img);
  }
  return getImageUrl(product.image_url);
}

export function formatPrice(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDate(date: string | Date | undefined): string {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function calculateTierPrice(price: number, quantity: number, tiers?: TierPricing[]): number {
  if (!tiers || tiers.length === 0) return price;
  const sortedTiers = [...tiers].sort((a, b) => b.min_quantity - a.min_quantity);
  const applicableTier = sortedTiers.find(t => quantity >= t.min_quantity);
  return applicableTier ? applicableTier.price : price;
}

// ============================================
// WhatsApp Helper
// ============================================
export function sendWhatsAppOrder(order: {
  customer_name: string;
  customer_phone: string;
  address: string;
  city: string;
  notes?: string;
  items: { name: string; quantity: number; price: number; total: number }[];
  subtotal: number;
  order_number?: string;
}): void {
  const waNumber = import.meta.env.VITE_WA_NUMBER || '6281394373007';
  
  let message = `🛒 PESANAN BARU — ISOGASPUL\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  if (order.order_number) {
    message += `📋 No. Pesanan: ${order.order_number}\n`;
  }
  message += `👤 Nama: ${order.customer_name}\n`;
  message += `📱 WhatsApp: ${order.customer_phone}\n`;
  message += `📍 Alamat: ${order.address}\n`;
  message += `🏙️ Kota: ${order.city}\n`;
  if (order.notes) {
    message += `📝 Catatan: ${order.notes}\n`;
  }
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📦 Item:\n`;
  
  order.items.forEach((item, i) => {
    message += `${i + 1}. ${item.name} x ${item.quantity} @ ${formatPrice(item.price)} = ${formatPrice(item.total)}\n`;
  });
  
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 Total Produk: ${formatPrice(order.subtotal)}\n`;
  message += `🚚 Biaya Kirim: [MENUNGGU KONFIRMASI ADMIN]\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `Total Final: [MENUNGGU KONFIRMASI ADMIN]\n\n`;
  message += `✅ Pesanan sudah tersimpan di sistem kami.\n`;
  message += `Admin akan menghubungi Anda untuk konfirmasi biaya kirim.`;

  window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
}

// ============================================
// Invoice API
// ============================================
export interface InvoiceData {
  invoice_number: string;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_city?: string;
  items: unknown[];
  product_total: number;
  shipping_cost: number;
  grand_total: number;
  status: string;
  notes?: string;
}

export async function createInvoice(data: InvoiceData): Promise<InvoiceData> {
  return insforgeFetch<InvoiceData>('invoices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
    body: JSON.stringify(data),
  });
}

export async function getInvoiceByNumber(invoiceNumber: string): Promise<InvoiceData | null> {
  try {
    const results = await insforgeFetch<InvoiceData[]>(`invoices?invoice_number=eq.${encodeURIComponent(invoiceNumber)}&limit=1`);
    return results[0] || null;
  } catch {
    return null;
  }
}

export async function getInvoicesByOrder(orderId: string): Promise<InvoiceData[]> {
  return insforgeFetch<InvoiceData[]>(`invoices?order_id=eq.${orderId}&order=created_at.desc`);
}

export async function updateInvoiceShipping(invoiceNumber: string, shippingCost: number): Promise<InvoiceData> {
  const invoice = await getInvoiceByNumber(invoiceNumber);
  if (!invoice) throw new Error('Invoice tidak ditemukan');
  const grandTotal = invoice.product_total + shippingCost;
  return insforgeFetch<InvoiceData>(`invoices?id=eq.${(invoice as any).id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipping_cost: shippingCost, grand_total: grandTotal, status: 'confirmed' }),
  });
}

export async function updateOrderShipping(orderId: string, shippingCost: number): Promise<Order> {
  const [order] = await insforgeFetch<Order[]>(`orders?id=eq.${orderId}&limit=1`);
  if (!order) throw new Error('Order tidak ditemukan');
  const newTotal = order.subtotal + shippingCost;
  return insforgeFetch<Order>(`orders?id=eq.${orderId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipping_cost: shippingCost, total: newTotal }),
  });
}

// Auth API
export async function authLogin(email: string, password: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/auth/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(error.message || 'Email atau password salah');
  }

  const data = await response.json();
  if (data.accessToken) {
    setAuthToken(data.accessToken);
  }
  return data;
}

export async function authRegister(email: string, password: string, name?: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/auth/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Registration failed' }));
    throw new Error(error.message || 'Registrasi gagal');
  }

  const data = await response.json();
  if (data.accessToken) {
    setAuthToken(data.accessToken);
  }
  return data;
}

export async function authGetCurrentUser(): Promise<any> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/sessions/current`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.user || data;
  } catch {
    return null;
  }
}

export async function authLogout(): Promise<void> {
  const token = getAuthToken();
  if (token) {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    } catch {}
  }
  clearAuthToken();
}
