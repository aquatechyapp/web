import { LoadingSpinner } from '@/app/_components/LoadingSpinner';
import { User } from '@/interfaces/User';
import { clientAxios } from '@/services/clientAxios';
import { isEmpty } from '@/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

type UserContextType = {
  user: User | undefined;
  setUser: (user: User) => void;
};

const UserContext = createContext<UserContextType>({
  user: undefined,
  setUser: () => {}
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>();
  const userId = Cookies.get('userId');
  const { push } = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      if (pathname === '/login' || pathname === '/signup') {
        queryClient.cancelQueries({ queryKey: ['user'] });
        return {};
      }
      if (!userId) {
        queryClient.cancelQueries({ queryKey: ['user'] });
        push('/login');
        return {};
      }

      const response = await clientAxios.get(`/users/${userId}`);

      const user = {
        ...response.data.user,
        incomeAsACompany: response.data.incomeAsACompany,
        incomeAsASubcontractor: response.data.incomeAsASubcontractor
      };

      setUser(user);

      return user;
    }
  });

  useEffect(() => {
    if (isEmpty(data)) return;
    setUser(data);
  }, [data, userId]);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return push('/login');

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
