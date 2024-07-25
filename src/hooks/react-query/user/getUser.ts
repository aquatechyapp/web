import { useQuery } from '@tanstack/react-query';

import { SubcontractorStatus } from '@/constants/enums';
import { WorkRelation } from '@/interfaces/User';
import { clientAxios } from '@/lib/clientAxios';
import { useTechniciansStore } from '@/store/technicians';
import { useUserStore } from '@/store/user';

type Props = {
  userId: string;
};

export default function useGetUser({ userId }: Props) {
  const setUser = useUserStore((state) => state.setUser);
  const { setTechnicians, setAssignmentToId } = useTechniciansStore();

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await clientAxios.get(`/users/${userId}`);

      const user = {
        ...response.data.user,
        incomeAsACompany: response.data.incomeAsACompany,
        incomeAsASubcontractor: response.data.incomeAsASubcontractor
      };

      setUser(user);

      setAssignmentToId(user.id);
      setTechnicians([
        {
          subcontractor: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName
          }
        },
        ...user.subcontractors.filter((sub: WorkRelation) => sub.status === SubcontractorStatus.Active)
      ]);

      return user;
    }
  });

  return { data, isLoading, isSuccess };
}
