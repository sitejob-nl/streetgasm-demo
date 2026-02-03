import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/lib/api';
import type { Order } from '@/types';

/**
 * Hook for fetching orders
 */
export function useOrders(params?: {
    page?: number;
    per_page?: number;
    status?: string;
}) {
    return useQuery<{ data: Order[]; total: number; totalPages: number; page: number }>({
        queryKey: ['orders', params],
        queryFn: () => getOrders(params),
        staleTime: 60 * 1000, // 1 minute
        retry: 2,
    });
}
