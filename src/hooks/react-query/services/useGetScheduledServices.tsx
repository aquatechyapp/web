import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import { clientAxios } from '@/lib/clientAxios';
import { useMembersStore } from '@/store/members';
import { useWeekdayStore } from '@/store/weekday';
import { useServicesContext } from '@/context/services';
import { Service } from '@/ts/interfaces/Service';

export default function useGetScheduledServices() {
  const { push } = useRouter();
  const userId = Cookies.get('userId');
  const { setServices } = useServicesContext();
  const assignedToId = useMembersStore((state) => state.assignedToId);
  const selectedDay = useWeekdayStore((state) => state.selectedDay);

  if (!userId) {
    push('/login');
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['schedule', userId],
    queryFn: async () =>
      await clientAxios.get('/services/schedule').then((res) => {
        const filteredServices = res.data?.filter(
          (service: Service) => service.scheduledTo === selectedDay && service.assignedToId === assignedToId
        );

        setServices([...filteredServices]);
      }),
    staleTime: 1000 * 60 * 60
  });

  return { data, isLoading, isError };
}
