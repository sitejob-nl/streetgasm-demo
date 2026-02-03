import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/api';
import type { Event } from '@/types';

/**
 * Hook for fetching events (products from WooCommerce)
 */
export function useEvents(params?: {
    page?: number;
    per_page?: number;
    search?: string;
}) {
    return useQuery<{ data: Event[]; total: number; totalPages: number; page: number }>({
        queryKey: ['events', params],
        queryFn: () => getProducts(params),
        staleTime: 300 * 1000, // 5 minutes
        retry: 2,
    });
}
