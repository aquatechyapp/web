import { useQuery } from '@tanstack/react-query';

import { clientAxios } from '@/lib/clientAxios';
import { Client } from '@/ts/interfaces/Client';
import { CompanyMember } from '@/ts/interfaces/Company';

export default function useGetMembersOfACompany(companyId: string) {
  const {
    data = [],
    isLoading,
    isSuccess
  } = useQuery({
    queryKey: ['companyMembers'],
    queryFn: async () => {
      const response = await clientAxios(`/companies/${companyId}/members`);
      // create a full name for eacth client by combining first and last name

      const members: CompanyMember[] | [] = response.data.members ? response.data.members : [];

      return members;
    }
  });
  return { data, isLoading, isSuccess };
}
