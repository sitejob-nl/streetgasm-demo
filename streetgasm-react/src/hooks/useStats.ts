import { useQuery } from '@tanstack/react-query';
import { getStats } from '@/lib/api';
import type { DashboardStats } from '@/types';

/**
 * Hook for fetching dashboard statistics
 */
export function useStats() {
    return useQuery<DashboardStats>({
        queryKey: ['dashboard-stats'],
        queryFn: getStats,
        staleTime: 60000, // 1 minute
        retry: 2,
    });
}
