import { useQuery } from '@tanstack/react-query';
import { getSubscriptions } from '@/lib/api';

export const useMembers = (page = 1, perPage = 10, status?: string) => {
  return useQuery({
    queryKey: ['members', page, perPage, status],
    queryFn: () => getSubscriptions({ page, per_page: perPage, status }),
    select: (response) => ({
      data: response.data?.map((sub: {
        id: number;
        billing: {
          first_name?: string;
          last_name?: string;
          email?: string;
          city?: string;
          country?: string;
        };
        status: string;
        start_date: string;
        auto?: {
          merk?: string;
          model?: string;
          bouwjaar?: string;
        };
      }) => ({
        id: sub.id,
        name: `${sub.billing?.first_name || ''} ${sub.billing?.last_name || ''}`.trim(),
        email: sub.billing?.email,
        status: sub.status,
        city: sub.billing?.city,
        country: sub.billing?.country,
        joinDate: sub.start_date,
        vehicle: sub.auto ? `${sub.auto.merk || ''} ${sub.auto.model || ''}`.trim() : undefined,
      })) || [],
      total: response.headers?.['x-wp-total'] || 0,
    }),
  });
};

export default useMembers;
