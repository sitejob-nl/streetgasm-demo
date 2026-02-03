// Subscription/Member types
export interface Subscription {
  id: number;
  parent_id: number;
  status: 'active' | 'on-hold' | 'pending' | 'cancelled' | 'expired';
  billing_period: string;
  billing_interval: string;
  start_date: string;
  next_payment_date: string;
  end_date?: string;
  total: string;
  billing: BillingInfo;
  shipping?: ShippingInfo;
  payment_method: string;
  payment_method_title: string;
  auto?: VehicleInfo;
  meta_data?: MetaData[];
}

export interface BillingInfo {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state?: string;
  postcode: string;
  country: string;
  email: string;
  phone?: string;
}

export interface ShippingInfo {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state?: string;
  postcode: string;
  country: string;
}

export interface VehicleInfo {
  merk?: string;
  model?: string;
  bouwjaar?: string;
  vermogen?: string;
  kenteken?: string;
  foto?: string;
}

// Order types
export interface Order {
  id: number;
  parent_id: number;
  status: 'pending' | 'processing' | 'on-hold' | 'completed' | 'cancelled' | 'refunded' | 'failed';
  currency: string;
  date_created: string;
  date_modified: string;
  total: string;
  customer_id: number;
  billing: BillingInfo;
  shipping?: ShippingInfo;
  payment_method: string;
  payment_method_title: string;
  line_items: OrderLineItem[];
  meta_data?: MetaData[];
}

export interface OrderLineItem {
  id: number;
  name: string;
  product_id: number;
  variation_id: number;
  quantity: number;
  subtotal: string;
  total: string;
}

// Product/Event types
export interface Product {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  date_modified: string;
  type: string;
  status: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  stock_quantity?: number;
  total_sales: number;
  images: ProductImage[];
  categories: ProductCategory[];
  attributes?: ProductAttribute[];
}

export interface ProductImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductAttribute {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

// Stats types
export interface Stats {
  activeMembers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  newMembersThisMonth: number;
  pendingOrders: number;
  upcomingEvents: number;
}

// Meta data
export interface MetaData {
  id: number;
  key: string;
  value: string | Record<string, unknown>;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  headers?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
}
