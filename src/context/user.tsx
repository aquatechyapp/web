import Loading from '@/app/(authenticated)/loading';
import useLocalStorage from '@/hooks/useLocalStorage';
import { clientAxios } from '@/services/clientAxios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext({
  user: {},
  setUser: (user) => {}
});

export const LoadingProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState({});
  const userId = Cookies.get('userId');
  const { push } = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      if (pathname === '/login' || pathname === '/signup') {
        queryClient.cancelQueries({ queryKey: ['user'] });
        return {};
      }
      if (!userId) {
        queryClient.cancelQueries({ queryKey: ['user'] });
        return push('/login');
      }

      const response = await clientAxios.get(`/users/${userId}`);

      setUser(response.data.user);

      return response.data.user;
    },
    staleTime: Infinity
  });

  if (isLoading) return <Loading />;
  if (isError) return push('/login');

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
