import { useQuery } from '@tanstack/react-query';
import { getStats } from '@/lib/api';

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useStats;
