import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment or config endpoint
let supabaseUrl = '';
let supabaseAnonKey = '';
let supabaseClient: ReturnType<typeof createClient> | null = null;

// Initialize Supabase client
const initSupabase = async () => {
  if (supabaseClient) return supabaseClient;

  try {
    // Try to get config from API
    const response = await fetch('/api/config');
    if (response.ok) {
      const config = await response.json();
      supabaseUrl = config.supabaseUrl || '';
      supabaseAnonKey = config.supabaseAnonKey || '';
    }
  } catch {
    console.warn('Could not fetch config, using defaults');
  }

  if (supabaseUrl && supabaseAnonKey) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabaseClient;
};

// Get or create user ID
export const getUserId = (): string => {
  let userId = localStorage.getItem('streetgasm_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('streetgasm_user_id', userId);
  }
  return userId;
};

// User Preferences
export interface UserPreferences {
  theme: 'dark' | 'light';
  accentColor: string;
  companyName: string;
  notificationsEnabled: boolean;
  emailDigest: 'daily' | 'weekly' | 'never';
  language: string;
}

const defaultPreferences: UserPreferences = {
  theme: 'dark',
  accentColor: '#fbbf24',
  companyName: 'Streetgasm',
  notificationsEnabled: true,
  emailDigest: 'weekly',
  language: 'en',
};

export const getPreferences = async (): Promise<UserPreferences> => {
  const client = await initSupabase();
  if (!client) return defaultPreferences;

  const userId = getUserId();

  try {
    const { data } = await client
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (data) {
      return {
        theme: data.theme || defaultPreferences.theme,
        accentColor: data.accent_color || defaultPreferences.accentColor,
        companyName: data.company_name || defaultPreferences.companyName,
        notificationsEnabled: data.notifications_enabled ?? defaultPreferences.notificationsEnabled,
        emailDigest: data.email_digest || defaultPreferences.emailDigest,
        language: data.language || defaultPreferences.language,
      };
    }
  } catch (error) {
    console.warn('Error fetching preferences:', error);
  }

  return defaultPreferences;
};

export const savePreferences = async (preferences: Partial<UserPreferences>): Promise<boolean> => {
  const client = await initSupabase();
  if (!client) return false;

  const userId = getUserId();

  try {
    const { error } = await client
      .from('user_preferences')
      .upsert({
        user_id: userId,
        theme: preferences.theme,
        accent_color: preferences.accentColor,
        company_name: preferences.companyName,
        notifications_enabled: preferences.notificationsEnabled,
        email_digest: preferences.emailDigest,
        language: preferences.language,
        updated_at: new Date().toISOString(),
      });

    return !error;
  } catch (error) {
    console.error('Error saving preferences:', error);
    return false;
  }
};

// Favorites
export const getFavorites = async (): Promise<number[]> => {
  const client = await initSupabase();
  if (!client) return [];

  const userId = getUserId();

  try {
    const { data } = await client
      .from('favorites')
      .select('member_id')
      .eq('user_id', userId);

    return data?.map((f) => f.member_id) || [];
  } catch {
    return [];
  }
};

export const toggleFavorite = async (memberId: number): Promise<boolean> => {
  const client = await initSupabase();
  if (!client) return false;

  const userId = getUserId();

  try {
    const { data: existing } = await client
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('member_id', memberId)
      .single();

    if (existing) {
      await client.from('favorites').delete().eq('id', existing.id);
    } else {
      await client.from('favorites').insert({
        user_id: userId,
        member_id: memberId,
      });
    }

    return true;
  } catch {
    return false;
  }
};

// Activity Log
export interface ActivityLogEntry {
  id: string;
  type: 'login' | 'view' | 'edit' | 'export' | 'approval' | 'rejection';
  description: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export const logActivity = async (
  type: ActivityLogEntry['type'],
  description: string,
  metadata?: Record<string, unknown>
): Promise<void> => {
  const client = await initSupabase();
  if (!client) return;

  const userId = getUserId();

  try {
    await client.from('activity_log').insert({
      user_id: userId,
      type,
      description,
      metadata,
    });
  } catch (error) {
    console.warn('Error logging activity:', error);
  }
};

export const getActivityLog = async (limit = 20): Promise<ActivityLogEntry[]> => {
  const client = await initSupabase();
  if (!client) return [];

  const userId = getUserId();

  try {
    const { data } = await client
      .from('activity_log')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    return data || [];
  } catch {
    return [];
  }
};

// Member Approvals
export interface MemberApproval {
  id: string;
  member_id: number;
  member_name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  processed_at?: string;
  notes?: string;
}

export const getPendingApprovals = async (): Promise<MemberApproval[]> => {
  const client = await initSupabase();
  if (!client) return [];

  try {
    const { data } = await client
      .from('member_approvals')
      .select('*')
      .eq('status', 'pending')
      .order('submitted_at', { ascending: true });

    return data || [];
  } catch {
    return [];
  }
};

export const processApproval = async (
  approvalId: string,
  status: 'approved' | 'rejected',
  notes?: string
): Promise<boolean> => {
  const client = await initSupabase();
  if (!client) return false;

  try {
    const { error } = await client
      .from('member_approvals')
      .update({
        status,
        processed_at: new Date().toISOString(),
        notes,
      })
      .eq('id', approvalId);

    if (!error) {
      await logActivity(
        status === 'approved' ? 'approval' : 'rejection',
        `Member ${status}: ${approvalId}`
      );
    }

    return !error;
  } catch {
    return false;
  }
};

export default initSupabase;
