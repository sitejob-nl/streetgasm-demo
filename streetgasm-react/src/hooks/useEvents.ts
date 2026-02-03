import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/api';

export const useEvents = (page = 1, perPage = 10) => {
  return useQuery({
    queryKey: ['events', page, perPage],
    queryFn: () => getProducts({ page, per_page: perPage }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useEvents;
