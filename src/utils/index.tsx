import { Pool } from '@/constants/interfaces';

export function createFormData(data: Record<string, string>) {
  const formData = new FormData();
  for (const key in data) {
    switch (key) {
      case 'photo':
        // append multiples key photo to the form data (consider photo is an array)
        data[key].forEach((photo) => formData.append(key, photo.file));
        // formData.append(key, data[key][0]);
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

// pools is an array and each pool has an array of assignments
// i need to calculate the total of all assignments
export function calculateTotalAssignmentsOfAllPools(pools: Pool[]) {
  return pools.reduce((acc, pool) => acc + pool.assignments.length, 0);
}
