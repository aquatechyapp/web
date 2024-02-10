import { api } from '@/services/api';

export async function POST(req: Request) {
  const form = await req.formData();

  try {
    const a = await api.post('/client-pool', form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  } catch (error) {
    return new Response('Error', { status: 500 });
  }
  return new Response('Created', { status: 201 });
}
