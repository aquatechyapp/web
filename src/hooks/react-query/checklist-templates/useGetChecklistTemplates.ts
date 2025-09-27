import { useQuery } from '@tanstack/react-query';

import { clientAxios } from '../../../lib/clientAxios';
import { ChecklistTemplatesResponse } from '../../../ts/interfaces/ChecklistTemplates';

interface GetChecklistTemplatesParams {
  companyId: string;
  poolId?: string;
  isDefault?: boolean;
}

export const useGetChecklistTemplates = (params: GetChecklistTemplatesParams) => {
  return useQuery({
    queryKey: ['checklist-templates', params],
    queryFn: async (): Promise<ChecklistTemplatesResponse> => {
      const queryParams = new URLSearchParams();
      queryParams.append('companyId', params.companyId);
      if (params.poolId) queryParams.append('poolId', params.poolId);
      if (params.isDefault !== undefined) queryParams.append('isDefault', params.isDefault.toString());

      const queryString = queryParams.toString();
      
      const response = await clientAxios.get(`/checklist-templates?${queryString}`);
      return response.data;
    },
    enabled: !!params.companyId
  });
};
