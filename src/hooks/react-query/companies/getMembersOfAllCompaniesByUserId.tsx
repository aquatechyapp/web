import { useQuery } from '@tanstack/react-query';

import { clientAxios } from '@/lib/clientAxios';
import { CompanyMember } from '@/ts/interfaces/Company';
import { useMembersStore } from '@/store/members';
import { useShallow } from 'zustand/react/shallow';
import { useUserStore } from '@/store/user';

export default function useGetMembersOfAllCompaniesByUserId(userId: string) {
  const { setMembers } = useMembersStore(
    useShallow((state) => ({
      setMembers: state.setMembers,
      setAssignmentToId: state.setAssignmentToId
    }))
  );

  const user = useUserStore((state) => state.user);

  const {
    data = [],
    isLoading,
    isSuccess
  } = useQuery({
    queryKey: ['companyMembers', userId],
    queryFn: async () => {
      const response = await clientAxios.get(`/companies/members/${userId}`);

      const members: CompanyMember[] = response.data.members ? response.data.members : [];

      // When the user has no company, the response will be an empty array, so we need to add the user to the members array.

      // if (members.length === 0) {
      //   members.push({
      //     id: user.id,
      //     firstName: user.firstName,
      //     lastName: user.lastName,
      //     email: user.email,
      //     phone: user.phone,
      //     company: {
      //       id: '',
      //       name: '',
      //     },
      //     role: 'Owner',
      //     user: {
      //       id: user.id,
      //       email: user.email,
      //       name: user.name,
      //       avatar: user.avatar
      //     }
      //   });
      // }

      setMembers(members);

      return members;
    }
  });
  return { data, isLoading, isSuccess };
}
