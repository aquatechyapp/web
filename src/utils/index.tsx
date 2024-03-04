import { Pool } from '@/constants/interfaces';

export function createFormData(data: Record<string, string>) {
  const formData = new FormData();
  for (const key in data) {
    switch (key) {
      case 'photo':
        data[key].forEach((photo) => formData.append(key, photo.file));
        break;
      default:
        formData.append(key, data[key]);
        break;
    }
  }
  return formData;
}

export function calculateTotalMonthlyOfAllPools(pools: Pool[]) {
  return pools.reduce((acc, pool) => acc + pool.montlyPayment, 0);
}

export function calculateTotalAssignmentsOfAllPools(pools: Pool[]) {
  return pools.reduce((acc, pool) => acc + pool.assignments.length, 0);
}

export function buildSelectOptions(
  data: any[],
  { id, name, value }: { id: string; name: string; value: string }
) {
  return data.map((item) => ({
    id: item[id],
    name: item[name],
    value: item[value]
  }));
}
