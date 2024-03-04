'use server';

import { api } from '@/services/api';
import { cookies } from 'next/headers';

export async function getClientsWithAssignments() {
  const userId = cookies().get('userId')?.value;

  try {
    const response = await api.get(`/assignments`).then((res) => res.data);
    return { assignments: response };
  } catch (error) {
    return { error };
  }
}
