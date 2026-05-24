// ============================================
// Type Definitions — ISOGASPUL
// ============================================

export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
}

// Product Types
export interface Product extends BaseEntity {
  name: string;
  slug: string;
  category_id?: string;
  category?: string | Category;
  description?: string;
  short_description?: string;
  price: number;
  compare_at_price?: number;
  unit?: string;
  thickness?: string;
  density?: string;
  stock: number;
  sku?: string;
  min_order?: number;
  weight?: number;
  temperature_max?: string;
  fire_rating?: string;
  application_area?: string[];
  is_featured?: boolean;
  is_active?: boolean;
  specifications?: Record<string, unknown>;
  images?: string[];
  image_url?: string;
  avg_rating?: number;
  review_count?: number;
}

export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface TierPricing {
  id: string;
  product_id: string;
  min_quantity: number;
  max_quantity?: number;
  price: number;
  discount_percent?: number;
  is_active?: boolean;
  created_at?: string;
}

// Testimonial
export interface Testimonial extends BaseEntity {
  customer_name: string;
  customer_company?: string;
  customer_image?: string;
  content: string;
  rating: number;
  product_id?: string;
  is_featured?: boolean;
  is_active?: boolean;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
  tier_price?: number;
}

export interface CartState {
  items: CartItem[];
  shippingCost: number;
  couponDiscount: number;
  couponCode?: string;
}

// Order Types
export interface ShippingAddress {
  id?: string;
  label?: string;
  recipient_name: string;
  phone: string;
  address: string;
  city?: string;
  province?: string;
  postal_code?: string;
  is_default?: boolean;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id?: string;
  product?: Product;
  product_name: string;
  product_image?: string;
  price: number;
  quantity: number;
  unit?: string;
  total_price?: number;
}

export interface Order extends BaseEntity {
  order_number: string;
  customer_id?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shipping_cost?: number;
  total: number;
  payment_status?: 'unpaid' | 'paid' | 'failed';
  shipping_address: ShippingAddress | string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  notes?: string;
  items?: OrderItem[];
}

// Invoice
export interface Invoice extends BaseEntity {
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

// Blog
export interface Blog extends BaseEntity {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  image_url?: string;
  category?: string;
  tags?: string[];
  author_name?: string;
  is_published?: boolean;
  is_featured?: boolean;
  published_at?: string;
}

// Site Settings
export interface SiteSettings {
  site_name?: string;
  tagline?: string;
  description?: string;
  logo_url?: string;
  whatsapp_number?: string;
  email?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  operating_hours?: string;
  social_media?: Record<string, string>;
  // Frontend Content
  home_hero_title?: string;
  home_hero_subtitle?: string;
  home_hero_cta?: string;
  home_featured_text?: string;
  about_title?: string;
  about_content?: string;
  about_mission?: string;
  about_vision?: string;
  about_values?: string;
  contact_phone?: string;
  contact_whatsapp?: string;
  contact_email?: string;
  contact_address?: string;
  contact_hours?: string;
  contact_map_embed?: string;
  footer_text?: string;
  footer_copyright?: string;
}

// Banner
export interface Banner extends BaseEntity {
  title: string;
  subtitle?: string;
  image_url: string;
  link?: string;
  link_text?: string;
  is_active?: boolean;
  sort_order?: number;
}

// User
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
}

// User Address
export interface UserAddress extends BaseEntity {
  customer_id: string;
  label?: string;
  recipient_name: string;
  phone: string;
  address_line: string;
  city: string;
  province: string;
  postal_code?: string;
  is_default?: boolean;
}

// Admin Types
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin';
  created_at?: string;
}

export interface AdminStats {
  total_orders: number;
  total_revenue: number;
  total_customers: number;
  total_products: number;
  pending_orders: number;
  low_stock_products: number;
  revenue_growth?: number;
  orders_growth?: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface OrdersByStatus {
  status: string;
  count: number;
  percentage: number;
}
