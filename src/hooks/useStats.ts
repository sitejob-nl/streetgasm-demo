import { useQuery } from '@tanstack/react-query';
import { getStats } from '@/lib/api';
import type { DashboardStats } from '@/types';

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
