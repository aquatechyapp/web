import { useQuery } from '@tanstack/react-query';

import { clientAxios } from '@/lib/clientAxios';
import { CompanyMember } from '@/ts/interfaces/Company';
import { useMembersStore } from '@/store/members';
import { useShallow } from 'zustand/react/shallow';

export default function useGetMembersOfAllCompaniesByUserId(userId: string) {
  const { setMembers } = useMembersStore(
    useShallow((state) => ({
      setMembers: state.setMembers,
      setAssignmentToId: state.setAssignmentToId
    }))
  );

  const {
    data = [],
    isLoading,
    isSuccess
  } = useQuery({
    queryKey: ['companyMembers', userId],
    queryFn: async () => {
      const response = await clientAxios.get(`/companies/members/${userId}`);

      const members: CompanyMember[] | [] = response.data.members ? response.data.members : [];

      setMembers(members);

      return members;
    }
  });
  return { data, isLoading, isSuccess };
}
