import { useQuery } from '@tanstack/react-query';
import { getStats, getSubscriptions, getOrders } from '@/lib/api';

// Combined hook for dashboard data
export const useDashboardData = () => {
  const statsQuery = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getStats,
    staleTime: 1000 * 60 * 5,
  });

  const subscriptionsQuery = useQuery({
    queryKey: ['dashboard-subscriptions'],
    queryFn: () => getSubscriptions({ page: 1, per_page: 10, status: 'active' }),
    staleTime: 1000 * 60 * 5,
  });

  const ordersQuery = useQuery({
    queryKey: ['dashboard-orders'],
    queryFn: () => getOrders({ page: 1, per_page: 5 }),
    staleTime: 1000 * 60 * 2,
  });

  return {
    stats: statsQuery.data,
    subscriptions: subscriptionsQuery.data?.data || [],
    orders: ordersQuery.data?.data || [],
    isLoading: statsQuery.isLoading || subscriptionsQuery.isLoading || ordersQuery.isLoading,
    isError: statsQuery.isError || subscriptionsQuery.isError || ordersQuery.isError,
  };
};

// Hook for subscription statistics
export const useSubscriptionStats = () => {
  return useQuery({
    queryKey: ['subscription-stats'],
    queryFn: async () => {
      const [active, pending, onHold] = await Promise.all([
        getSubscriptions({ status: 'active', per_page: 1 }),
        getSubscriptions({ status: 'pending', per_page: 1 }),
        getSubscriptions({ status: 'on-hold', per_page: 1 }),
      ]);

      return {
        active: parseInt(active.headers?.['x-wp-total'] || '0'),
        pending: parseInt(pending.headers?.['x-wp-total'] || '0'),
        onHold: parseInt(onHold.headers?.['x-wp-total'] || '0'),
      };
    },
    staleTime: 1000 * 60 * 10,
  });
};

// Hook for member detail
export const useMemberDetail = (id: number) => {
  return useQuery({
    queryKey: ['member', id],
    queryFn: () => getSubscriptions({ page: 1, per_page: 1 }).then((res) => {
      // Find the member by ID from all subscriptions
      return res.data?.find((s: { id: number }) => s.id === id) || null;
    }),
    enabled: !!id,
  });
};
