import { useQuery } from '@tanstack/react-query';
import { getSubscriptions, subscriptionToMember } from '@/lib/api';
import type { Member } from '@/types';

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
