import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getConfig } from './api';
import type { UserPreferences, Favorite, ActivityLogEntry } from '@/types';

let supabase: SupabaseClient | null = null;

// Initialize Supabase client
export async function initSupabase(): Promise<SupabaseClient | null> {
    if (supabase) return supabase;

    try {
        const config = await getConfig();
        if (!config.supabase.url || !config.supabase.anonKey) {
            console.error('Supabase configuration not available');
            return null;
        }

        supabase = createClient(config.supabase.url, config.supabase.anonKey);
        return supabase;
    } catch (err) {
        console.error('Failed to initialize Supabase:', err);
        return null;
    }
}

// Get or create user ID (anonymous user for dashboard)
export function getUserId(): string {
    let userId = localStorage.getItem('streetgasm_user_id');
    if (!userId) {
        userId = 'user_' + crypto.randomUUID();
        localStorage.setItem('streetgasm_user_id', userId);
    }
    return userId;
}

// User Preferences
export async function getUserPreferences(): Promise<UserPreferences | null> {
    const client = await initSupabase();
    if (!client) return null;

    const userId = getUserId();
    const { data, error } = await client
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code === 'PGRST116') {
        return await createDefaultPreferences();
    }

    return data;
}

async function createDefaultPreferences(): Promise<UserPreferences | null> {
    const client = await initSupabase();
    if (!client) return null;

    const userId = getUserId();
    const defaults: UserPreferences = {
        user_id: userId,
        theme: 'dark',
        accent_color: '#fbbf24',
        dashboard_title: 'StreetGasm Dashboard',
        company_name: 'StreetGasm',
        widget_order: [],
        quick_links: [],
        notifications_enabled: true,
    };

    const { data } = await client
        .from('user_preferences')
        .insert(defaults)
        .select()
        .single();

    return data || defaults;
}

export async function saveUserPreferences(
    preferences: Partial<UserPreferences>
): Promise<{ data: UserPreferences | null; error: unknown }> {
    const client = await initSupabase();
    if (!client) return { data: null, error: 'Supabase not initialized' };

    const userId = getUserId();
    const { data, error } = await client
        .from('user_preferences')
        .upsert({
            ...preferences,
            user_id: userId,
            updated_at: new Date().toISOString(),
        })
        .select()
        .single();

    return { data, error };
}

// Favorites
export async function getFavorites(): Promise<Favorite[]> {
    const client = await initSupabase();
    if (!client) return [];

    const userId = getUserId();
    const { data } = await client
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    return data || [];
}

export async function addFavorite(
    itemType: Favorite['item_type'],
    itemId: string,
    displayName: string
): Promise<Favorite | null> {
    const client = await initSupabase();
    if (!client) return null;

    const userId = getUserId();
    const { data, error } = await client
        .from('favorites')
        .insert({
            user_id: userId,
            item_type: itemType,
            item_id: itemId,
            display_name: displayName,
        })
        .select()
        .single();

    if (!error) {
        await logActivity('add_favorite', itemType, itemId);
    }
    return data;
}

export async function removeFavorite(
    itemType: Favorite['item_type'],
    itemId: string
): Promise<boolean> {
    const client = await initSupabase();
    if (!client) return false;

    const userId = getUserId();
    const { error } = await client
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('item_type', itemType)
        .eq('item_id', itemId);

    if (!error) {
        await logActivity('remove_favorite', itemType, itemId);
    }
    return !error;
}

export async function isFavorite(
    itemType: Favorite['item_type'],
    itemId: string
): Promise<boolean> {
    const client = await initSupabase();
    if (!client) return false;

    const userId = getUserId();
    const { data } = await client
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('item_type', itemType)
        .eq('item_id', itemId)
        .single();

    return !!data;
}

// Activity Log
export async function logActivity(
    action: string,
    entityType?: string,
    entityId?: string,
    details?: Record<string, unknown>
): Promise<void> {
    const client = await initSupabase();
    if (!client) return;

    const userId = getUserId();
    await client.from('activity_log').insert({
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        details,
    });
}

export async function getActivityLog(limit = 50): Promise<ActivityLogEntry[]> {
    const client = await initSupabase();
    if (!client) return [];

    const { data } = await client
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    return data || [];
}

// Member Approvals
export async function getMemberApprovalStatus(
    woocommerceCustomerId: number
): Promise<{ approval_status: string; notes?: string } | null> {
    const client = await initSupabase();
    if (!client) return null;

    const { data } = await client
        .from('member_approvals')
        .select('*')
        .eq('woocommerce_customer_id', woocommerceCustomerId)
        .single();

    return data;
}

export async function setMemberApprovalStatus(
    woocommerceCustomerId: number,
    status: 'pending' | 'approved' | 'rejected' | 'waitlist',
    notes = ''
): Promise<boolean> {
    const client = await initSupabase();
    if (!client) return false;

    const userId = getUserId();
    const { error } = await client.from('member_approvals').upsert({
        woocommerce_customer_id: woocommerceCustomerId,
        approval_status: status,
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
        notes,
        updated_at: new Date().toISOString(),
    });

    if (!error) {
        await logActivity('update_approval', 'member', String(woocommerceCustomerId), {
            status,
            notes,
        });
    }
    return !error;
}

// Get pending approvals
export interface MemberApproval {
    id: number;
    woocommerce_customer_id: number;
    approval_status: string;
    notes?: string;
    created_at: string;
    reviewed_by?: string;
    reviewed_at?: string;
}

export async function getPendingApprovals(): Promise<MemberApproval[]> {
    const client = await initSupabase();
    if (!client) return [];

    const { data } = await client
        .from('member_approvals')
        .select('*')
        .eq('approval_status', 'pending')
        .order('created_at', { ascending: true });

    return data || [];
}
