import { useQuery } from '@tanstack/react-query';
import { getStats, getSubscriptions, getSubscription, subscriptionToMember } from '@/lib/api';
import type { DashboardStats, Subscription, Member } from '@/types';

/**
 * Hook for fetching dashboard statistics
 */
export function useStats() {
    return useQuery<DashboardStats>({
        queryKey: ['stats'],
        queryFn: getStats,
        staleTime: 30000, // 30 seconds
        retry: 2,
    });
}

/**
 * Hook for fetching subscriptions with optional filters
 */
export function useSubscriptions(params?: {
    page?: number;
    per_page?: number;
    status?: string;
    search?: string;
}) {
    return useQuery({
        queryKey: ['subscriptions', params],
        queryFn: () => getSubscriptions(params),
        staleTime: 30000,
        retry: 2,
    });
}

/**
 * Hook for fetching a single subscription by ID
 */
export function useSubscription(id: number) {
    return useQuery<Subscription>({
        queryKey: ['subscription', id],
        queryFn: () => getSubscription(id),
        enabled: !!id,
        staleTime: 30000,
    });
}

/**
 * Hook for fetching members (subscriptions converted to member format)
 */
export function useMembers(params?: {
    page?: number;
    per_page?: number;
    status?: string;
    search?: string;
}) {
    return useQuery<{ data: Member[]; total: number; totalPages: number; page: number }>({
        queryKey: ['members', params],
        queryFn: async () => {
            const result = await getSubscriptions(params);
            return {
                ...result,
                data: result.data.map(subscriptionToMember),
            };
        },
        staleTime: 30000,
        retry: 2,
    });
}

/**
 * Hook for fetching a single member by subscription ID
 */
export function useMember(id: number) {
    return useQuery<Member>({
        queryKey: ['member', id],
        queryFn: async () => {
            const subscription = await getSubscription(id);
            return subscriptionToMember(subscription);
        },
        enabled: !!id,
        staleTime: 30000,
    });
}
