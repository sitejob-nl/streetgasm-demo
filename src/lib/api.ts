import axios from 'axios';
import type { Subscription, Order, Product } from '@/types';

// Supabase Edge Functions URL
const SUPABASE_URL = 'https://gzoprwdqrmrzlqentuxq.supabase.co';
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/wc-api`;

// Create axios instance for Edge Functions
const api = axios.create({
    baseURL: EDGE_FUNCTION_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Dashboard stats
export interface DashboardStats {
    activeMembers: number;
    totalOrders: number;
    upcomingEvents: number;
    pendingApprovals: number;
    totalRevenue: number;
    memberGrowth: number;
}

export async function getStats(): Promise<DashboardStats> {
    const { data } = await api.get('/stats');
    return data;
}

// Subscriptions (Members)
export interface SubscriptionFilters {
    page?: number;
    per_page?: number;
    status?: string;
}

export async function getSubscriptions(filters: SubscriptionFilters = {}) {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());
    if (filters.status) params.append('status', filters.status);

    const { data } = await api.get(`/subscriptions${params.toString() ? '?' + params.toString() : ''}`);
    return data as { data: Subscription[]; total: number; totalPages: number };
}

export async function getSubscription(id: number): Promise<Subscription> {
    const { data } = await api.get(`/subscriptions/${id}`);
    return data;
}

// Orders
export interface OrderFilters {
    page?: number;
    per_page?: number;
    status?: string;
}

export async function getOrders(filters: OrderFilters = {}) {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());
    if (filters.status) params.append('status', filters.status);

    const { data } = await api.get(`/orders${params.toString() ? '?' + params.toString() : ''}`);
    return data as { data: Order[]; total: number; totalPages: number };
}

// Products (Events)
export interface ProductFilters {
    page?: number;
    per_page?: number;
}

export async function getProducts(filters: ProductFilters = {}) {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());

    const { data } = await api.get(`/products${params.toString() ? '?' + params.toString() : ''}`);
    return data as { data: Product[]; total: number; totalPages: number };
}

// Convert subscription to member format for compatibility
export function subscriptionToMember(sub: Subscription) {
    return {
        id: sub.id,
        name: `${sub.billing?.first_name || ''} ${sub.billing?.last_name || ''}`.trim() || 'Unknown',
        email: sub.billing?.email || '',
        phone: sub.billing?.phone || '',
        status: sub.status === 'active' ? 'active' : 'inactive',
        memberType: 'Gold Member',
        joinDate: sub.start_date || sub.date_created,
        lastActive: sub.date_modified,
        avatar: null,
        car: sub.auto ? {
            brand: sub.auto.merk || 'Unknown',
            model: sub.auto.model || '',
            year: sub.auto.bouwjaar || '',
            image: sub.auto.foto || null,
            power: sub.auto.vermogen || '',
        } : null,
        location: {
            city: sub.billing?.city || '',
            country: sub.billing?.country || '',
        },
        subscription: {
            id: sub.id,
            status: sub.status,
            nextPayment: sub.next_payment_date,
            total: sub.total || '0',
        },
    };
}

// Get members (wrapper around subscriptions)
export async function getMembers(filters: SubscriptionFilters = {}) {
    const result = await getSubscriptions(filters);
    return {
        data: result.data.map(subscriptionToMember),
        total: result.total,
        totalPages: result.totalPages,
    };
}

// Trigger sync (admin function)
export async function triggerSync(entity: 'all' | 'subscriptions' | 'customers' | 'orders' | 'products' = 'all'): Promise<{ success: boolean; synced: Record<string, number> }> {
    const { data } = await axios.post(`${SUPABASE_URL}/functions/v1/wc-sync`, { entity });
    return data;
}

// Get sync status
export async function getSyncStatus(): Promise<{ lastSync: string; status: string }> {
    const { data } = await api.get('/sync-status');
    return data;
}
