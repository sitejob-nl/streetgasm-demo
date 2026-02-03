// TypeScript types for StreetGasm Dashboard

export interface Member {
    id: number;
    customer_id: number;
    first_name: string;
    last_name: string;
    email: string;
    status: 'active' | 'on-hold' | 'pending' | 'cancelled';
    start_date: string;
    next_payment_date?: string;
    billing: BillingInfo;
    auto?: VehicleInfo;
    goedkeuring?: ApprovalInfo;
}

export interface BillingInfo {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    address_1?: string;
    city?: string;
    postcode?: string;
    country?: string;
}

export interface VehicleInfo {
    merk?: string;
    model?: string;
    bouwjaar?: string;
    kleur?: string;
    vermogen?: string | number;
    foto?: string;
}

export interface ApprovalInfo {
    status: 'pending' | 'approved' | 'rejected' | 'waitlist';
    time?: string;
    notes?: string;
}

export interface Subscription {
    id: number;
    customer_id: number;
    status: string;
    start_date: string;
    next_payment_date?: string;
    date_created?: string;
    date_modified?: string;
    billing: BillingInfo;
    total: string;
    line_items: LineItem[];
    auto?: VehicleInfo;
    goedkeuring?: ApprovalInfo;
}

export interface Order {
    id: number;
    status: string;
    date_created: string;
    total: string;
    billing: BillingInfo;
    line_items: LineItem[];
}

export interface LineItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
    total: string;
}

export interface Product {
    id: number;
    name: string;
    price: string;
    stock_status: 'instock' | 'outofstock';
    stock_quantity?: number;
    images?: { src: string }[];
    categories?: { name: string }[];
    description?: string;
    short_description?: string;
    date_created?: string;
    total_sales?: number;
    attributes?: { name: string; options?: string[] }[];
}

export interface Event {
    id: number;
    name: string;
    price: string;
    stock_status: 'instock' | 'outofstock';
    stock_quantity?: number;
    images?: { src: string }[];
    categories?: { name: string }[];
    description?: string;
    short_description?: string;
    date_created?: string;
    total_sales?: number;
    attributes?: { name: string; options?: string[] }[];
}

export interface DashboardStats {
    subscriptions?: {
        total: number;
        byStatus: Record<string, number>;
    };
    customers?: number;
    orders?: number;
    products?: number;
}

export interface UserPreferences {
    user_id: string;
    theme: 'dark' | 'light';
    accent_color: string;
    dashboard_title: string;
    company_name: string;
    widget_order: string[];
    quick_links: QuickLink[];
    notifications_enabled: boolean;
}

export interface QuickLink {
    id: string;
    label: string;
    url: string;
    icon?: string;
}

export interface Favorite {
    id: string;
    user_id: string;
    item_type: 'member' | 'event' | 'order';
    item_id: string;
    display_name: string;
    created_at: string;
}

export interface ActivityLogEntry {
    id: string;
    user_id: string;
    action: string;
    entity_type?: string;
    entity_id?: string;
    details?: Record<string, unknown>;
    created_at: string;
}
