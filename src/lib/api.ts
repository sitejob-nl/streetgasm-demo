import axios from 'axios';
import type { DashboardStats, Subscription, Order, Event, Member } from '@/types';

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

// API Response types
interface PaginatedResponse<T> {
    data: T[];
    total: number;
    totalPages: number;
    page: number;
}

// Dashboard Stats
export async function getStats(): Promise<DashboardStats> {
    const { data } = await api.get('/stats');
    return data;
}

// Subscriptions / Members
export async function getSubscriptions(params?: {
    page?: number;
    per_page?: number;
    status?: string;
    search?: string;
}): Promise<PaginatedResponse<Subscription>> {
    const { data } = await api.get('/subscriptions', { params });
    return data;
}

export async function getSubscription(id: number): Promise<Subscription> {
    const { data } = await api.get(`/subscriptions?id=${id}`);
    // Since we're querying from database, filter locally
    return data.data?.[0] || data;
}

// Convert subscription to member format
export function subscriptionToMember(sub: Subscription): Member {
    return {
        id: sub.id,
        customer_id: sub.customer_id,
        first_name: sub.billing?.first_name || '',
        last_name: sub.billing?.last_name || '',
        email: sub.billing?.email || '',
        status: sub.status as Member['status'],
        start_date: sub.start_date,
        next_payment_date: sub.next_payment_date,
        billing: sub.billing,
        auto: sub.auto,
        goedkeuring: sub.goedkeuring,
    };
}

// Customers
export async function getCustomers(params?: {
    page?: number;
    per_page?: number;
    search?: string;
}): Promise<PaginatedResponse<Member>> {
    const { data } = await api.get('/customers', { params });
    return data;
}

export async function getCustomer(id: number): Promise<Member> {
    const { data } = await api.get(`/customers?id=${id}`);
    return data.data?.[0] || data;
}

// Orders
export async function getOrders(params?: {
    page?: number;
    per_page?: number;
    status?: string;
}): Promise<PaginatedResponse<Order>> {
    const { data } = await api.get('/orders', { params });
    return data;
}

export async function getOrder(id: number): Promise<Order> {
    const { data } = await api.get(`/orders?id=${id}`);
    return data.data?.[0] || data;
}

// Products / Events
export async function getProducts(params?: {
    page?: number;
    per_page?: number;
    search?: string;
}): Promise<PaginatedResponse<Event>> {
    const { data } = await api.get('/products', { params });
    return data;
}

export async function getProduct(id: number): Promise<Event> {
    const { data } = await api.get(`/products?id=${id}`);
    return data.data?.[0] || data;
}

// Config (for Supabase credentials) - now hardcoded since we use Edge Functions
export async function getConfig(): Promise<{
    supabase: { url: string; anonKey: string };
}> {
    return {
        supabase: {
            url: SUPABASE_URL,
            anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6b3Byd2Rxcm1yemxxZW50dXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMzQ2MjUsImV4cCI6MjA4NTcxMDYyNX0.J9awhBKyMUOqgmkZAb1ir0XZKBwmVaky899RBaNLFPE',
        },
    };
}

// Trigger sync (admin function)
export async function triggerSync(entity: 'all' | 'subscriptions' | 'customers' | 'orders' | 'products' = 'all'): Promise<{ success: boolean; synced: Record<string, number> }> {
    const { data } = await axios.post(`${SUPABASE_URL}/functions/v1/wc-sync`, { entity });
    return data;
}

// Get sync status
export async function getSyncStatus(): Promise<{ logs: Array<{ entity_type: string; records_synced: number; status: string; started_at: string }> }> {
    const { data } = await api.get('/sync-status');
    return data;
}

export default api;