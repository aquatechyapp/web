import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';

import { SubcontractorStatus } from '@/constants/enums';
import { User, WorkRelation } from '@/interfaces/User';
import { clientAxios } from '@/lib/clientAxios';
import { useTechniciansStore } from '@/store/technicians';
import { useUserStore } from '@/store/user';

type Props = {
  userId: string;
};

export default function useGetUser({ userId }: Props) {
  const setUser = useUserStore((state) => state.setUser);
  const { setTechnicians, setAssignmentToId } = useTechniciansStore(
    useShallow((state) => ({
      setTechnicians: state.setTechnicians,
      setAssignmentToId: state.setAssignmentToId
    }))
  );

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = (await clientAxios.get(`/users/${userId}`)).data;

      const user: User = {
        ...response.data.user,
        incomeAsACompany: response.data.incomeAsACompany,
        incomeAsASubcontractor: response.data.incomeAsASubcontractor
      };

      setUser(user);

      setAssignmentToId(user.id);
      setTechnicians([
        {
          subcontractor: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            company: user.company
          },
          paymentType: '',
          paymentValue: 0,
          status: SubcontractorStatus.Active,
          companyId: '',
          id: '',
          createdAt: '',
          company: {
            id: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            company: ''
          },
          subcontractorId: user.id
        },
        ...user.workRelationsAsAEmployer.filter((sub: WorkRelation) => sub.status === SubcontractorStatus.Active)
      ]);

      return user;
    }
  });

  return { data, isLoading, isSuccess };
}
