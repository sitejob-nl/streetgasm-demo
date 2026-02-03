import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/lib/api';

export const useOrders = (page = 1, perPage = 10, status?: string) => {
  return useQuery({
    queryKey: ['orders', page, perPage, status],
    queryFn: () => getOrders({ page, per_page: perPage, status }),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export default useOrders;
