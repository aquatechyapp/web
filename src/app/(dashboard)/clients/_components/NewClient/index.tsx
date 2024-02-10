import { useRouter } from 'next/navigation';
import { FormClientAndPool } from './FormClientAndPool';
import { CreateFormData } from '@/utils';
import { clientAxios } from '@/services/clientAxios';

export async function NewClient() {
  async function sendData(data) {
    const formData = CreateFormData(data);
    const response = await clientAxios.post('/client-pool', formData);
  }
  return <FormClientAndPool />;
}
