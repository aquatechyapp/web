import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';

import { clientAxios } from '@/lib/clientAxios';
import { useUserStore } from '@/store/user';
import { SubcontractorStatus } from '@/ts/enums/enums';
import { User } from '@/ts/interfaces/User';
import { useMembersStore } from '@/store/members';

type Props = {
  userId: string;
};

export default function useGetUser({ userId }: Props) {
  const setUser = useUserStore((state) => state.setUser);
  const { setMembers, setAssignmentToId, setAssignedToId } = useMembersStore(
    useShallow((state) => ({
      setMembers: state.setMembers,
      setAssignmentToId: state.setAssignmentToId,
      setAssignedToId: state.setAssignedToid
    }))
  );

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = (await clientAxios.get(`/users/${userId}`)).data;
      const user = response.data.user as User;
      delete response.data.user;
      const userData: User = {
        ...user,
        ...response.data
      };

      setUser(userData);

      setAssignmentToId(user.id);
      setAssignedToId(user.id);

      return user;
    }
  });

  return { data, isLoading, isSuccess };
}
