import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientAxios } from '@/lib/clientAxios';
import { FilterType, EquipmentCondition } from '@/ts/enums/enums';

export interface UpdateFilterDto {
  poolId: string;
  filter: {
    model?: string;
    serialNumber?: string;
    type?: FilterType;
    condition?: EquipmentCondition;
    recommendedCleaningIntervalDays?: number;
    warrantyExpirationDate?: string;
    photos?: string[];
    lastCleaningDate?: string;
    replacementDate?: string;
  };
}

export function useUpdateFilter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFilterDto) => {
      return await clientAxios.patch(`/pools/${data.poolId}/filter`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pools'] });
    }
  });
}
